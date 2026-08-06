"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SerializedReservation } from "@/features/admin/actions/reservations";

interface CalendarProps {
  reservations: SerializedReservation[];
  onSelectReservation: (id: string) => void;
}

const TYPE_COLORS: Record<string, string> = {
  room: "bg-sky-500/80 text-white",
  dining: "bg-amber-500/80 text-zinc-950",
  spa: "bg-pink-500/80 text-white",
  wedding: "bg-violet-500/80 text-white",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  // 0=Sun..6=Sat → convert to Mon-based: Mon=0..Sun=6
  const d = new Date(year, month, 1).getDay();
  return (d + 6) % 7;
}

export function ReservationsCalendar({ reservations, onSelectReservation }: CalendarProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const prev = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const next = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Build day-to-reservations map
  const dayMap: Record<number, SerializedReservation[]> = {};
  for (const r of reservations) {
    const d = new Date(r.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!dayMap[day]) dayMap[day] = [];
      dayMap[day].push(r);
    }
  }

  // Build grid cells
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const todayDay = now.getFullYear() === year && now.getMonth() === month ? now.getDate() : -1;

  return (
    <div className="admin-card rounded-sm border p-5">
      {/* Month Nav */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={prev} className="p-1.5 rounded-sm border border-current/10 hover:border-current/30 transition-colors">
          <ChevronLeft size={14} />
        </button>
        <p className="font-semibold text-sm">{MONTHS[month]} {year}</p>
        <button onClick={next} className="p-1.5 rounded-sm border border-current/10 hover:border-current/30 transition-colors">
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] uppercase tracking-widest opacity-40 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Weeks grid */}
      <div className="grid grid-cols-7 gap-px bg-current/5 rounded-sm overflow-hidden border border-current/5">
        {cells.map((day, i) => {
          const isToday = day === todayDay;
          const dayReservations = day ? (dayMap[day] ?? []) : [];

          return (
            <div
              key={i}
              className={`min-h-[80px] p-1.5 ${
                day ? "admin-card" : "bg-current/2"
              } ${isToday ? "ring-1 ring-inset ring-amber-500/40" : ""}`}
            >
              {day && (
                <>
                  <p className={`text-[11px] font-medium mb-1 w-5 h-5 flex items-center justify-center rounded-full ${
                    isToday ? "bg-amber-500 text-zinc-950 font-bold" : "opacity-60"
                  }`}>
                    {day}
                  </p>
                  <div className="space-y-0.5">
                    {dayReservations.slice(0, 3).map((r) => (
                      <button
                        key={r.id}
                        onClick={() => onSelectReservation(r.id)}
                        className={`w-full text-left text-[9px] px-1 py-0.5 rounded-sm truncate font-medium ${TYPE_COLORS[r.type] ?? "bg-gray-500/70 text-white"}`}
                      >
                        {r.name.split(" ")[0]}
                      </button>
                    ))}
                    {dayReservations.length > 3 && (
                      <p className="text-[9px] opacity-50 pl-1">+{dayReservations.length - 3} more</p>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 text-[10px]">
        {Object.entries(TYPE_COLORS).map(([type, cls]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-sm ${cls}`} />
            <span className="opacity-60 capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
