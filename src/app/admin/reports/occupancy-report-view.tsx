"use client";

import React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine
} from "recharts";
import type { OccupancyTrendPoint } from "@/features/admin/actions/reports";

interface OccupancyReportViewProps {
  data: OccupancyTrendPoint[];
}

export function OccupancyReportView({ data }: OccupancyReportViewProps) {
  const avgOccupancy = Math.round(
    data.reduce((sum, d) => sum + d.occupancyRate, 0) / (data.length || 1)
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Chart */}
      <div className="admin-card rounded-sm border p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-current/5 pb-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-50 font-semibold">
              Suite Inventory Utilization
            </p>
            <h2 className="text-sm font-semibold">Daily Property Occupancy Rate (%)</h2>
          </div>
          <div className="text-xs font-mono">
            Average Occupancy: <strong className="text-emerald-500 font-bold">{avgOccupancy}%</strong>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.07} />
              <XAxis dataKey="date" tick={{ fill: "#888888", fontSize: 10 }} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "#888888", fontSize: 10 }} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", fontSize: "11px", borderRadius: "4px" }}
                formatter={(value: any) => [
                  `${value ?? 0}%`,
                  "Occupancy"
                ]}
              />
              <ReferenceLine y={80} label={{ value: "Target 80%", fill: "#10b981", fontSize: 10 }} stroke="#10b981" strokeDasharray="3 3" />
              <Bar dataKey="occupancyRate" name="Occupancy %" fill="#10b981" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Suite Category Utilization Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { category: "Ocean Presidential Villa", total: 12, occupied: 11, pct: 92, price: "£850" },
          { category: "Mayfair Penthouse Suite", total: 16, occupied: 14, pct: 88, price: "£1,200" },
          { category: "Deluxe Heritage Chamber", total: 20, occupied: 15, pct: 75, price: "£450" },
        ].map((item) => (
          <div key={item.category} className="admin-card rounded-sm border p-4 space-y-2">
            <p className="text-[10px] uppercase tracking-widest opacity-50 font-semibold">{item.category}</p>
            <div className="flex items-center justify-between text-lg font-bold">
              <span className="font-mono text-amber-500">{item.pct}% Occupied</span>
              <span className="text-xs font-mono opacity-50">{item.occupied} / {item.total} Suites</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-current/10 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${item.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
