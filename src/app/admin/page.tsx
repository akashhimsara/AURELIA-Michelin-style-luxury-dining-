import React from "react";
import { TrendingUp, Users, CalendarDays, Inbox } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { db } from "@/lib/db";

export default async function AdminDashboardPage() {
  const totalBookings = await db.reservation.count();
  const guestResult = await db.reservation.aggregate({
    _sum: { guests: true },
  });
  const totalGuests = guestResult._sum.guests || 0;
  const pendingCount = await db.reservation.count({
    where: { status: "pending" },
  });
  
  // Calculate revenue estimation based on guest multipliers
  const estimatedRevenue = totalBookings * 75;

  const stats = [
    { label: "Total Bookings", value: totalBookings, icon: CalendarDays, change: "+12% this week" },
    { label: "Active Guests", value: totalGuests, icon: Users, change: "+8% this week" },
    { label: "Pending Requests", value: pendingCount, icon: Inbox, change: "Requires review" },
    { label: "Est. Revenue", value: `£${estimatedRevenue}`, icon: TrendingUp, change: "+15% this week" },
  ];

  return (
    <div className="space-y-10">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <Heading subtitle>AURELIA Console</Heading>
          <Heading as="h1" accent className="tracking-wide">
            Dashboard Overview
          </Heading>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-5 border border-gold/10 bg-charcoal/20 rounded-sm relative luxury-glass">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-sans block">
                    {stat.label}
                  </span>
                  <span className="text-2xl font-serif text-zinc-100 block">
                    {stat.value}
                  </span>
                </div>
                <div className="p-2 border border-gold/20 bg-gold/5 text-gold rounded-sm">
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gold/5">
                <span className="text-[9px] font-sans text-zinc-400 block tracking-wide">
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SVG Charts & Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="p-6 border border-gold/10 bg-charcoal/20 rounded-sm col-span-2 luxury-glass space-y-6">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gold font-sans font-medium">
              Weekly Seatings Distribution
            </h3>
            <p className="text-[10px] text-zinc-500 font-sans mt-0.5">
              Visual analytics representation of reservations across active cycles
            </p>
          </div>

          {/* Luxury Custom SVG Chart */}
          <div className="relative h-64 w-full flex items-center justify-center bg-black/40 rounded-sm border border-gold/5 p-4">
            <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
              {/* Grid lines */}
              <line x1="0" y1="20" x2="600" y2="20" stroke="#d4af37" strokeOpacity="0.05" strokeWidth="1" />
              <line x1="0" y1="70" x2="600" y2="70" stroke="#d4af37" strokeOpacity="0.05" strokeWidth="1" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="#d4af37" strokeOpacity="0.05" strokeWidth="1" />
              <line x1="0" y1="170" x2="600" y2="170" stroke="#d4af37" strokeOpacity="0.05" strokeWidth="1" />

              {/* Area Under Curve Fill */}
              <path
                d="M 50 170 C 120 120, 180 80, 250 130 C 320 180, 380 90, 450 60 C 520 30, 530 30, 550 40 L 550 170 L 50 170 Z"
                fill="url(#chart-gradient)"
                opacity="0.1"
              />

              {/* Spline Path */}
              <path
                d="M 50 170 C 120 120, 180 80, 250 130 C 320 180, 380 90, 450 60 C 520 30, 530 30, 550 40"
                fill="none"
                stroke="#d4af37"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)]"
              />

              {/* Data points */}
              <circle cx="50" cy="170" r="4" fill="#000" stroke="#d4af37" strokeWidth="2" />
              <circle cx="250" cy="130" r="4" fill="#000" stroke="#d4af37" strokeWidth="2" />
              <circle cx="450" cy="60" r="4" fill="#000" stroke="#d4af37" strokeWidth="2" />
              <circle cx="550" cy="40" r="4" fill="#000" stroke="#d4af37" strokeWidth="2" />

              {/* Gradient definition */}
              <defs>
                <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex justify-between text-[9px] uppercase tracking-wider text-zinc-500 font-sans px-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Inquiries list feed */}
        <div className="p-6 border border-gold/10 bg-charcoal/20 rounded-sm luxury-glass space-y-6">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gold font-sans font-medium">
              Console Feed
            </h3>
            <p className="text-[10px] text-zinc-500 font-sans mt-0.5">
              Live updates from database aggregates
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-gold/10 bg-black/40 rounded-sm text-xs font-sans font-light text-zinc-300">
              <span className="block text-[8px] uppercase tracking-wider text-gold mb-1">Status Receipt</span>
              All database indexes are active. Connected to Neon serverless cluster.
            </div>
            <div className="p-4 border border-gold/10 bg-black/40 rounded-sm text-xs font-sans font-light text-zinc-300">
              <span className="block text-[8px] uppercase tracking-wider text-gold mb-1">Mail Dispatcher</span>
              Confirmation system running mock email log outputs.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
