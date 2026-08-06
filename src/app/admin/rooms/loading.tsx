import React from "react";

function Sk({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`animate-pulse rounded-sm bg-current/5 ${className}`} style={style} />;
}

export default function RoomsLoading() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <Sk className="h-3 w-32" />
        <Sk className="h-6 w-48" />
        <Sk className="h-3.5 w-80" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="admin-card rounded-sm border p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <Sk className="h-2.5 w-24" />
                <Sk className="h-7 w-20" />
              </div>
              <Sk className="h-10 w-10 rounded-sm" />
            </div>
          </div>
        ))}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Sk className="h-9 w-60" />
          <Sk className="h-9 w-28" />
          <Sk className="h-9 w-28" />
        </div>
        <div className="flex gap-2">
          <Sk className="h-9 w-20" />
          <Sk className="h-9 w-28" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="admin-card rounded-sm border overflow-hidden space-y-4 p-4">
            <Sk className="h-48 w-full rounded-sm" />
            <div className="space-y-2">
              <Sk className="h-4 w-3/4" />
              <Sk className="h-3 w-1/2" />
            </div>
            <div className="flex justify-between items-center pt-2">
              <Sk className="h-6 w-24" />
              <Sk className="h-8 w-20 rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
