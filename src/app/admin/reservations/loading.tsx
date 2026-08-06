import React from "react";

function Sk({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`animate-pulse rounded-sm bg-current/5 ${className}`} style={style} />;
}

export default function ReservationsLoading() {
  return (
    <div className="space-y-6 p-6">
      {/* Page header */}
      <div className="space-y-2">
        <Sk className="h-3 w-32" />
        <Sk className="h-6 w-48" />
        <Sk className="h-3.5 w-80" />
      </div>

      {/* Tabs + Search + Export row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-1">
          {[80, 60, 80, 60, 80].map((w, i) => (
            <Sk key={i} className="h-8 rounded-sm" style={{ width: w }} />
          ))}
        </div>
        <div className="flex gap-2">
          <Sk className="h-8 w-24" />
          <Sk className="h-8 w-24" />
          <Sk className="h-8 w-8" />
          <Sk className="h-8 w-36" />
          <Sk className="h-8 w-8" />
        </div>
      </div>

      {/* Table */}
      <div className="admin-card rounded-sm border overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-7 gap-4 px-5 py-3 border-b border-current/5">
          <Sk className="h-2.5 w-5" />
          <Sk className="h-2.5 w-36" />
          <Sk className="h-2.5 w-24" />
          <Sk className="h-2.5 w-28" />
          <Sk className="h-2.5 w-24" />
          <Sk className="h-2.5 w-20" />
          <Sk className="h-2.5 w-20" />
        </div>
        {/* Rows */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="grid grid-cols-7 gap-4 px-5 py-4 border-b border-current/5 items-center">
            <Sk className="h-3 w-4 rounded-sm" />
            <div className="space-y-1.5">
              <Sk className="h-3 w-28" />
              <Sk className="h-2.5 w-36" />
            </div>
            <Sk className="h-5 w-16 rounded-full" />
            <div className="space-y-1.5">
              <Sk className="h-3 w-24" />
              <Sk className="h-2.5 w-20" />
            </div>
            <div className="space-y-1.5">
              <Sk className="h-3 w-20" />
              <Sk className="h-2.5 w-16" />
            </div>
            <Sk className="h-5 w-16 rounded-full" />
            <div className="flex gap-1.5 justify-end">
              <Sk className="h-7 w-7 rounded-sm" />
              <Sk className="h-7 w-7 rounded-sm" />
              <Sk className="h-7 w-7 rounded-sm" />
            </div>
          </div>
        ))}
        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3">
          <Sk className="h-3 w-32" />
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Sk key={i} className="h-7 w-7 rounded-sm" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
