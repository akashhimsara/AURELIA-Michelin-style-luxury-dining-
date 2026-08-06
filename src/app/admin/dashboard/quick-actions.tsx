import React from "react";
import Link from "next/link";
import {
  PlusCircle,
  BedDouble,
  Users,
  BarChart3,
  UserCog,
  ScrollText,
  UtensilsCrossed,
  Sparkles,
} from "lucide-react";

const actions = [
  {
    label: "New Reservation",
    href: "/admin/reservations",
    icon: PlusCircle,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Manage Rooms",
    href: "/admin/rooms",
    icon: BedDouble,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    label: "Guest Profiles",
    href: "/admin/guests",
    icon: Users,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Finance Reports",
    href: "/admin/finance",
    icon: BarChart3,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    label: "Staff Management",
    href: "/admin/staff",
    icon: UserCog,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    label: "Restaurant",
    href: "/admin/restaurant",
    icon: UtensilsCrossed,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    label: "Spa & Wellness",
    href: "/admin/spa",
    icon: Sparkles,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  },
  {
    label: "System Logs",
    href: "/admin/system-logs",
    icon: ScrollText,
    color: "text-gray-400",
    bg: "bg-gray-500/10",
  },
];

export function QuickActions() {
  return (
    <div className="admin-card rounded-sm border p-5">
      <div className="mb-4">
        <p className="text-[11px] uppercase tracking-widest opacity-50 font-sans">Shortcuts</p>
        <p className="text-sm font-semibold font-sans">Quick Actions</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`flex items-center gap-2.5 rounded-sm border border-current/5 px-3 py-2.5 hover:bg-current/5 transition-all duration-150 group`}
          >
            <div className={`shrink-0 w-7 h-7 rounded-sm ${action.bg} flex items-center justify-center`}>
              <action.icon size={14} className={action.color} />
            </div>
            <span className="text-[11px] font-medium opacity-70 group-hover:opacity-100 transition-opacity">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
