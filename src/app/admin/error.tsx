"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-8">
      <div className="w-14 h-14 rounded-sm bg-red-500/10 flex items-center justify-center mb-5">
        <AlertTriangle size={24} className="text-red-400" />
      </div>
      <h2 className="text-lg font-semibold font-sans tracking-tight mb-2 text-zinc-100">
        Something went wrong
      </h2>
      <p className="text-sm font-sans text-zinc-500 max-w-sm leading-relaxed mb-1">
        {error.message ?? "An unexpected error occurred in the admin portal."}
      </p>
      {error.digest && (
        <p className="text-[10px] font-mono text-zinc-700 mb-6">Error ID: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="flex items-center gap-2 px-4 py-2 rounded-sm border border-zinc-700 bg-zinc-900 text-zinc-300 text-xs font-sans hover:border-zinc-600 hover:text-zinc-100 transition-colors cursor-pointer mt-4"
      >
        <RefreshCw size={12} />
        Try again
      </button>
    </div>
  );
}
