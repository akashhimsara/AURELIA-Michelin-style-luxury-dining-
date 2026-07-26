"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarRange, UtensilsCrossed, LogOut, Loader2, Inbox } from "lucide-react";
import { logoutAdmin } from "../actions/auth";

export function Sidebar() {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const menuItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Reservations", href: "/admin/reservations", icon: CalendarRange },
    { label: "Menu Catalog", href: "/admin/menu", icon: UtensilsCrossed },
    { label: "Guest Inquiries", href: "/admin/messages", icon: Inbox },
  ];

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAdmin();
      window.location.href = "/admin/login";
    });
  };

  return (
    <aside className="w-64 border-r border-gold/15 bg-charcoal/30 flex flex-col justify-between p-6 min-h-screen relative overflow-hidden luxury-glass">
      {/* Decorative vertical gold border line */}
      <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-gold/10 to-transparent" />

      <div className="space-y-12">
        {/* Brand identity header */}
        <div className="pt-4 text-center">
          <Link
            href="/"
            className="font-serif text-lg sm:text-xl font-light tracking-[0.25em] text-gold-gradient block"
          >
            AURELIA
          </Link>
          <span className="text-[7px] uppercase tracking-[0.4em] text-zinc-500 font-sans mt-1 block">
            Control Console
          </span>
        </div>

        {/* Navigation list */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-none text-xs uppercase tracking-wider font-sans font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-gold/10 border-l-2 border-gold text-gold"
                    : "text-zinc-400 hover:bg-gold/5 hover:text-zinc-200 border-l-2 border-transparent"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout triggers */}
      <div className="pt-6 border-t border-gold/10">
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="w-full flex items-center gap-3.5 px-4 py-3 text-xs uppercase tracking-wider font-sans font-medium text-red-400 hover:bg-red-950/20 rounded-none transition-colors border-l-2 border-transparent outline-none cursor-pointer"
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
          Sign Out
        </button>
      </div>
    </aside>
  );
}
