import React from "react";

function Sk({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-sm bg-current/5 ${className}`} />
  );
}

export default function AdminLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="space-y-1.5">
        <Sk className="h-6 w-48" />
        <Sk className="h-3.5 w-72" />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="admin-card rounded-sm border p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <Sk className="h-2.5 w-24" />
                <Sk className="h-7 w-20" />
                <Sk className="h-2.5 w-16" />
              </div>
              <Sk className="h-10 w-10 rounded-sm" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 admin-card rounded-sm border p-5">
          <Sk className="h-4 w-32 mb-4" />
          <Sk className="h-[220px] w-full" />
        </div>
        <div className="admin-card rounded-sm border p-5">
          <Sk className="h-4 w-28 mb-4" />
          <Sk className="h-[220px] w-full" />
        </div>
      </div>

      {/* Arrivals/departures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div key={i} className="admin-card rounded-sm border p-5 space-y-3">
            <Sk className="h-4 w-36" />
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="flex items-center gap-3 py-1">
                <Sk className="w-8 h-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-1">
                  <Sk className="h-3 w-28" />
                  <Sk className="h-2.5 w-20" />
                </div>
                <Sk className="h-3 w-14" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 admin-card rounded-sm border p-5">
          <Sk className="h-4 w-40 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Sk className="flex-1 h-3" />
                <Sk className="h-3 w-16" />
                <Sk className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>
        <div className="admin-card rounded-sm border p-5 space-y-3">
          <Sk className="h-4 w-28 mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-1">
              <Sk className="w-8 h-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-1">
                <Sk className="h-3 w-24" />
                <Sk className="h-2.5 w-16" />
              </div>
              <Sk className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="admin-card rounded-sm border p-5">
          <Sk className="h-4 w-32 mb-4" />
          <Sk className="h-[140px] w-full" />
        </div>
        <div className="admin-card rounded-sm border p-5 space-y-2">
          <Sk className="h-4 w-28 mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Sk key={i} className="h-10 w-full" />
          ))}
        </div>
        <div className="admin-card rounded-sm border p-5">
          <Sk className="h-4 w-24 mb-4" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Sk key={i} className="h-11 w-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="admin-card rounded-sm border p-5">
        <Sk className="h-4 w-32 mb-5" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <Sk className="w-[30px] h-[30px] rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Sk className="h-3 w-40" />
                <Sk className="h-2.5 w-24" />
              </div>
              <Sk className="h-2.5 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
