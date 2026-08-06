import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login — AURELIA",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm">
        {/* Wordmark */}
        <div className="text-center mb-10">
          <span className="font-serif text-3xl tracking-[0.25em] text-amber-500 font-semibold">AURELIA</span>
          <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 font-sans mt-2">
            Admin Portal
          </p>
        </div>

        {/* Card */}
        <div className="rounded-sm border border-zinc-800 bg-zinc-900/60 p-8 space-y-5 backdrop-blur-md">
          <div className="space-y-1 text-center mb-6">
            <h1 className="text-sm font-semibold font-sans text-zinc-200 tracking-tight">
              Sign in to continue
            </h1>
            <p className="text-xs font-sans text-zinc-500">
              Authorised personnel only
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-[10px] uppercase tracking-widest font-sans font-medium text-zinc-400 mb-1.5">
                Email address
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                placeholder="admin@aurelia.com"
                className="w-full rounded-sm border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-sans text-zinc-200 placeholder-zinc-600 outline-none focus:border-amber-500/40 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-[10px] uppercase tracking-widest font-sans font-medium text-zinc-400 mb-1.5">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-sm border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-sans text-zinc-200 placeholder-zinc-600 outline-none focus:border-amber-500/40 transition-colors"
              />
            </div>
          </div>

          <button
            id="admin-login-btn"
            type="button"
            className="w-full mt-2 py-2.5 rounded-sm bg-amber-500 text-zinc-950 text-xs font-semibold font-sans uppercase tracking-widest hover:bg-amber-400 transition-colors cursor-pointer"
          >
            Sign In
          </button>

          <p className="text-center text-[10px] font-sans text-zinc-600">
            Protected route · AURELIA Internal Systems
          </p>
        </div>
      </div>
    </div>
  );
}
