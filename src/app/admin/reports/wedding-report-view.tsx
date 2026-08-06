"use client";

import React from "react";
import { Heart } from "lucide-react";

interface WeddingReportViewProps {
  weddingData: {
    totalEvents: number;
    avgContractValue: number;
    totalEventRevenue: number;
    seasonalTrend: Array<{ season: string; events: number; revenue: number }>;
  };
}

export function WeddingReportView({ weddingData }: WeddingReportViewProps) {
  return (
    <div className="space-y-6 font-sans">
      <div className="admin-card rounded-sm border p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-current/5 pb-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-50 font-semibold">Wedding & Gala Events</p>
            <h2 className="text-sm font-semibold flex items-center gap-1.5">
              <Heart size={15} className="text-purple-400" /> Event Contract Values & Seasonal Revenue
            </h2>
          </div>
          <div className="flex gap-4 text-xs font-mono">
            <span>Average Contract: <strong className="text-purple-400">£{weddingData.avgContractValue.toLocaleString("en-GB")}</strong></span>
            <span>Total Revenue: <strong className="text-amber-500">£{weddingData.totalEventRevenue.toLocaleString("en-GB")}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {weddingData.seasonalTrend.map((st) => (
            <div key={st.season} className="admin-card rounded-sm border p-4 space-y-2">
              <p className="text-[10px] uppercase tracking-widest opacity-50 font-semibold">{st.season}</p>
              <p className="text-xl font-bold font-mono text-amber-500">£{st.revenue.toLocaleString("en-GB")}</p>
              <p className="text-[11px] opacity-60 font-mono">{st.events} Exclusive Weddings</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
