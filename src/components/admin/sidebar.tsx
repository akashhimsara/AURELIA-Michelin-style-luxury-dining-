"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  BedDouble,
  Utensils,
  Sparkles,
  Heart,
  Trophy,
  UserCheck,
  Home,
  Receipt,
  Mail,
  FileBarChart2,
  Settings,
  Terminal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAdmin } from "./admin-provider";

const NAV_MODULES = [
  { name: "Dashboard",    href: "/admin",            icon: LayoutDashboard },
  { name: "Reservations", href: "/admin/reservations", icon: CalendarDays },
  { name: "Guests",       href: "/admin/guests",      icon: Users },
  { name: "Rooms",        href: "/admin/rooms",       icon: BedDouble },
  { name: "Restaurant",   href: "/admin/restaurant",  icon: Utensils },
  { name: "Spa",          href: "/admin/spa",         icon: Sparkles },
  { name: "Wedding",      href: "/admin/wedding",     icon: Heart },
  { name: "Events",       href: "/admin/events",      icon: Trophy },
  { name: "Staff",        href: "/admin/staff",       icon: UserCheck },
  { name: "Housekeeping", href: "/admin/housekeeping",icon: Home },
  { name: "Finance",      href: "/admin/finance",     icon: Receipt },
  { name: "Marketing",    href: "/admin/marketing",   icon: Mail },
  { name: "Reports",      href: "/admin/reports",     icon: FileBarChart2 },
  { name: "Settings",     href: "/admin/settings",    icon: Settings },
  { name: "System Logs",  href: "/admin/system-logs", icon: Terminal },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed, theme } = useAdmin();

  const isDark = theme === "dark";
  const bg = isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200";
  const brandText = "text-amber-500";
  const linkBase = isDark
    ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80"
    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100";
  const linkActive = isDark
    ? "text-amber-400 bg-amber-500/10 border-amber-500/25"
    : "text-amber-600 bg-amber-50 border-amber-300/50";
  const footerBorder = isDark ? "border-zinc-800 bg-zinc-950" : "border-zinc-200 bg-white";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r transition-all duration-300 ease-in-out ${bg} ${
        sidebarCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand */}
      <div className={`flex h-16 shrink-0 items-center justify-between border-b px-4 ${isDark ? "border-zinc-800" : "border-zinc-200"}`}>
        {!sidebarCollapsed ? (
          <Link href="/admin" className="flex items-center gap-2 min-w-0">
            <span className={`font-serif text-lg tracking-[0.18em] font-semibold ${brandText}`}>
              AURELIA
            </span>
            <span className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm border font-sans font-medium ${isDark ? "text-zinc-500 border-zinc-800" : "text-zinc-400 border-zinc-300"}`}>
              Admin
            </span>
          </Link>
        ) : (
          <Link href="/admin" className="mx-auto">
            <span className={`font-serif text-lg font-semibold ${brandText}`}>A</span>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {NAV_MODULES.map(({ name, href, icon: Icon }) => {
          const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={name}
              href={href}
              title={sidebarCollapsed ? name : undefined}
              className={`group flex items-center gap-3 px-3 py-2 rounded-sm text-xs font-medium font-sans tracking-wide border transition-all duration-150 ${
                isActive ? linkActive + " border" : "border-transparent " + linkBase
              }`}
            >
              <Icon
                size={15}
                className={`shrink-0 transition-colors ${
                  isActive
                    ? isDark ? "text-amber-400" : "text-amber-600"
                    : isDark ? "text-zinc-500 group-hover:text-zinc-300" : "text-zinc-400 group-hover:text-zinc-600"
                }`}
              />
              {!sidebarCollapsed && <span className="truncate">{name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className={`shrink-0 border-t p-3 flex justify-center ${footerBorder}`}>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`p-1.5 rounded-sm border transition-colors cursor-pointer ${
            isDark
              ? "border-zinc-800 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
              : "border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          }`}
        >
          {sidebarCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>
    </aside>
  );
}
