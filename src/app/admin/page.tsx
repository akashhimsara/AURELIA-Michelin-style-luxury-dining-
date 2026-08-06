import React from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { getAdminDashboardData } from "@/features/admin/actions/dashboard";
import { KpiSection } from "./dashboard/kpi-section";
import { ArrivalsDepartures } from "./dashboard/arrivals-departures";
import { RecentReservations } from "./dashboard/recent-reservations";
import { LatestPayments } from "./dashboard/latest-payments";
import { PendingTasks } from "./dashboard/pending-tasks";
import { NotificationsFeed } from "./dashboard/notifications-feed";
import { QuickActions } from "./dashboard/quick-actions";
import { RevenueSection } from "./dashboard/revenue-section";
import { RecentActivity } from "./dashboard/recent-activity";
import { RevenueChart } from "@/components/admin/charts/revenue-chart";
import { OccupancyChart } from "@/components/admin/charts/occupancy-chart";
import { RoomSalesChart } from "@/components/admin/charts/room-sales-chart";

export const metadata: Metadata = {
  title: "Dashboard — AURELIA Admin",
  description: "Real-time hotel operations overview for AURELIA luxury property management.",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Dashboard"
        description="Real-time overview of AURELIA hotel operations."
      />

      {/* ── Row 1: KPI Cards ─────────────────────────────── */}
      <KpiSection
        todayRevenue={data.todayRevenue}
        occupancyRate={data.occupancyRate}
        todayCheckIns={data.todayCheckIns}
        todayCheckOuts={data.todayCheckOuts}
        restaurantRevenue={data.restaurantRevenue}
        spaRevenue={data.spaRevenue}
        totalGuests={data.totalGuests}
        pendingCount={data.pendingCount}
      />

      {/* ── Row 2: Revenue Chart + Occupancy Chart ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 admin-card rounded-sm border p-5">
          <div className="mb-1">
            <p className="text-[11px] uppercase tracking-widest opacity-50 font-sans">30-Day Trend</p>
            <p className="text-sm font-semibold font-sans">Revenue Performance</p>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <p className="text-2xl font-semibold">
              £{data.revenueChart.reduce((s, d) => s + d.revenue, 0).toLocaleString("en-GB")}
            </p>
            <span className="text-[11px] opacity-40">last 30 days</span>
          </div>
          <RevenueChart data={data.revenueChart} />
        </div>

        {/* Occupancy Bar Chart */}
        <div className="admin-card rounded-sm border p-5">
          <div className="mb-1">
            <p className="text-[11px] uppercase tracking-widest opacity-50 font-sans">30-Day Trend</p>
            <p className="text-sm font-semibold font-sans">Occupancy Rate</p>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <p className="text-2xl font-semibold">{data.occupancyRate}%</p>
            <span className="text-[11px] opacity-40">today</span>
          </div>
          <OccupancyChart data={data.occupancyChart} />
        </div>
      </div>

      {/* ── Row 3: Arrivals + Departures ─────────────────── */}
      <ArrivalsDepartures
        arrivals={data.upcomingArrivals}
        departures={data.upcomingDepartures}
      />

      {/* ── Row 4: Reservations Table + Latest Payments ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RecentReservations data={data.recentReservations} />
        </div>
        <LatestPayments data={data.latestPayments} />
      </div>

      {/* ── Row 5: Top Rooms + Pending Tasks + Quick Actions ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Selling Rooms Donut */}
        <div className="admin-card rounded-sm border p-5">
          <div className="mb-4">
            <p className="text-[11px] uppercase tracking-widest opacity-50 font-sans">By Bookings</p>
            <p className="text-sm font-semibold font-sans">Top Selling Rooms</p>
          </div>
          <RoomSalesChart data={data.topRooms} />
        </div>

        <PendingTasks data={data.pendingTasks} />
        <QuickActions />
      </div>

      {/* ── Row 6: Revenue Breakdown + Notifications ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueSection
            restaurantRevenue={data.restaurantRevenue}
            spaRevenue={data.spaRevenue}
            weddingRevenue={data.weddingRevenue}
            confirmedCount={data.confirmedCount}
          />
        </div>
        <NotificationsFeed data={data.notifications} />
      </div>

      {/* ── Row 7: Activity Timeline ───────────────────────── */}
      <RecentActivity data={data.recentActivity} />
    </div>
  );
}
