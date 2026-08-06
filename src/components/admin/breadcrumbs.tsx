"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { useAdmin } from "./admin-provider";

const SEGMENT_LABELS: Record<string, string> = {
  admin:        "Dashboard",
  reservations: "Reservations",
  guests:       "Guests",
  rooms:        "Rooms",
  restaurant:   "Restaurant",
  spa:          "Spa",
  wedding:      "Wedding",
  events:       "Events",
  staff:        "Staff",
  housekeeping: "Housekeeping",
  finance:      "Finance",
  marketing:    "Marketing",
  reports:      "Reports",
  settings:     "Settings",
  "system-logs": "System Logs",
  login:        "Login",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const { theme } = useAdmin();
  const isDark = theme === "dark";

  const segments = pathname.split("/").filter(Boolean); // ["admin", "reservations", ...]

  const crumbs = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const label = SEGMENT_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
    const isLast = idx === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-sans">
      <Link
        href="/admin"
        className={`transition-colors ${isDark ? "text-zinc-500 hover:text-zinc-200" : "text-zinc-400 hover:text-zinc-700"}`}
        aria-label="Dashboard home"
      >
        <Home size={11} />
      </Link>

      {crumbs.length > 1 && crumbs.map(({ href, label, isLast }) => (
        <React.Fragment key={href}>
          <ChevronRight size={10} className={isDark ? "text-zinc-700" : "text-zinc-300"} />
          {isLast ? (
            <span className={`font-medium ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>{label}</span>
          ) : (
            <Link
              href={href}
              className={`transition-colors ${isDark ? "text-zinc-500 hover:text-zinc-200" : "text-zinc-400 hover:text-zinc-700"}`}
            >
              {label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
