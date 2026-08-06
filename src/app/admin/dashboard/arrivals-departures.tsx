import React from "react";
import { LogIn, LogOut, BedDouble, Users } from "lucide-react";

interface Arrival {
  id: string;
  name: string;
  email: string;
  bookedRoomName: string | null;
  date: string;
  checkOutDate: string | null;
  guests: number;
}

interface ArrivalsDeparturesProps {
  arrivals: Arrival[];
  departures: Arrival[];
}

function calcNights(checkIn: string, checkOut: string | null): number {
  if (!checkOut) return 1;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function GuestRow({ item, type }: { item: Arrival; type: "arrival" | "departure" }) {
  const nights = calcNights(item.date, item.checkOutDate);
  const dateLabel = type === "arrival" ? formatDate(item.date) : formatDate(item.checkOutDate || item.date);

  return (
    <div className="flex items-center gap-3 py-2.5 border-b last:border-0 border-current/5">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 text-[11px] font-bold">
        {initials(item.name)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium truncate">{item.name}</p>
        <p className="text-[11px] opacity-50 truncate">{item.bookedRoomName || "Suite"}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[12px] font-semibold">{dateLabel}</p>
        <p className="text-[11px] opacity-50 flex items-center gap-1 justify-end">
          <Users size={9} />
          {item.guests} · {nights}N
        </p>
      </div>
    </div>
  );
}

export function ArrivalsDepartures({ arrivals, departures }: ArrivalsDeparturesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Upcoming Arrivals */}
      <div className="admin-card rounded-sm border p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-sm bg-emerald-500/10 flex items-center justify-center">
            <LogIn size={14} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest opacity-50 font-sans">Next 7 Days</p>
            <p className="text-sm font-semibold font-sans">Upcoming Arrivals</p>
          </div>
          <span className="ml-auto text-[11px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-medium">
            {arrivals.length}
          </span>
        </div>
        <div>
          {arrivals.length === 0 ? (
            <p className="text-[12px] opacity-40 py-4 text-center">No arrivals scheduled</p>
          ) : (
            arrivals.map((a) => <GuestRow key={a.id} item={a} type="arrival" />)
          )}
        </div>
      </div>

      {/* Upcoming Departures */}
      <div className="admin-card rounded-sm border p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-sm bg-violet-500/10 flex items-center justify-center">
            <LogOut size={14} className="text-violet-500" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest opacity-50 font-sans">Next 7 Days</p>
            <p className="text-sm font-semibold font-sans">Upcoming Departures</p>
          </div>
          <span className="ml-auto text-[11px] bg-violet-500/10 text-violet-500 px-2 py-0.5 rounded-full font-medium">
            {departures.length}
          </span>
        </div>
        <div>
          {departures.length === 0 ? (
            <p className="text-[12px] opacity-40 py-4 text-center">No departures scheduled</p>
          ) : (
            departures.map((d) => <GuestRow key={d.id} item={d} type="departure" />)
          )}
        </div>
      </div>
    </div>
  );
}
