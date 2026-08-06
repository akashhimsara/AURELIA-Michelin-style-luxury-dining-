"use client";

import React from "react";
import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";
import { useAdmin } from "./admin-provider";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, theme } = useAdmin();
  const isDark = theme === "dark";

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${
        isDark ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"
      }`}
    >
      <Sidebar />

      {/* Main content — offset by sidebar width */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
        }`}
      >
        <TopNav />

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>

        <footer className={`shrink-0 px-6 py-3 border-t text-[10px] font-sans ${
          isDark ? "border-zinc-800/60 text-zinc-600" : "border-zinc-200 text-zinc-400"
        }`}>
          AURELIA Admin Portal · Internal Use Only · {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
