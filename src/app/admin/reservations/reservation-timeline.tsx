"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SerializedReservation } from "@/features/admin/actions/reservations";

interface TimelineProps {
  reservations: SerializedReservation[];
  onSelectReservation: (id: string) => void;
}

const TYPE_BG: Record<string, string> = {
  room: "bg-sky-500",
  dining: "bg-amber-500",
  spa: "bg-pink-500",
  wedding: "bg-violet-500",
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function ReservationTimeline({ reservations, onSelectReservation }: TimelineProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const totalDays = daysInMonth(year, month);
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);
  const todayDay = now.getFullYear() === year && now.getMonth() === month ? now.getDate() : -1;

  // Only room reservations for the timeline
  const roomReservations = reservations.filter((r) => r.type === "room" && r.checkOutDate);

  // Group by room name
  const roomNames = [...new Set(roomReservations.map((r) => r.bookedRoomName ?? "Unknown Suite"))];

  const prev = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const next = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  // Calculate reservation position within month
  const getBarStyle = (r: SerializedReservation): { left: string; width: string } | null => {
    const checkIn = new Date(r.date);
    const checkOut = new Date(r.checkOutDate!);
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month, totalDays);

    if (checkOut < monthStart || checkIn > monthEnd) return null;

    const start = Math.max(checkIn.getDate(), 1);
    const end = Math.min(checkOut <= monthEnd ? checkOut.getDate() : totalDays, totalDays);
    const left = ((start - 1) / totalDays) * 100;
    const width = ((end - start + 1) / totalDays) * 100;
    return { left: `${left}%`, width: `${Math.max(width, 2)}%` };
  };

  return (
    <div className="admin-card rounded-sm border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-current/5">
        <div>
          <p className="text-[11px] uppercase tracking-widest opacity-50">Room Bookings</p>
          <p className="font-semibold text-sm">Reservation Timeline</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={prev} className="p-1.5 rounded-sm border border-current/10 hover:border-current/30 transition-colors">
            <ChevronLeft size={13} />
          </button>
          <p className="text-[12px] font-medium">{MONTHS[month]} {year}</p>
          <button onClick={next} className="p-1.5 rounded-sm border border-current/10 hover:border-current/30 transition-colors">
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: 700 }}>
          {/* Day numbers row */}
          <div className="flex pl-36 border-b border-current/5">
            {days.map((d) => (
              <div
                key={d}
                className={`flex-1 text-center text-[9px] py-1.5 font-mono border-r border-current/5 last:border-0 ${
                  d === todayDay ? "bg-amber-500/10 text-amber-500 font-bold" : "opacity-40"
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Rows per room */}
          {roomNames.length === 0 ? (
            <div className="px-5 py-10 text-center text-[12px] opacity-40">
              No room reservations in {MONTHS[month]} {year}
            </div>
          ) : (
            roomNames.map((roomName) => {
              const roomResv = roomReservations.filter(
                (r) => (r.bookedRoomName ?? "Unknown Suite") === roomName
              );
              return (
                <div key={roomName} className="flex items-center border-b border-current/5 h-10 group hover:bg-current/3">
                  {/* Room label */}
                  <div className="w-36 shrink-0 px-3 text-[11px] font-medium truncate opacity-70">
                    {roomName}
                  </div>
                  {/* Bar container */}
                  <div className="relative flex-1 h-full">
                    {/* Day grid lines */}
                    <div className="absolute inset-0 flex pointer-events-none">
                      {days.map((d) => (
                        <div
                          key={d}
                          className={`flex-1 border-r border-current/5 last:border-0 ${
                            d === todayDay ? "bg-amber-500/5" : ""
                          }`}
                        />
                      ))}
                    </div>

                    {/* Reservation bars */}
                    {roomResv.map((r) => {
                      const style = getBarStyle(r);
                      if (!style) return null;
                      return (
                        <button
                          key={r.id}
                          onClick={() => onSelectReservation(r.id)}
                          title={`${r.name} — ${r.status}`}
                          className={`absolute top-1 bottom-1 rounded-sm text-[9px] text-white font-medium px-1.5 truncate z-10 ${TYPE_BG[r.type] ?? "bg-gray-500"} ${
                            r.status === "confirmed" ? "opacity-90" : r.status === "cancelled" ? "opacity-30 line-through" : "opacity-60"
                          } hover:opacity-100 transition-opacity`}
                          style={{ left: style.left, width: style.width }}
                        >
                          {r.name.split(" ")[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-5 py-3 border-t border-current/5 text-[10px]">
        <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-emerald-500" />Confirmed</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-amber-500" />Pending</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-gray-400 opacity-30" />Cancelled</span>
      </div>
    </div>
  );
}
