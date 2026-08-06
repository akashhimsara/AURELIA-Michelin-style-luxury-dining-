import React from "react";
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;        // percentage, positive = up, negative = down
  trendLabel?: string;   // e.g. "vs last month"
  accentColor?: string;  // tailwind bg class for icon bg, default amber
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel = "vs last month",
  accentColor = "bg-amber-500/10 text-amber-500",
}: StatCardProps) {
  const isUp = trend !== undefined && trend >= 0;

  return (
    <div className="admin-card group rounded-sm border p-5 transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-[11px] uppercase tracking-widest font-sans font-medium opacity-60 truncate">
            {label}
          </p>
          <p className="text-2xl font-semibold font-sans tracking-tight">{value}</p>
          {trend !== undefined && (
            <p className={`flex items-center gap-1 text-[11px] font-sans ${isUp ? "text-emerald-500" : "text-red-400"}`}>
              {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              <span>{Math.abs(trend)}%</span>
              <span className="opacity-50">{trendLabel}</span>
            </p>
          )}
        </div>
        <div className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-sm ${accentColor}`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}
