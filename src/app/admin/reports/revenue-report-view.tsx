"use client";

import React from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from "recharts";
import type { RevenueTrendPoint } from "@/features/admin/actions/reports";

interface RevenueReportViewProps {
  data: RevenueTrendPoint[];
  summary: {
    grossRevenue: number;
    revPar: number;
    adr: number;
  };
}

export function RevenueReportView({ data, summary }: RevenueReportViewProps) {
  return (
    <div className="space-y-6">
      {/* Revenue Area Chart */}
      <div className="admin-card rounded-sm border p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-current/5 pb-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-50 font-semibold font-sans">
              Departmental Revenue Analytics
            </p>
            <h2 className="text-sm font-semibold font-sans">Revenue Trend by Department (£)</h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span>RevPAR: <strong className="text-sky-500">£{summary.revPar}</strong></span>
            <span>ADR: <strong className="text-purple-400">£{summary.adr}</strong></span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRooms" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorDining" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorSpa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorWeddings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.07} />
              <XAxis dataKey="date" tick={{ fill: "#888888", fontSize: 10 }} axisLine={false} />
              <YAxis tick={{ fill: "#888888", fontSize: 10 }} axisLine={false} tickFormatter={(v) => `£${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", fontSize: "11px", borderRadius: "4px" }}
                formatter={(value: any) => [
                  `£${typeof value === "number" ? value.toLocaleString("en-GB") : String(value ?? 0)}`,
                  ""
                ]}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
              <Area type="monotone" dataKey="rooms" name="Rooms & Suites" stroke="#f59e0b" fillOpacity={1} fill="url(#colorRooms)" stackId="1" />
              <Area type="monotone" dataKey="dining" name="Fine Dining" stroke="#0284c7" fillOpacity={1} fill="url(#colorDining)" stackId="1" />
              <Area type="monotone" dataKey="spa" name="Spa & Wellness" stroke="#ec4899" fillOpacity={1} fill="url(#colorSpa)" stackId="1" />
              <Area type="monotone" dataKey="weddings" name="Weddings & Events" stroke="#a855f7" fillOpacity={1} fill="url(#colorWeddings)" stackId="1" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="admin-card rounded-sm border overflow-hidden font-sans">
        <div className="px-5 py-3.5 border-b border-current/5">
          <h3 className="text-xs uppercase tracking-widest font-semibold opacity-60">
            Daily Departmental Revenue Audit Table
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead className="border-b border-current/5">
              <tr>
                <th className="px-4 py-3 text-left opacity-50 uppercase tracking-widest text-[10px]">Date</th>
                <th className="px-4 py-3 text-right opacity-50 uppercase tracking-widest text-[10px]">Rooms (£)</th>
                <th className="px-4 py-3 text-right opacity-50 uppercase tracking-widest text-[10px]">Dining (£)</th>
                <th className="px-4 py-3 text-right opacity-50 uppercase tracking-widest text-[10px]">Spa (£)</th>
                <th className="px-4 py-3 text-right opacity-50 uppercase tracking-widest text-[10px]">Weddings (£)</th>
                <th className="px-4 py-3 text-right opacity-50 uppercase tracking-widest text-[10px]">Total Revenue (£)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-current/5">
              {data.map((row) => (
                <tr key={row.date} className="hover:bg-current/3 transition-colors">
                  <td className="px-4 py-3 font-semibold">{row.date}</td>
                  <td className="px-4 py-3 text-right font-mono text-amber-500">£{row.rooms.toLocaleString("en-GB")}</td>
                  <td className="px-4 py-3 text-right font-mono text-sky-400">£{row.dining.toLocaleString("en-GB")}</td>
                  <td className="px-4 py-3 text-right font-mono text-pink-400">£{row.spa.toLocaleString("en-GB")}</td>
                  <td className="px-4 py-3 text-right font-mono text-purple-400">£{row.weddings.toLocaleString("en-GB")}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold">£{row.total.toLocaleString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
