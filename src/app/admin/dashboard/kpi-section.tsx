import React from "react";
import {
  DollarSign,
  BedDouble,
  LogIn,
  LogOut,
  UtensilsCrossed,
  Sparkles,
  Users,
  Clock,
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";

interface KpiSectionProps {
  todayRevenue: number;
  occupancyRate: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  restaurantRevenue: number;
  spaRevenue: number;
  totalGuests: number;
  pendingCount: number;
}

export function KpiSection({
  todayRevenue,
  occupancyRate,
  todayCheckIns,
  todayCheckOuts,
  restaurantRevenue,
  spaRevenue,
  totalGuests,
  pendingCount,
}: KpiSectionProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Today's Revenue"
        value={`£${todayRevenue.toLocaleString("en-GB")}`}
        icon={DollarSign}
        trend={12}
        trendLabel="vs yesterday"
        accentColor="bg-amber-500/10 text-amber-500"
      />
      <StatCard
        label="Occupancy Rate"
        value={`${occupancyRate}%`}
        icon={BedDouble}
        trend={occupancyRate > 50 ? 5 : -3}
        trendLabel="vs last week"
        accentColor="bg-emerald-500/10 text-emerald-500"
      />
      <StatCard
        label="Today's Check-ins"
        value={todayCheckIns}
        icon={LogIn}
        accentColor="bg-sky-500/10 text-sky-500"
      />
      <StatCard
        label="Today's Check-outs"
        value={todayCheckOuts}
        icon={LogOut}
        accentColor="bg-violet-500/10 text-violet-500"
      />
      <StatCard
        label="Restaurant Revenue"
        value={`£${restaurantRevenue.toLocaleString("en-GB")}`}
        icon={UtensilsCrossed}
        trend={8}
        trendLabel="this month"
        accentColor="bg-orange-500/10 text-orange-500"
      />
      <StatCard
        label="Spa Revenue"
        value={`£${spaRevenue.toLocaleString("en-GB")}`}
        icon={Sparkles}
        accentColor="bg-pink-500/10 text-pink-500"
      />
      <StatCard
        label="Registered Guests"
        value={totalGuests.toLocaleString()}
        icon={Users}
        accentColor="bg-teal-500/10 text-teal-500"
      />
      <StatCard
        label="Pending Approvals"
        value={pendingCount}
        icon={Clock}
        accentColor={pendingCount > 0 ? "bg-red-500/10 text-red-400" : "bg-gray-500/10 text-gray-400"}
      />
    </div>
  );
}
