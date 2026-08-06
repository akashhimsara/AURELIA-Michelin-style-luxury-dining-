import React from "react";
import { Users, Crown, UserPlus, ShieldAlert } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import type { SerializedGuest } from "@/features/admin/actions/guests";

interface GuestStatsSectionProps {
  guests: SerializedGuest[];
}

export function GuestStatsSection({ guests }: GuestStatsSectionProps) {
  const totalGuests = guests.length;
  const vipCount = guests.filter((g) => g.status === "vip").length;
  const newCount = guests.filter((g) => g.status === "new").length;
  const blacklistedCount = guests.filter((g) => g.status === "blacklisted").length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Guests"
        value={totalGuests.toLocaleString()}
        icon={Users}
        accentColor="bg-sky-500/10 text-sky-500"
      />
      <StatCard
        label="VIP Guests"
        value={vipCount}
        icon={Crown}
        accentColor="bg-amber-500/10 text-amber-500"
      />
      <StatCard
        label="New Registered"
        value={newCount}
        icon={UserPlus}
        accentColor="bg-emerald-500/10 text-emerald-500"
      />
      <StatCard
        label="Blacklisted"
        value={blacklistedCount}
        icon={ShieldAlert}
        accentColor={blacklistedCount > 0 ? "bg-red-500/10 text-red-400" : "bg-gray-500/10 text-gray-400"}
      />
    </div>
  );
}
