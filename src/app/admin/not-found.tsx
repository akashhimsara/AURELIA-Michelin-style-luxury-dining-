import React from "react";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-8">
      <p className="text-6xl font-serif font-light text-amber-500/40 mb-4">404</p>
      <h2 className="text-lg font-semibold font-sans tracking-tight mb-2">Page not found</h2>
      <p className="text-sm font-sans text-zinc-500 max-w-sm leading-relaxed mb-6">
        The admin page you requested does not exist or may have been moved.
      </p>
      <Link
        href="/admin"
        className="flex items-center gap-2 px-4 py-2 rounded-sm border border-zinc-700 bg-zinc-900 text-zinc-300 text-xs font-sans hover:border-amber-500/40 hover:text-zinc-100 transition-colors"
      >
        <LayoutDashboard size={12} />
        Back to Dashboard
      </Link>
    </div>
  );
}
