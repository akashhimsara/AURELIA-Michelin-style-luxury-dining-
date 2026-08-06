import React from "react";
import { DollarSign, Receipt, Percent, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";

interface FinanceStatsSectionProps {
  summary: {
    grossRevenue: number;
    netRevenue: number;
    vatCollected: number;
    netProfit: number;
    marginPct: number;
  };
}

export function FinanceStatsSection({ summary }: FinanceStatsSectionProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Gross Revenue (Inc. VAT)"
        value={`£${summary.grossRevenue.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
        icon={DollarSign}
        trend={18.4}
        trendLabel="vs last month"
        accentColor="bg-amber-500/10 text-amber-500"
      />
      <StatCard
        label="Net Revenue (Excl. VAT)"
        value={`£${summary.netRevenue.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
        icon={Receipt}
        accentColor="bg-sky-500/10 text-sky-500"
      />
      <StatCard
        label="UK VAT Collected (20%)"
        value={`£${summary.vatCollected.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
        icon={Percent}
        accentColor="bg-purple-500/10 text-purple-400"
      />
      <StatCard
        label="Net Operating Profit"
        value={`£${summary.netProfit.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
        icon={TrendingUp}
        trend={summary.marginPct}
        trendLabel="profit margin"
        accentColor={summary.netProfit >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-400"}
      />
    </div>
  );
}
