"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, User, Calendar, CreditCard } from "lucide-react";

interface ReservationItem {
  id: string;
  date: string;
  guests: number;
  status: string;
  bookedRoomName: string | null;
  finalAmount: number | null;
  time: string | null;
}

interface CustomerRowProps {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    totalBookings: number;
    totalGuests: number;
    lifetimeValue: number;
    reservations: ReservationItem[];
  };
}

export function CustomerRow({ customer }: CustomerRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <tr 
        onClick={() => setIsExpanded(!isExpanded)}
        className="border-b border-gold/5 hover:bg-gold/2 text-xs font-sans text-zinc-300 font-light transition-colors cursor-pointer"
      >
        <td className="p-4 w-4">
          <div className="p-1 border border-gold/20 bg-gold/5 text-gold rounded-full">
            <User size={12} />
          </div>
        </td>
        <td className="p-4 font-medium text-zinc-200">{customer.name}</td>
        <td className="p-4">{customer.email}</td>
        <td className="p-4 font-mono">{customer.phone || "N/A"}</td>
        <td className="p-4 text-center font-medium">{customer.totalBookings}</td>
        <td className="p-4 text-right font-medium text-gold font-mono">
          &pound;{customer.lifetimeValue.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </td>
        <td className="p-4 text-right">
          <span className="text-zinc-500 inline-block">
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-black/40 border-b border-gold/5" onClick={(e) => e.stopPropagation()}>
          <td colSpan={7} className="p-6">
            <div className="space-y-4">
              <span className="block text-[8px] uppercase tracking-wider text-gold font-medium">
                Guest Stay & Dining History
              </span>
              
              <div className="grid grid-cols-1 gap-3">
                {customer.reservations.map((res) => {
                  const isRoom = !!res.bookedRoomName;
                  const estimatedSpend = res.finalAmount ?? (res.guests * 75);

                  return (
                    <div 
                      key={res.id} 
                      className="p-4 border border-gold/10 bg-black/40 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-sans"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block px-2 py-0.5 text-[8px] uppercase tracking-wider font-semibold rounded-none ${
                            isRoom 
                              ? "bg-indigo-950/40 text-indigo-400 border border-indigo-500/20" 
                              : "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20"
                          }`}>
                            {isRoom ? "Accommodation" : "Gastronomy"}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            Ref: {res.id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                        <div className="text-zinc-200 font-medium">
                          {isRoom ? res.bookedRoomName : `Table Seating (${res.time || "N/A"})`}
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Calendar size={10} className="text-gold/60" />
                            {new Date(res.date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span>Party Size: {res.guests}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="block text-[8px] uppercase tracking-wider text-zinc-500 mb-0.5">
                          {isRoom ? "Lodging Rate" : "Est. Dining Spend"}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-zinc-200 font-medium justify-end">
                          <CreditCard size={10} className="text-gold/60" />
                          &pound;{estimatedSpend.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
