"use client";

import React from "react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend
} from "recharts";
import { Crown, Download } from "lucide-react";
import type { TopGuestRow } from "@/features/admin/actions/reports";
import { exportTopGuestsToCSV } from "./reports-export-utils";

interface CustomerReportViewProps {
  topGuests: TopGuestRow[];
  vipDistribution: Array<{ name: string; count: number; value: number }>;
}

const COLORS = ["#f59e0b", "#10b981", "#0284c7", "#a855f7", "#ec4899"];

export function CustomerReportView({ topGuests, vipDistribution }: CustomerReportViewProps) {
  return (
    <div className="space-y-6 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* VIP Donut Chart */}
        <div className="admin-card rounded-sm border p-6 space-y-4">
          <div className="border-b border-current/5 pb-3">
            <p className="text-[10px] uppercase tracking-widest opacity-50 font-semibold">Guest CRM Distribution</p>
            <h2 className="text-sm font-semibold">VIP Tiers & Membership</h2>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vipDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {vipDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", fontSize: "11px", borderRadius: "4px" }}
                  formatter={(value: any) => [
                    `${value ?? 0} Guests`,
                    "Count"
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "5px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Spenders Table */}
        <div className="lg:col-span-2 admin-card rounded-sm border overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between px-5 py-4 border-b border-current/5">
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-50 font-semibold">Hospitality CRM Leaderboard</p>
                <h2 className="text-sm font-semibold flex items-center gap-1.5">
                  <Crown size={15} className="text-amber-500" /> Top 5 High Net Worth Guests
                </h2>
              </div>
              <button
                onClick={() => exportTopGuestsToCSV(topGuests)}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-sm border border-current/10 hover:border-current/30 opacity-70 hover:opacity-100 transition-colors"
              >
                <Download size={11} /> CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead className="border-b border-current/5">
                  <tr>
                    <th className="px-5 py-3 text-left opacity-50 uppercase tracking-widest text-[10px]">Guest Name</th>
                    <th className="px-5 py-3 text-left opacity-50 uppercase tracking-widest text-[10px]">VIP Tier</th>
                    <th className="px-5 py-3 text-right opacity-50 uppercase tracking-widest text-[10px]">Total Stays</th>
                    <th className="px-5 py-3 text-right opacity-50 uppercase tracking-widest text-[10px]">Lifetime Spend (£)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-current/5">
                  {topGuests.map((g) => (
                    <tr key={g.id} className="hover:bg-current/3 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold">{g.name}</p>
                        <p className="opacity-40 text-[10px]">{g.email}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded-sm bg-amber-500/10 border border-amber-500/20 text-amber-500 font-semibold text-[10px]">
                          {g.vipTier}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono">{g.totalBookings} Stays</td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-amber-500">
                        £{g.totalSpent.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
