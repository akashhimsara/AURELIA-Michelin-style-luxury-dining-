import React from "react";

function Sk({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`animate-pulse rounded-sm bg-current/5 ${className}`} style={style} />;
}

export default function SettingsLoading() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <Sk className="h-3 w-32" />
        <Sk className="h-6 w-56" />
        <Sk className="h-3.5 w-80" />
      </div>

      {/* Navigation Bar Skeleton */}
      <div className="flex gap-2 border-b border-current/10 pb-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Sk key={i} className="h-9 w-28 rounded-sm" />
        ))}
      </div>

      {/* Content Form Skeleton */}
      <div className="admin-card rounded-sm border p-6 space-y-4 max-w-2xl">
        <Sk className="h-4 w-40" />
        <div className="space-y-3">
          <Sk className="h-9 w-full" />
          <Sk className="h-9 w-full" />
          <Sk className="h-9 w-full" />
        </div>
        <Sk className="h-9 w-32 rounded-sm" />
      </div>
    </div>
  );
}
