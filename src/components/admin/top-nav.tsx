"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bell, LogOut, Menu, Moon, Search, Settings, Sun, User } from "lucide-react";
import { useAdmin } from "./admin-provider";
import Link from "next/link";
import { logoutAdmin } from "@/features/auth/admin-actions";
import { useRouter } from "next/navigation";

const MOCK_NOTIFICATIONS = [
  { id: 1, title: "New reservation confirmed", body: "Suite Imperiale — James Harrington", time: "2m ago", unread: true },
  { id: 2, title: "Spa treatment request", body: "Deep Tissue Massage — Room 412", time: "18m ago", unread: true },
  { id: 3, title: "Wedding inquiry received", body: "Fitzgerald & Moore — June 2027", time: "1h ago", unread: false },
  { id: 4, title: "Payment webhook received", body: "Stripe session cs_live_a1b2c3 completed", time: "2h ago", unread: false },
];

export function TopNav() {
  const router = useRouter();
  const { theme, toggleTheme, sidebarCollapsed, setSidebarCollapsed } = useAdmin();
  const isDark = theme === "dark";

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(MOCK_NOTIFICATIONS.filter((n) => n.unread).length);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setShowProfile(false);
    const result = await logoutAdmin();
    if (result.success) {
      router.push("/admin/login");
      router.refresh();
    }
  };

  // Click outside to close
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const nav = isDark
    ? "bg-zinc-950/90 border-zinc-800 text-zinc-100"
    : "bg-white/90 border-zinc-200 text-zinc-900";
  const inputBg = isDark
    ? "bg-zinc-900 border-zinc-800 text-zinc-200 placeholder-zinc-600 focus:border-amber-500/40"
    : "bg-zinc-100 border-zinc-200 text-zinc-800 placeholder-zinc-400 focus:border-amber-400/60";
  const iconBtn = isDark
    ? "border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
    : "border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100";
  const dropdown = isDark
    ? "bg-zinc-950 border-zinc-800 shadow-[0_8px_32px_rgba(0,0,0,0.8)]"
    : "bg-white border-zinc-200 shadow-[0_8px_32px_rgba(0,0,0,0.12)]";
  const dropdownItem = isDark
    ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80"
    : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100";
  const divider = isDark ? "border-zinc-800" : "border-zinc-200";

  return (
    <header
      className={`sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 backdrop-blur-md transition-all duration-300 ${nav}`}
    >
      {/* Left: mobile toggle + search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          id="admin-sidebar-toggle"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`lg:hidden shrink-0 p-1.5 rounded-sm border cursor-pointer transition-colors ${iconBtn}`}
          aria-label="Toggle sidebar"
        >
          <Menu size={15} />
        </button>

        <div className="relative w-full max-w-sm hidden md:block">
          <Search size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-zinc-600" : "text-zinc-400"}`} />
          <input
            id="admin-global-search"
            type="search"
            placeholder="Search reservations, guests, rooms…"
            className={`w-full rounded-sm border py-2 pl-9 pr-4 text-xs font-sans outline-none transition-colors ${inputBg}`}
          />
        </div>
      </div>

      {/* Right: controls */}
      <div className="flex shrink-0 items-center gap-2 ml-4">
        {/* Theme toggle */}
        <button
          id="admin-theme-toggle"
          onClick={toggleTheme}
          className={`p-2 rounded-sm border cursor-pointer transition-colors ${iconBtn}`}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            id="admin-notifications-btn"
            onClick={() => { setShowNotifications((v) => !v); setShowProfile(false); setUnreadCount(0); }}
            className={`relative p-2 rounded-sm border cursor-pointer transition-colors ${iconBtn}`}
            aria-label="Notifications"
          >
            <Bell size={14} />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
              </span>
            )}
          </button>

          {showNotifications && (
            <div className={`absolute right-0 mt-2 w-80 rounded-sm border ${dropdown} z-50`}>
              <div className={`flex items-center justify-between px-4 py-3 border-b ${divider}`}>
                <h4 className={`text-[10px] uppercase tracking-widest font-semibold font-sans ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                  Notifications
                </h4>
                <span className={`text-[10px] font-sans ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                  {MOCK_NOTIFICATIONS.length} total
                </span>
              </div>
              <div className="py-1 max-h-72 overflow-y-auto">
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-l-2 mx-2 my-1 rounded-sm cursor-pointer transition-colors ${
                      n.unread
                        ? isDark ? "border-amber-500 bg-amber-500/5" : "border-amber-400 bg-amber-50"
                        : isDark ? "border-zinc-800 hover:bg-zinc-900/50" : "border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    <p className={`text-xs font-medium font-sans ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>{n.title}</p>
                    <p className={`text-[10px] mt-0.5 font-sans ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>{n.body}</p>
                    <p className={`text-[9px] mt-1 font-sans ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            id="admin-profile-btn"
            onClick={() => { setShowProfile((v) => !v); setShowNotifications(false); }}
            className={`flex items-center gap-2 rounded-sm border px-2 py-1.5 cursor-pointer transition-colors ${iconBtn}`}
            aria-label="Admin profile"
          >
            <div className={`flex h-6 w-6 items-center justify-center rounded-full font-serif text-xs font-semibold ${isDark ? "bg-zinc-800 text-amber-400" : "bg-zinc-100 text-amber-600"}`}>
              A
            </div>
            <span className={`hidden sm:block text-xs font-medium font-sans ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
              Admin
            </span>
          </button>

          {showProfile && (
            <div className={`absolute right-0 mt-2 w-48 rounded-sm border ${dropdown} z-50 py-1`}>
              <div className={`px-4 py-2.5 border-b ${divider}`}>
                <p className={`text-xs font-medium font-sans ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>Administrator</p>
                <p className={`text-[10px] font-sans ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>admin@aurelia.com</p>
              </div>
              <Link
                href="/admin/settings"
                onClick={() => setShowProfile(false)}
                className={`flex w-full items-center gap-2.5 px-4 py-2 text-xs font-sans transition-colors ${dropdownItem}`}
              >
                <Settings size={12} /> System Settings
              </Link>
              <button
                className={`flex w-full items-center gap-2.5 px-4 py-2 text-xs font-sans transition-colors ${dropdownItem}`}
                onClick={() => setShowProfile(false)}
              >
                <User size={12} /> Admin Profile
              </button>
              <div className={`my-1 border-t ${divider}`} />
              <button
                className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-sans text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut size={12} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
