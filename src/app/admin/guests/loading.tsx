import React from "react";

function Sk({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`animate-pulse rounded-sm bg-current/5 ${className}`} style={style} />;
}

export default function GuestsLoading() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <Sk className="h-3 w-32" />
        <Sk className="h-6 w-36" />
        <Sk className="h-3.5 w-72" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="admin-card rounded-sm border p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <Sk className="h-2.5 w-20" />
                <Sk className="h-7 w-16" />
              </div>
              <Sk className="h-10 w-10 rounded-sm" />
            </div>
          </div>
        ))}
      </div>

      {/* Search + filters row */}
      <div className="flex gap-3">
        <Sk className="h-9 flex-1 max-w-xs" />
        <Sk className="h-9 w-28" />
        <Sk className="h-9 w-28" />
        <Sk className="h-9 w-24" />
        <div className="ml-auto flex gap-2">
          <Sk className="h-9 w-24" />
          <Sk className="h-9 w-8" />
        </div>
      </div>

      {/* Table */}
      <div className="admin-card rounded-sm border overflow-hidden">
        <div className="flex gap-4 px-5 py-3 border-b border-current/5">
          {[16, 180, 100, 80, 100, 80, 80, 80].map((w, i) => (
            <div key={i} style={{ width: w, flexShrink: 0 }}>
              <Sk className="h-2.5" />
            </div>
          ))}
        </div>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-current/5">
            <Sk className="w-4 h-4 rounded-sm shrink-0" />
            <div className="flex items-center gap-3" style={{ width: 180 }}>
              <Sk className="w-9 h-9 rounded-full shrink-0" />
              <div className="space-y-1.5">
                <Sk className="h-3 w-28" />
                <Sk className="h-2.5 w-36" />
              </div>
            </div>
            <Sk className="h-5 w-20 rounded-full" style={{ flexShrink: 0 }} />
            <Sk className="h-3 w-20" style={{ flexShrink: 0 }} />
            <Sk className="h-3 w-10" style={{ flexShrink: 0 }} />
            <Sk className="h-3 w-16" style={{ flexShrink: 0 }} />
            <Sk className="h-3 w-20" style={{ flexShrink: 0 }} />
            <div className="flex gap-1.5 ml-auto">
              <Sk className="h-7 w-7 rounded-sm" />
              <Sk className="h-7 w-7 rounded-sm" />
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between px-5 py-3">
          <Sk className="h-3 w-36" />
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
