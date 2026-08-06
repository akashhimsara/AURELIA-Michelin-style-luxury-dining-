import React from "react";

function Sk({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`animate-pulse rounded-sm bg-current/5 ${className}`} style={style} />;
}

export default function FinanceLoading() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <Sk className="h-3 w-32" />
        <Sk className="h-6 w-56" />
        <Sk className="h-3.5 w-80" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="admin-card rounded-sm border p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <Sk className="h-2.5 w-24" />
                <Sk className="h-7 w-24" />
              </div>
              <Sk className="h-10 w-10 rounded-sm" />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Sk className="h-9 w-72" />
        </div>
        <div className="flex gap-2">
          <Sk className="h-9 w-24" />
          <Sk className="h-9 w-24" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="admin-card rounded-sm border overflow-hidden">
        <div className="flex gap-4 px-5 py-3 border-b border-current/5">
          {[120, 160, 100, 100, 100, 80, 80].map((w, i) => (
            <div key={i} style={{ width: w, flexShrink: 0 }}>
              <Sk className="h-2.5" />
            </div>
          ))}
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-current/5">
            <Sk className="h-3 w-28" />
            <div className="space-y-1 flex-1">
              <Sk className="h-3 w-32" />
              <Sk className="h-2.5 w-44" />
            </div>
            <Sk className="h-3 w-20" />
            <Sk className="h-3 w-20" />
            <Sk className="h-5 w-16 rounded-full" />
            <Sk className="h-8 w-24 rounded-sm ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
