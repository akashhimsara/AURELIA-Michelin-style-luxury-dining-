import React from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { db } from "@/lib/db";
import {
  CalendarDays,
  Users,
  BedDouble,
  Receipt,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard — AURELIA Admin",
};

export default async function AdminDashboardPage() {
  // 1. Fetch live operation aggregates
  const activeReservationsCount = await db.reservation.count({
    where: { status: "confirmed" },
  });

  const registeredGuestsCount = await db.user.count();

  const today = new Date();
  const roomsOccupiedCount = await db.reservation.count({
    where: {
      roomId: { not: null },
      status: "confirmed",
      date: { lte: today },
      checkOutDate: { gte: today },
    },
  });

  const totalRooms = (await db.room.count()) || 48;

  // Monthly Revenue Sum
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const revenueRes = await db.reservation.aggregate({
    _sum: {
      finalAmount: true,
    },
    where: {
      status: "confirmed",
      date: {
        gte: firstDayOfMonth,
      },
    },
  });
  const revenueThisMonth = Number(revenueRes._sum.finalAmount || 0);

  // Quick stats
  const pendingReviewCount = await db.reservation.count({
    where: { status: "pending" },
  });

  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);
  
  const confirmedTodayCount = await db.reservation.count({
    where: {
      status: "confirmed",
      date: { gte: startOfToday, lte: endOfToday },
    },
  });

  const requiresAttentionCount = await db.reservation.count({
    where: { status: "cancelled" },
  });

  const startOfWeek = new Date(today);
  startOfWeek.setDate(startOfWeek.getDate() - 7);
  const newThisWeekCount = await db.reservation.count({
    where: {
      createdAt: { gte: startOfWeek },
    },
  });

  // Recent activity list
  const recentReservations = await db.reservation.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  const stats = [
    { label: "Active Reservations", value: String(activeReservationsCount), icon: CalendarDays, trend: 12.4, accentColor: "bg-amber-500/10 text-amber-500" },
    { label: "Registered Guests",   value: String(registeredGuestsCount), icon: Users,       trend: 8.1,  accentColor: "bg-sky-500/10 text-sky-400" },
    { label: "Rooms Occupied",      value: `${roomsOccupiedCount} / ${totalRooms}`, icon: BedDouble, trend: -3.2, accentColor: "bg-violet-500/10 text-violet-400" },
    { label: "Revenue This Month",  value: `£${revenueThisMonth.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, icon: Receipt,  trend: 21.7, accentColor: "bg-emerald-500/10 text-emerald-400" },
  ];

  const quickStats = [
    { icon: Clock,        label: "Pending review",      value: String(pendingReviewCount), color: "text-amber-400" },
    { icon: CheckCircle2, label: "Confirmed today",      value: String(confirmedTodayCount), color: "text-emerald-400" },
    { icon: AlertCircle,  label: "Requires attention",  value: String(requiresAttentionCount),  color: "text-red-400" },
    { icon: TrendingUp,   label: "New this week",        value: String(newThisWeekCount), color: "text-sky-400" },
  ];

  const occupancyRate = Number(((roomsOccupiedCount / totalRooms) * 100).toFixed(1));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here is a real-time overview of AURELIA hotel operations."
      />

      {/* KPI Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activity Table */}
        <div className="xl:col-span-2 admin-card rounded-sm border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-inherit">
            <h2 className="text-xs uppercase tracking-widest font-semibold font-sans opacity-60">
              Recent Activity
            </h2>
            <span className="text-[10px] font-sans opacity-40">Last 24 hours</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-sans">
              <thead>
                <tr className="border-b border-inherit">
                  <th className="px-5 py-3 text-left font-medium opacity-40 uppercase tracking-wider text-[10px]">ID</th>
                  <th className="px-5 py-3 text-left font-medium opacity-40 uppercase tracking-wider text-[10px]">Guest</th>
                  <th className="px-5 py-3 text-left font-medium opacity-40 uppercase tracking-wider text-[10px] hidden md:table-cell">Type</th>
                  <th className="px-5 py-3 text-left font-medium opacity-40 uppercase tracking-wider text-[10px]">Status</th>
                  <th className="px-5 py-3 text-right font-medium opacity-40 uppercase tracking-wider text-[10px] hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentReservations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-zinc-500 opacity-60 font-sans">
                      No operational bookings activity recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentReservations.map((row) => {
                    const isRoom = !!row.roomId;
                    const statusColor =
                      row.status === "confirmed"
                        ? "text-emerald-400 bg-emerald-400/10"
                        : row.status === "cancelled"
                        ? "text-red-400 bg-red-400/10"
                        : "text-amber-400 bg-amber-400/10 animate-pulse";

                    return (
                      <tr key={row.id} className="border-b border-inherit last:border-b-0 hover:opacity-80 transition-opacity">
                        <td className="px-5 py-3.5 font-mono opacity-40 text-[10px]">
                          AUR-{row.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-5 py-3.5 font-medium">{row.name}</td>
                        <td className="px-5 py-3.5 opacity-60 hidden md:table-cell">
                          {row.bookedRoomName || "Fine Dining Table"}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColor}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right opacity-40 hidden sm:table-cell">
                          {new Date(row.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats Panel */}
        <div className="admin-card rounded-sm border overflow-hidden">
          <div className="px-5 py-4 border-b border-inherit">
            <h2 className="text-xs uppercase tracking-widest font-semibold font-sans opacity-60">
              Quick Overview
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {quickStats.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Icon size={14} className={`shrink-0 ${color}`} />
                  <span className="text-xs font-sans opacity-60 truncate">{label}</span>
                </div>
                <span className={`text-sm font-semibold font-sans tabular-nums ${color}`}>{value}</span>
              </div>
            ))}

            <div className="pt-4 mt-4 border-t border-inherit space-y-2">
              <div className="flex items-center justify-between text-[10px] font-sans opacity-40 uppercase tracking-wider">
                <span>Occupancy rate</span>
                <span>{occupancyRate}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${occupancyRate}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
