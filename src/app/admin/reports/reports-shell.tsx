"use client";

import React, { useState } from "react";
import {
  FileBarChart2, BedDouble, Users, Utensils, Sparkles, Heart,
  Download, Printer, RefreshCw, Calendar, SlidersHorizontal
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReportsData, DateRangeOption, DepartmentOption } from "@/features/admin/actions/reports";
import { ReportsStatsSection } from "./reports-stats-section";
import { RevenueReportView } from "./revenue-report-view";
import { OccupancyReportView } from "./occupancy-report-view";
import { CustomerReportView } from "./customer-report-view";
import { RestaurantReportView } from "./restaurant-report-view";
import { SpaReportView } from "./spa-report-view";
import { WeddingReportView } from "./wedding-report-view";
import { exportReportToCSV, triggerPrintPDFReport } from "./reports-export-utils";

type ReportTab = "revenue" | "occupancy" | "customer" | "restaurant" | "spa" | "wedding";

interface ReportsShellProps {
  data: ReportsData;
}

const TABS: { key: ReportTab; label: string; icon: React.ElementType }[] = [
  { key: "revenue", label: "Revenue Analytics", icon: FileBarChart2 },
  { key: "occupancy", label: "Occupancy Reports", icon: BedDouble },
  { key: "customer", label: "Customer & VIP CRM", icon: Users },
  { key: "restaurant", label: "Culinary & Dining", icon: Utensils },
  { key: "spa", label: "Spa & Wellness", icon: Sparkles },
  { key: "wedding", label: "Weddings & Events", icon: Heart },
];

export function ReportsShell({ data }: ReportsShellProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ReportTab>("revenue");
  const [dateRange, setDateRange] = useState<DateRangeOption>("30d");
  const [department, setDepartment] = useState<DepartmentOption>("all");

  return (
    <div className="space-y-6">
      {/* Overview KPI Header */}
      <ReportsStatsSection summary={data.summary} />

      {/* Report Controls Toolbar (Date Range, Department Filter, Export Excel/CSV/PDF) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between admin-card rounded-sm border p-4 print:hidden">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Date Range Selector */}
          <div className="flex items-center gap-1.5 text-xs font-sans">
            <Calendar size={13} className="text-amber-500" />
            <span className="opacity-50 font-medium">Range:</span>
            <div className="flex border border-current/10 rounded-sm p-0.5">
              {[
                { key: "7d", label: "7 Days" },
                { key: "30d", label: "30 Days" },
                { key: "90d", label: "90 Days" },
                { key: "ytd", label: "YTD" },
              ].map((r) => (
                <button
                  key={r.key}
                  onClick={() => setDateRange(r.key as DateRangeOption)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-sm transition-colors ${
                    dateRange === r.key
                      ? "bg-amber-500 text-zinc-950 font-semibold"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1.5 text-xs font-sans">
            <SlidersHorizontal size={13} className="opacity-40" />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value as DepartmentOption)}
              className="rounded-sm border border-current/10 bg-transparent px-2.5 py-1.5 text-[11px] outline-none"
            >
              <option value="all">All Departments</option>
              <option value="rooms">Rooms & Suites</option>
              <option value="dining">Fine Dining</option>
              <option value="spa">Spa & Wellness</option>
              <option value="weddings">Weddings & Events</option>
            </select>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.refresh()}
            title="Refresh"
            className="p-1.5 rounded-sm border border-current/10 hover:border-current/30 opacity-60 hover:opacity-100 transition-colors"
          >
            <RefreshCw size={13} />
          </button>

          <button
            onClick={() => exportReportToCSV(data.revenueTrend, `aurelia-${activeTab}-report`)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-sm border border-current/10 hover:border-current/30 opacity-80 hover:opacity-100 transition-colors"
          >
            <Download size={12} /> Export Excel / CSV
          </button>

          <button
            onClick={triggerPrintPDFReport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-sm bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors"
          >
            <Printer size={12} /> Print PDF
          </button>
        </div>
      </div>

      {/* Module Sub-Tabs */}
      <div className="flex border-b border-current/10 gap-1 overflow-x-auto print:hidden">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider font-sans border-b-2 transition-colors whitespace-nowrap ${
              activeTab === key
                ? "border-amber-500 text-amber-500"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Sub-Report Content */}
      {activeTab === "revenue" && (
        <RevenueReportView data={data.revenueTrend} summary={data.summary} />
      )}

      {activeTab === "occupancy" && (
        <OccupancyReportView data={data.occupancyTrend} />
      )}

      {activeTab === "customer" && (
        <CustomerReportView topGuests={data.topGuests} vipDistribution={data.vipDistribution} />
      )}

      {activeTab === "restaurant" && (
        <RestaurantReportView topDishes={data.topDishes} seatingSlots={data.seatingSlotCovers} />
      )}

      {activeTab === "spa" && (
        <SpaReportView spaData={data.spaPerformance} />
      )}

      {activeTab === "wedding" && (
        <WeddingReportView weddingData={data.weddingAnalytics} />
      )}
    </div>
  );
}
