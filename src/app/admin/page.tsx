import React from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
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

const STATS = [
  { label: "Active Reservations", value: "148", icon: CalendarDays, trend: 12.4, accentColor: "bg-amber-500/10 text-amber-500" },
  { label: "Registered Guests",   value: "2,841", icon: Users,       trend: 8.1,  accentColor: "bg-sky-500/10 text-sky-400" },
  { label: "Rooms Occupied",      value: "34 / 48", icon: BedDouble, trend: -3.2, accentColor: "bg-violet-500/10 text-violet-400" },
  { label: "Revenue This Month",  value: "£284,500", icon: Receipt,  trend: 21.7, accentColor: "bg-emerald-500/10 text-emerald-400" },
];

const RECENT_ACTIVITY = [
  { id: "RES-1041", guest: "James Harrington",   type: "Suite Imperiale",    status: "Confirmed", time: "2m ago",   statusColor: "text-emerald-400 bg-emerald-400/10" },
  { id: "RES-1040", guest: "Sophia Castellano",  type: "Spa & Wellness",     status: "Pending",   time: "18m ago",  statusColor: "text-amber-400 bg-amber-400/10" },
  { id: "RES-1039", guest: "Oliver Blackwood",   type: "Private Dining",     status: "Confirmed", time: "1h ago",   statusColor: "text-emerald-400 bg-emerald-400/10" },
  { id: "RES-1038", guest: "Isabelle Fontaine",  type: "Wedding Package",    status: "Confirmed", time: "2h ago",   statusColor: "text-emerald-400 bg-emerald-400/10" },
  { id: "RES-1037", guest: "Theodore Ashworth",  type: "Bespoke Experience", status: "Cancelled", time: "3h ago",   statusColor: "text-red-400 bg-red-400/10" },
  { id: "RES-1036", guest: "Eleanor Montague",   type: "Suite Prestige",     status: "Pending",   time: "4h ago",   statusColor: "text-amber-400 bg-amber-400/10" },
];

const QUICK_STATS = [
  { icon: Clock,        label: "Pending review",      value: "12", color: "text-amber-400" },
  { icon: CheckCircle2, label: "Confirmed today",      value: "34", color: "text-emerald-400" },
  { icon: AlertCircle,  label: "Requires attention",  value: "3",  color: "text-red-400" },
  { icon: TrendingUp,   label: "New this week",        value: "61", color: "text-sky-400" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here is a real-time overview of AURELIA hotel operations."
      />

      {/* KPI Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => (
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
                  <th className="px-5 py-3 text-right font-medium opacity-40 uppercase tracking-wider text-[10px] hidden sm:table-cell">Time</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ACTIVITY.map((row) => (
                  <tr key={row.id} className="border-b border-inherit last:border-b-0 hover:opacity-80 transition-opacity">
                    <td className="px-5 py-3.5 font-mono opacity-40 text-[10px]">{row.id}</td>
                    <td className="px-5 py-3.5 font-medium">{row.guest}</td>
                    <td className="px-5 py-3.5 opacity-60 hidden md:table-cell">{row.type}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${row.statusColor}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right opacity-40 hidden sm:table-cell">{row.time}</td>
                  </tr>
                ))}
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
            {QUICK_STATS.map(({ icon: Icon, label, value, color }) => (
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
                <span>70.8%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "70.8%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
