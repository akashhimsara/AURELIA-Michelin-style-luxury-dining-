import React from "react";
import { BedDouble, CheckCircle2, Sparkles, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import type { SerializedRoom } from "@/features/admin/actions/rooms";

interface RoomStatsSectionProps {
  rooms: SerializedRoom[];
}

export function RoomStatsSection({ rooms }: RoomStatsSectionProps) {
  const totalRooms = rooms.length;
  const occupiedCount = rooms.filter((r) => r.isOccupiedToday).length;
  const cleanCount = rooms.filter((r) => r.cleaningStatus === "clean" && !r.outOfService).length;
  const maintenanceCount = rooms.filter((r) => r.outOfService || r.maintenanceStatus !== "operational").length;

  const occupancyRate = totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Property Suites"
        value={totalRooms}
        icon={BedDouble}
        accentColor="bg-amber-500/10 text-amber-500"
      />
      <StatCard
        label="Occupied Today"
        value={`${occupiedCount} (${occupancyRate}%)`}
        icon={CheckCircle2}
        accentColor="bg-sky-500/10 text-sky-500"
      />
      <StatCard
        label="Clean & Inspected"
        value={cleanCount}
        icon={Sparkles}
        accentColor="bg-emerald-500/10 text-emerald-500"
      />
      <StatCard
        label="Maintenance / OOS"
        value={maintenanceCount}
        icon={AlertTriangle}
        accentColor={maintenanceCount > 0 ? "bg-red-500/10 text-red-400" : "bg-gray-500/10 text-gray-400"}
      />
    </div>
  );
}
