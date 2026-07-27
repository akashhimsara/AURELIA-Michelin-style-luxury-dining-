"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, Percent, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BookingWidget() {
  const router = useRouter();
  
  // 1. Min date boundaries
  const today = new Date().toISOString().split("T")[0];
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [promo, setPromo] = useState("");

  const handleCheckInChange = (val: string) => {
    setCheckIn(val);
    // If checkout is prior to checkin, reset it
    if (checkOut && val > checkOut) {
      setCheckOut("");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("checkin", checkIn);
    if (checkOut) params.set("checkout", checkOut);
    params.set("guests", guests);
    if (promo) params.set("promo", promo);

    router.push(`/rooms?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-5 border border-gold/15 bg-charcoal/40 rounded-sm shadow-elevation relative luxury-glass z-30">
      {/* Structural layout outlines */}
      <div className="absolute inset-1.5 border border-gold/5 pointer-events-none" />

      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end relative z-20 text-left">
        {/* Check-In input */}
        <div className="space-y-1.5">
          <label htmlFor="checkin" className="block text-[8px] uppercase tracking-[0.25em] text-gold font-sans font-medium">
            Arrival Date
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
              <Calendar size={14} />
            </span>
            <input
              id="checkin"
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => handleCheckInChange(e.target.value)}
              className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none pl-9 pr-2 py-2 text-xs text-zinc-200 font-sans font-light rounded-none scheme-dark"
            />
          </div>
        </div>

        {/* Check-Out input */}
        <div className="space-y-1.5">
          <label htmlFor="checkout" className="block text-[8px] uppercase tracking-[0.25em] text-gold font-sans font-medium">
            Departure Date
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
              <Calendar size={14} />
            </span>
            <input
              id="checkout"
              type="date"
              min={checkIn}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none pl-9 pr-2 py-2 text-xs text-zinc-200 font-sans font-light rounded-none scheme-dark"
              required
            />
          </div>
        </div>

        {/* Guests select */}
        <div className="space-y-1.5">
          <label htmlFor="widget-guests" className="block text-[8px] uppercase tracking-[0.25em] text-gold font-sans font-medium">
            Guests Count
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
              <Users size={14} />
            </span>
            <select
              id="widget-guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none pl-9 pr-2 py-2.5 text-xs text-zinc-200 font-sans font-light rounded-none appearance-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Promo code input */}
        <div className="space-y-1.5">
          <label htmlFor="promo" className="block text-[8px] uppercase tracking-[0.25em] text-gold font-sans font-medium">
            Promo Code
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
              <Percent size={14} />
            </span>
            <input
              id="promo"
              type="text"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="e.g., ESCAPE10"
              className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none pl-9 pr-2 py-2 text-xs text-zinc-200 font-sans font-light rounded-none uppercase"
            />
          </div>
        </div>

        {/* Search Action CTA */}
        <div>
          <Button
            type="submit"
            variant="primary"
            className="w-full flex items-center justify-center gap-2 py-2.5"
          >
            <Search size={14} /> Check Availability
          </Button>
        </div>
      </form>
    </div>
  );
}
