"use client";

import React from "react";
import { useAdmin } from "./admin-provider";

function SkeletonBlock({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const { theme } = useAdmin();
  const bg = theme === "dark" ? "bg-zinc-800/70" : "bg-zinc-200/70";
  return <div className={`animate-pulse rounded-sm ${bg} ${className ?? ""}`} style={style} />;
}

/** 4-column KPI stat card skeleton */
export function StatGridSkeleton() {
  const { theme } = useAdmin();
  const isDark = theme === "dark";
  const cardCls = isDark ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-200 bg-white";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={`rounded-sm border p-5 space-y-3 ${cardCls}`}>
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-8 w-8 rounded-sm" />
          </div>
          <SkeletonBlock className="h-7 w-32" />
          <SkeletonBlock className="h-2.5 w-20" />
        </div>
      ))}
    </div>
  );
}

/** Table rows skeleton */
export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  const { theme } = useAdmin();
  const isDark = theme === "dark";
  return (
    <div className={`rounded-sm border overflow-hidden ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
      <div className={`flex gap-6 px-5 py-3 border-b ${isDark ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-200 bg-zinc-50"}`}>
        {[192, 320, 256, 192, 160].map((w, i) => (
          <SkeletonBlock key={i} className="h-2.5" style={{ width: w }} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`flex gap-6 px-5 py-3.5 border-b last:border-b-0 ${isDark ? "border-zinc-800/60" : "border-zinc-100"}`}>
          <SkeletonBlock className="h-3 w-28" />
          <SkeletonBlock className="h-3 w-40" />
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/** Full page skeleton with header + stat grid + table */
export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonBlock className="h-5 w-40" />
          <SkeletonBlock className="h-3 w-64" />
        </div>
        <SkeletonBlock className="h-8 w-28 rounded-sm" />
      </div>
      <StatGridSkeleton />
      <TableSkeleton />
    </div>
  );
}
