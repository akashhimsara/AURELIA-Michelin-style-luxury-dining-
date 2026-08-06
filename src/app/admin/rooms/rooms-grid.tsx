"use client";

import React from "react";
import { BedDouble, Users, Sparkles, Edit3, Eye, ShieldAlert, CheckCircle2 } from "lucide-react";
import type { SerializedRoom } from "@/features/admin/actions/rooms";

interface RoomsGridProps {
  rooms: SerializedRoom[];
  onOpenDetail: (id: string) => void;
  onEdit: (room: SerializedRoom) => void;
}

function CleaningBadge({ status, outOfService }: { status: string; outOfService: boolean }) {
  if (outOfService) {
    return (
      <span className="bg-red-500/90 text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm">
        Out of Service
      </span>
    );
  }
  switch (status) {
    case "clean":
      return (
        <span className="bg-emerald-500/90 text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm">
          Clean
        </span>
      );
    case "dirty":
      return (
        <span className="bg-amber-500/90 text-zinc-950 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm">
          Dirty
        </span>
      );
    default:
      return (
        <span className="bg-sky-500/90 text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm">
          {status}
        </span>
      );
  }
}

export function RoomsGrid({ rooms, onOpenDetail, onEdit }: RoomsGridProps) {
  if (rooms.length === 0) {
    return (
      <div className="admin-card rounded-sm border p-12 text-center text-xs opacity-40">
        No suites match the selected criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="admin-card rounded-sm border overflow-hidden flex flex-col group hover:shadow-md transition-all duration-200"
        >
          {/* Image & Badges */}
          <div className="relative h-48 bg-zinc-950 overflow-hidden cursor-pointer" onClick={() => onOpenDetail(room.id)}>
            <img
              src={room.imageUrl}
              alt={room.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Status Badges Header */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <CleaningBadge status={room.cleaningStatus} outOfService={room.outOfService} />
              <span className="bg-zinc-950/80 backdrop-blur-xs text-amber-400 border border-amber-500/30 text-xs font-mono font-semibold px-2 py-0.5 rounded-sm">
                £{room.pricePerNight} / night
              </span>
            </div>

            {/* Bottom Overlay Title */}
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-white font-semibold text-sm drop-shadow-sm truncate">{room.name}</p>
              <p className="text-amber-400/90 text-[10px] uppercase tracking-widest font-medium">
                {room.category}
              </p>
            </div>
          </div>

          {/* Body specs */}
          <div className="p-4 flex-1 space-y-3 text-[11px]">
            <p className="opacity-60 line-clamp-2 leading-relaxed">{room.description}</p>

            <div className="flex items-center justify-between pt-1 border-t border-current/5">
              <span className="flex items-center gap-1 opacity-70">
                <Users size={12} className="text-amber-500" />
                Max {room.capacity} Guests
              </span>
              <span className={`font-medium ${room.isOccupiedToday ? "text-amber-500" : "text-emerald-500"}`}>
                {room.isOccupiedToday ? `Occupied` : `Available`}
              </span>
            </div>

            {/* Facilities Tags */}
            <div className="flex flex-wrap gap-1">
              {room.facilities.slice(0, 3).map((f) => (
                <span key={f.id} className="text-[9px] px-1.5 py-0.5 rounded-xs bg-current/5 opacity-70">
                  {f.name}
                </span>
              ))}
              {room.facilities.length > 3 && (
                <span className="text-[9px] px-1 py-0.5 opacity-40">+{room.facilities.length - 3}</span>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-4 py-3 border-t border-current/5 flex items-center justify-between bg-current/2">
            <span className="text-[10px] opacity-40">
              Staff: {room.assignedHousekeeper ?? "Unassigned"}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(room)}
                className="p-1.5 rounded-sm border border-current/10 hover:border-amber-500/40 hover:text-amber-500 transition-colors"
                title="Edit Suite Specs"
              >
                <Edit3 size={13} />
              </button>
              <button
                onClick={() => onOpenDetail(room.id)}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-sm bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500 hover:text-zinc-950 font-medium transition-colors"
              >
                <Eye size={12} /> Inspect
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
