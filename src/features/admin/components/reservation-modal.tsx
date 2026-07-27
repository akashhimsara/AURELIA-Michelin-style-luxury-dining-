"use client";

import React, { useState, useTransition, useEffect } from "react";
import { X, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { createReservationAdmin, updateReservation } from "../actions/reservations";

interface RoomItem {
  id: string;
  name: string;
}

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: RoomItem[];
  reservation?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string | null;
    guests: number;
    status: string;
    roomId: string | null;
  } | null;
}

export function ReservationModal({ isOpen, onClose, rooms, reservation }: ReservationModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // States matching fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [bookingType, setBookingType] = useState<"dining" | "lodging">("dining");
  const [time, setTime] = useState("19:00");
  const [roomId, setRoomId] = useState("");
  const [guests, setGuests] = useState(2);
  const [status, setStatus] = useState("confirmed");

  // Sync if editing
  useEffect(() => {
    if (reservation) {
      setName(reservation.name);
      setEmail(reservation.email);
      setPhone(reservation.phone);
      setDate(reservation.date.split("T")[0]);
      setBookingType(reservation.roomId ? "lodging" : "dining");
      setTime(reservation.time || "19:00");
      setRoomId(reservation.roomId || "");
      setGuests(reservation.guests);
      setStatus(reservation.status);
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setDate(new Date().toISOString().split("T")[0]);
      setBookingType("dining");
      setTime("19:00");
      setRoomId(rooms[0]?.id || "");
      setGuests(2);
      setStatus("confirmed");
    }
    setError(null);
  }, [reservation, isOpen, rooms]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !phone || !date) {
      setError("Please fill out all required fields.");
      return;
    }

    const payload = {
      name,
      email,
      phone,
      date,
      time: bookingType === "dining" ? time : null,
      guests: Number(guests),
      status,
      roomId: bookingType === "lodging" ? roomId : null,
    };

    startTransition(async () => {
      let result;
      if (reservation) {
        result = await updateReservation(reservation.id, payload);
      } else {
        result = await createReservationAdmin(payload);
      }

      if (result.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" 
        onClick={onClose} 
      />

      {/* Card Content wrapper */}
      <div className="relative w-full max-w-lg bg-charcoal/90 border border-gold/15 p-6 sm:p-8 rounded-sm shadow-elevation max-h-[90vh] overflow-y-auto luxury-glass text-left">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-gold transition-colors outline-none cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="mb-6">
          <Heading subtitle>{reservation ? "Update Booking" : "New Booking"}</Heading>
          <h2 className="text-lg font-serif text-zinc-100 tracking-wide font-light">
            {reservation ? "Reschedule Guest Arrangement" : "Create Manual Reservation"}
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 border border-red-500/20 bg-red-950/20 text-red-400 text-xs font-sans rounded-sm flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-1">
              <label className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
                Guest Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm"
                placeholder="e.g. Lord Sterling"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm"
                placeholder="sterling@belgravia.com"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm"
                placeholder="+44 7123 456789"
              />
            </div>

            {/* Date */}
            <div className="space-y-1">
              <label className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
                Target Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm scheme-dark"
              />
            </div>

            {/* Booking Type */}
            <div className="space-y-1">
              <label className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
                Arrangement Type
              </label>
              <select
                value={bookingType}
                onChange={(e) => setBookingType(e.target.value as "dining" | "lodging")}
                className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm"
              >
                <option value="dining">Dining Seating</option>
                <option value="lodging">Suite Lodging</option>
              </select>
            </div>

            {/* Seating Time or Suite Selection */}
            {bookingType === "dining" ? (
              <div className="space-y-1">
                <label className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
                  Seating Time
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm"
                >
                  <option value="17:30">17:30 PM</option>
                  <option value="18:00">18:00 PM</option>
                  <option value="18:30">18:30 PM</option>
                  <option value="19:00">19:00 PM</option>
                  <option value="19:30">19:30 PM</option>
                  <option value="20:00">20:00 PM</option>
                  <option value="20:30">20:30 PM</option>
                  <option value="21:00">21:00 PM</option>
                </select>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
                  Select Suite
                </label>
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm"
                >
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Guests */}
            <div className="space-y-1">
              <label className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
                Party Size
              </label>
              <input
                type="number"
                min={1}
                max={20}
                required
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm"
              />
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
                Booking Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 text-xs py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <RefreshCw size={12} className="animate-spin" /> Saving...
                </>
              ) : (
                <>{reservation ? "Update Booking" : "Create Booking"}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
