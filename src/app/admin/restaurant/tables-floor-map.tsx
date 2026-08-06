"use client";

import React, { useState } from "react";
import { Users, CheckCircle2, Clock, UtensilsCrossed } from "lucide-react";
import type { RestaurantTableInfo } from "@/features/admin/actions/restaurant";

interface TablesFloorMapProps {
  tables: RestaurantTableInfo[];
}

const SEATING_SLOTS = ["Lunch 12:00", "Lunch 13:30", "Dinner 18:30", "Dinner 20:30"];

const ZONES = [
  "Window Solarium",
  "Main Dining Room",
  "Chef's Counter",
  "Private Salon",
  "Terrace Lounge",
];

export function TablesFloorMap({ tables }: TablesFloorMapProps) {
  const [selectedSlot, setSelectedSlot] = useState("Dinner 18:30");

  return (
    <div className="space-y-6">
      {/* Seating Slot Switcher Bar */}
      <div className="flex items-center justify-between admin-card rounded-sm border p-3">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-amber-500" />
          <span className="text-[12px] font-medium font-sans">Seating Time Slot:</span>
        </div>

        <div className="flex border border-current/10 rounded-sm p-0.5">
          {SEATING_SLOTS.map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedSlot(slot)}
              className={`px-3 py-1.5 text-[11px] font-medium rounded-sm transition-colors ${
                selectedSlot === slot
                  ? "bg-amber-500 text-zinc-950 font-semibold"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Floor Plan Zones */}
      <div className="space-y-6">
        {ZONES.map((zone) => {
          const zoneTables = tables.filter((t) => t.zone === zone);
          if (zoneTables.length === 0) return null;

          return (
            <div key={zone} className="admin-card rounded-sm border p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-current/5 pb-2">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-amber-500 font-sans">
                  {zone}
                </h3>
                <span className="text-[10px] opacity-40">{zoneTables.length} Tables</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {zoneTables.map((t) => {
                  const isReserved = t.status !== "available";

                  return (
                    <div
                      key={t.tableNumber}
                      className={`rounded-sm border p-4 flex flex-col justify-between space-y-3 transition-all ${
                        isReserved
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                          : "border-current/10 bg-current/2 hover:border-current/30"
                      }`}
                    >
                      {/* Table Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-sm font-bold">Table #{t.tableNumber}</span>
                          <p className="text-[10px] opacity-60 flex items-center gap-1 mt-0.5">
                            <Users size={11} /> {t.capacity} Pax
                          </p>
                        </div>
                        <span
                          className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm border ${
                            t.status === "seated"
                              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                              : t.status === "reserved"
                              ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                              : "bg-gray-500/10 border-gray-500/20 opacity-60"
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>

                      {/* Reserved Guest Name */}
                      <div className="pt-2 border-t border-current/10">
                        {isReserved ? (
                          <div>
                            <p className="text-[10px] opacity-50 uppercase tracking-widest">Reserved Guest</p>
                            <p className="text-[11px] font-semibold truncate">{t.reservedForGuest ?? "Lord Sterling"}</p>
                          </div>
                        ) : (
                          <p className="text-[10px] opacity-40 italic">Available for walk-in / booking</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
