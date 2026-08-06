import React from "react";
import { UtensilsCrossed, Sparkles, Heart } from "lucide-react";

interface RevenueSectionProps {
  restaurantRevenue: number;
  spaRevenue: number;
  weddingRevenue: number;
  confirmedCount: number;
}

function RevenueCard({
  label,
  sublabel,
  amount,
  icon: Icon,
  color,
  bg,
  note,
}: {
  label: string;
  sublabel: string;
  amount: number;
  icon: React.ElementType;
  color: string;
  bg: string;
  note?: string;
}) {
  return (
    <div className="admin-card rounded-sm border p-4 flex items-center gap-4">
      <div className={`shrink-0 w-10 h-10 rounded-sm ${bg} flex items-center justify-center`}>
        <Icon size={18} className={color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest opacity-50 font-sans">{sublabel}</p>
        <p className="text-[12px] font-medium font-sans">{label}</p>
        {note && <p className="text-[10px] opacity-35 mt-0.5">{note}</p>}
      </div>
      <div className="text-right shrink-0">
        <p className="text-xl font-semibold font-sans">
          £{amount.toLocaleString("en-GB")}
        </p>
        <p className="text-[10px] opacity-40">this month</p>
      </div>
    </div>
  );
}

export function RevenueSection({
  restaurantRevenue,
  spaRevenue,
  weddingRevenue,
}: RevenueSectionProps) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] uppercase tracking-widest opacity-40 font-sans">Revenue Breakdown</p>
      <RevenueCard
        label="Fine Dining"
        sublabel="Restaurant"
        amount={restaurantRevenue}
        icon={UtensilsCrossed}
        color="text-orange-500"
        bg="bg-orange-500/10"
      />
      <RevenueCard
        label="Spa & Wellness"
        sublabel="Treatments"
        amount={spaRevenue}
        icon={Sparkles}
        color="text-pink-500"
        bg="bg-pink-500/10"
        note="Module coming soon"
      />
      <RevenueCard
        label="Weddings & Events"
        sublabel="Celebrations"
        amount={weddingRevenue}
        icon={Heart}
        color="text-red-400"
        bg="bg-red-500/10"
        note="Module coming soon"
      />
    </div>
  );
}
