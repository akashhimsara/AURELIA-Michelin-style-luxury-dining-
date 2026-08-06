"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface SpaReportViewProps {
  spaData: Array<{ treatment: string; bookings: number; revenue: number }>;
}

export function SpaReportView({ spaData }: SpaReportViewProps) {
  const totalRevenue = spaData.reduce((sum, s) => sum + s.revenue, 0);
  const totalBookings = spaData.reduce((sum, s) => sum + s.bookings, 0);

  return (
    <div className="space-y-6 font-sans">
      <div className="admin-card rounded-sm border p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-current/5 pb-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-50 font-semibold">Spa & Wellness Analytics</p>
            <h2 className="text-sm font-semibold flex items-center gap-1.5">
              <Sparkles size={15} className="text-pink-500" /> Treatment Revenue & Therapist Utilization
            </h2>
          </div>
          <div className="flex gap-4 text-xs font-mono">
            <span>Total Treatments: <strong className="text-pink-400">{totalBookings}</strong></span>
            <span>Total Revenue: <strong className="text-amber-500">£{totalRevenue.toLocaleString("en-GB")}</strong></span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead className="border-b border-current/5">
              <tr>
                <th className="px-4 py-3 text-left opacity-50 uppercase tracking-widest text-[10px]">Spa Treatment</th>
                <th className="px-4 py-3 text-right opacity-50 uppercase tracking-widest text-[10px]">Completed Appointments</th>
                <th className="px-4 py-3 text-right opacity-50 uppercase tracking-widest text-[10px]">Total Revenue (£)</th>
                <th className="px-4 py-3 text-right opacity-50 uppercase tracking-widest text-[10px]">Avg Revenue / Booking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-current/5">
              {spaData.map((s) => (
                <tr key={s.treatment} className="hover:bg-current/3 transition-colors">
                  <td className="px-4 py-3.5 font-semibold text-zinc-900 dark:text-zinc-100">{s.treatment}</td>
                  <td className="px-4 py-3.5 text-right font-mono">{s.bookings} Appointments</td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-amber-500">
                    £{s.revenue.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono opacity-80">
                    £{Math.round(s.revenue / (s.bookings || 1))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
