import React from "react";
import { DollarSign, BedDouble, Percent, Users, Award } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";

interface ReportsStatsSectionProps {
  summary: {
    grossRevenue: number;
    revPar: number;
    adr: number;
    occupancyRate: number;
    repeatGuestRate: number;
  };
}

export function ReportsStatsSection({ summary }: ReportsStatsSectionProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        label="Gross Total Revenue"
        value={`£${summary.grossRevenue.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
        icon={DollarSign}
        trend={14.2}
        trendLabel="vs last period"
        accentColor="bg-amber-500/10 text-amber-500"
      />
      <StatCard
        label="RevPAR (Rev / Room)"
        value={`£${summary.revPar.toLocaleString("en-GB")}`}
        icon={BedDouble}
        trend={8.6}
        accentColor="bg-sky-500/10 text-sky-500"
      />
      <StatCard
        label="ADR (Average Daily Rate)"
        value={`£${summary.adr.toLocaleString("en-GB")}`}
        icon={Award}
        accentColor="bg-purple-500/10 text-purple-400"
      />
      <StatCard
        label="Suite Occupancy Rate"
        value={`${summary.occupancyRate}%`}
        icon={Percent}
        trend={3.4}
        accentColor="bg-emerald-500/10 text-emerald-500"
      />
      <StatCard
        label="Repeat Guest Ratio"
        value={`${summary.repeatGuestRate}%`}
        icon={Users}
        accentColor="bg-pink-500/10 text-pink-500"
      />
    </div>
  );
}
