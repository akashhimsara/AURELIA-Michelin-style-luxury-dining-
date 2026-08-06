import React from "react";

// This loading.tsx runs inside the admin layout so AdminProvider/theme is available.
// We import the client skeleton which reads the theme context.
export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page header skeleton */}
      <div className="space-y-2">
        <div className="h-2.5 w-32 rounded-sm bg-zinc-800/70" />
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 w-48 rounded-sm bg-zinc-800/70" />
            <div className="h-3 w-72 rounded-sm bg-zinc-800/70" />
          </div>
          <div className="h-8 w-28 rounded-sm bg-zinc-800/70" />
        </div>
      </div>

      {/* 4-col stat grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-sm border border-zinc-800 bg-zinc-900/50 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-2.5 w-24 rounded-sm bg-zinc-800/70" />
              <div className="h-8 w-8 rounded-sm bg-zinc-800/70" />
            </div>
            <div className="h-7 w-32 rounded-sm bg-zinc-800/70" />
            <div className="h-2.5 w-20 rounded-sm bg-zinc-800/70" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-sm border border-zinc-800 overflow-hidden">
        <div className="flex gap-6 px-5 py-3 border-b border-zinc-800 bg-zinc-900/50">
          {[192, 320, 256, 192, 160].map((w, i) => (
            <div key={i} className="h-2.5 rounded-sm bg-zinc-800/70" style={{ width: w }} />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-6 px-5 py-3.5 border-b border-zinc-800/60 last:border-b-0">
            <div className="h-3 w-28 rounded-sm bg-zinc-800/70" />
            <div className="h-3 w-40 rounded-sm bg-zinc-800/70" />
            <div className="h-3 w-24 rounded-sm bg-zinc-800/70" />
            <div className="h-3 w-20 rounded-sm bg-zinc-800/70" />
            <div className="h-5 w-16 rounded-full bg-zinc-800/70" />
          </div>
        ))}
      </div>
    </div>
  );
}
