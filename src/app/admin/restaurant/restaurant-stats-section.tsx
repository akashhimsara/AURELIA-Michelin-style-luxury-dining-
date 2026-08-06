import React from "react";
import { Utensils, Users, Wine, Sparkles } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import type { SerializedMenuItem, SerializedDiningReservation, RestaurantTableInfo } from "@/features/admin/actions/restaurant";

interface RestaurantStatsSectionProps {
  menuItems: SerializedMenuItem[];
  reservations: SerializedDiningReservation[];
  tables: RestaurantTableInfo[];
}

export function RestaurantStatsSection({
  menuItems,
  reservations,
  tables,
}: RestaurantStatsSectionProps) {
  const totalMenu = menuItems.length;
  const totalCoversToday = reservations
    .filter((r) => r.status === "confirmed")
    .reduce((sum, r) => sum + r.guests, 0);

  const reservedTables = tables.filter((t) => t.status !== "available").length;
  const tableOccupancy = tables.length > 0 ? Math.round((reservedTables / tables.length) * 100) : 0;

  const chefSpecialsCount = menuItems.filter((m) => m.tags.includes("Chef Special")).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Culinary & Wine Catalog"
        value={totalMenu}
        icon={Utensils}
        accentColor="bg-amber-500/10 text-amber-500"
      />
      <StatCard
        label="Expected Dining Covers"
        value={totalCoversToday}
        icon={Users}
        accentColor="bg-sky-500/10 text-sky-500"
      />
      <StatCard
        label="Table Seating Occupancy"
        value={`${tableOccupancy}%`}
        icon={Wine}
        accentColor="bg-emerald-500/10 text-emerald-500"
      />
      <StatCard
        label="Featured Chef Specials"
        value={chefSpecialsCount}
        icon={Sparkles}
        accentColor="bg-purple-500/10 text-purple-400"
      />
    </div>
  );
}
