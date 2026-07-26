"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Calendar, Clock, Users, ShieldCheck, RefreshCw, Landmark, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { reservationSchema, ReservationFormInput } from "../schema";
import { createReservation } from "../actions";

interface BookingFormProps {
  roomId?: string;
  selectedRoomName?: string | null;
  roomPrice?: number;
  date?: string;
  promo?: string;
}

export function BookingForm({ roomId, selectedRoomName, roomPrice, date, promo }: BookingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [successData, setSuccessData] = useState<any>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const isRoomBooking = !!roomId;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<ReservationFormInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      guests: 2,
      time: isRoomBooking ? null : "19:00",
      date: date || new Date().toISOString().split("T")[0],
      roomId: roomId || null,
      promoCode: promo || "",
    },
  });

  // Ensure value switches are synced if props update dynamically
  useEffect(() => {
    if (roomId) {
      setValue("roomId", roomId);
      setValue("time", null);
    }
    if (date) {
      setValue("date", date);
    }
    if (promo) {
      setValue("promoCode", promo);
    }
  }, [roomId, date, promo, setValue]);

  // Live promo codes calculation
  const promoCodeValue = watch("promoCode") || "";
  const code = promoCodeValue.toUpperCase().trim();
  let discountRate = 0;
  let promoMessage = "";

  if (code === "ROYAL15") {
    discountRate = 0.15;
    promoMessage = "15% Royal Escape discount applied";
  } else if (code === "MICHELIN10") {
    discountRate = 0.10;
    promoMessage = "10% Gastronomy package discount applied";
  } else if (code === "SANCTUARY20") {
    discountRate = 0.20;
    promoMessage = "20% Wellness Retreat discount applied";
  }

  const basePrice = roomPrice || 0;
  const discountAmount = basePrice * discountRate;
  const finalPrice = basePrice - discountAmount;

  const onSubmit = (data: ReservationFormInput) => {
    setServerError(null);
    startTransition(async () => {
      try {
        const response = await createReservation(data);
        if (response.success) {
          setSuccessData(response.reservation);
          reset();
        } else {
          setServerError(response.message || "Invalid input data. Please check your fields.");
        }
      } catch (err) {
        setServerError("Could not establish connection to the reservation server.");
      }
    });
  };

  const handleReset = () => {
    setSuccessData(null);
    setServerError(null);
  };

  // 1. Success Screen Rendering State
  if (successData) {
    return (
      <div className="w-full max-w-xl mx-auto p-8 border border-gold/20 bg-charcoal/80 rounded-sm text-center space-y-8 shadow-elevation relative overflow-hidden luxury-glass">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-gold/10 rounded-full blur-[40px] pointer-events-none" />

        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full border border-gold/30 bg-gold/10 flex items-center justify-center text-gold animate-pulse">
            <Check size={28} />
          </div>
        </div>

        <div className="space-y-3">
          <Heading subtitle>Reservation Confirmed</Heading>
          <Heading as="h2" accent className="tracking-wide">
            {isRoomBooking ? "Your Suite is Reserved" : "Your Table Awaits"}
          </Heading>
        </div>

        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-gold/30 to-transparent mx-auto" />

        {/* Dynamic Booking Details Display */}
        <div className="grid grid-cols-2 gap-4 text-left border border-gold/10 bg-black/40 p-5 rounded-sm max-w-md mx-auto text-xs font-sans font-light text-zinc-300">
          <div>
            <span className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">Guest</span>
            <span className="font-medium text-zinc-200">{successData.name}</span>
          </div>

          <div>
            <span className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">Guests Size</span>
            <span className="font-medium text-zinc-200">{successData.guests} guests</span>
          </div>

          <div>
            <span className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">Target Date</span>
            <span className="font-medium text-zinc-200">
              {new Date(successData.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div>
            <span className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">
              {isRoomBooking ? "Lodging Unit" : "Dining Slot"}
            </span>
            <span className="font-medium text-zinc-200">
              {isRoomBooking ? successData.bookedRoomName : successData.time}
            </span>
          </div>

          {isRoomBooking && successData.roomRateAtBooking && (
            <div className="col-span-2 pt-2 border-t border-gold/5 flex justify-between items-center">
              <span className="text-[9px] uppercase tracking-wider text-zinc-500">Locked Deposit billing</span>
              <span className="font-mono text-gold font-medium">&pound;{successData.roomRateAtBooking.toFixed(2)}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-zinc-400 font-sans font-light max-w-sm mx-auto leading-relaxed">
          A confirmation summary has been dispatched. {isRoomBooking ? "Check-in time starts at 15:00 PM." : "Please note our smart elegant dress code."} We look forward to hosting you.
        </p>

        <div className="pt-4">
          <Button variant="outline" size="sm" onClick={handleReset}>
            Book Another Arrangement
          </Button>
        </div>
      </div>
    );
  }

  // 2. Standard Input Form Rendering State
  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 border border-gold/10 bg-charcoal/40 rounded-sm shadow-elevation relative luxury-glass">
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute inset-2 border border-gold/5 pointer-events-none z-10" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-20">
        {serverError && (
          <div className="p-3 border border-red-500/20 bg-red-950/20 text-red-400 text-xs font-sans text-center rounded-sm">
            {serverError}
          </div>
        )}

        {/* Hidden inputs */}
        <input type="hidden" {...register("roomId")} />

        {isRoomBooking && selectedRoomName && (
          <div className="p-4 border border-gold/10 bg-gold/5 text-center rounded-sm space-y-1">
            <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-sans block">
              Selected Suite Arrangement
            </span>
            <span className="text-sm font-serif text-gold block font-medium">
              {selectedRoomName}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Guest Name */}
          <div className="space-y-1.5 col-span-1 sm:col-span-2">
            <label htmlFor="name" className="block text-[10px] uppercase tracking-widest text-gold font-sans font-medium">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-3 text-sm text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
              placeholder="E.g., Lord Sterling"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-[10px] text-red-400 font-sans block">{errors.name.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-[10px] uppercase tracking-widest text-gold font-sans font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-3 text-sm text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
              placeholder="sterling@belgravia.com"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-[10px] text-red-400 font-sans block">{errors.email.message}</span>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label htmlFor="phone" className="block text-[10px] uppercase tracking-widest text-gold font-sans font-medium">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-3 text-sm text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
              placeholder="+44 7123 456789"
              {...register("phone")}
            />
            {errors.phone && (
              <span className="text-[10px] text-red-400 font-sans block">{errors.phone.message}</span>
            )}
          </div>

          {/* Date Selector */}
          <div className="space-y-1.5">
            <label htmlFor="date" className="block text-[10px] uppercase tracking-widest text-gold font-sans font-medium">
              {isRoomBooking ? "Check-in Date" : "Select Date"}
            </label>
            <input
              id="date"
              type="date"
              className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-3 text-sm text-zinc-200 font-sans font-light rounded-sm transition-all duration-300 scheme-dark"
              {...register("date")}
            />
            {errors.date && (
              <span className="text-[10px] text-red-400 font-sans block">{errors.date.message}</span>
            )}
          </div>

          {/* Conditional rendering for dining time */}
          {!isRoomBooking ? (
            <div className="space-y-1.5">
              <label htmlFor="time" className="block text-[10px] uppercase tracking-widest text-gold font-sans font-medium">
                Seating Time
              </label>
              <select
                id="time"
                className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-3 text-sm text-zinc-200 font-sans font-light rounded-sm transition-all duration-300 appearance-none cursor-pointer"
                {...register("time")}
              >
                <option value="17:30">17:30 PM (Early Dinner)</option>
                <option value="18:00">18:00 PM</option>
                <option value="18:30">18:30 PM</option>
                <option value="19:00">19:00 PM (Prime seating)</option>
                <option value="19:30">19:30 PM (Prime seating)</option>
                <option value="20:00">20:00 PM</option>
                <option value="20:30">20:30 PM</option>
                <option value="21:00">21:00 PM</option>
                <option value="21:30">21:30 PM (Late Dinner)</option>
              </select>
              {errors.time && (
                <span className="text-[10px] text-red-400 font-sans block">{errors.time.message}</span>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-widest text-gold font-sans font-medium">
                Check-in Window
              </label>
              <div className="w-full bg-black/30 border border-gold/10 p-3 text-xs text-zinc-400 font-sans font-light rounded-sm">
                Check-in starts at 15:00 PM
              </div>
            </div>
          )}

          {/* Guest Count */}
          <div className="space-y-1.5">
            <label htmlFor="guests" className="block text-[10px] uppercase tracking-widest text-gold font-sans font-medium">
              {isRoomBooking ? "Number of Guests" : "Number of Guests"}
            </label>
            <select
              id="guests"
              className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-3 text-sm text-zinc-200 font-sans font-light rounded-sm transition-all duration-300 appearance-none cursor-pointer"
              {...register("guests", { valueAsNumber: true })}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>
            {errors.guests && (
              <span className="text-[10px] text-red-400 font-sans block">{errors.guests.message}</span>
            )}
          </div>

          {/* Promo Code input */}
          <div className="space-y-1.5">
            <label htmlFor="promoCode" className="block text-[10px] uppercase tracking-widest text-gold font-sans font-medium">
              Promo Code
            </label>
            <input
              id="promoCode"
              type="text"
              className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-3 text-sm text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
              placeholder="e.g., ROYAL15"
              {...register("promoCode")}
            />
          </div>
        </div>

        {/* Dynamic price calculation display for lodging bookings */}
        {isRoomBooking && roomPrice && (
          <div className="p-4 bg-black/50 border border-gold/15 rounded-sm space-y-2 text-xs font-sans">
            <div className="flex justify-between items-center text-zinc-400">
              <span>Base Rate per Night:</span>
              <span className="font-mono text-zinc-200">&pound;{basePrice.toFixed(2)}</span>
            </div>

            {discountRate > 0 && (
              <div className="flex justify-between items-center text-emerald-400">
                <span className="flex items-center gap-1">
                  <Percent size={12} /> {promoMessage}
                </span>
                <span className="font-mono">-&pound;{discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="pt-2 border-t border-gold/5 flex justify-between items-center text-sm">
              <span className="text-zinc-300 font-medium">Estimated Deposit Due:</span>
              <span className="font-mono text-gold font-semibold">&pound;{finalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full flex items-center justify-center gap-2"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <RefreshCw size={14} className="animate-spin" /> Finalizing Booking...
              </>
            ) : (
              <>{isRoomBooking ? "Book Luxury Suite" : "Confirm Seating"}</>
            )}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-[9px] text-zinc-500 font-sans uppercase tracking-widest pt-2">
          <ShieldCheck size={12} className="text-gold/60" /> Secure SSL Arrangement
        </div>
      </form>
    </div>
  );
}
