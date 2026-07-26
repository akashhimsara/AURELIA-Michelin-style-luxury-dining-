"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Calendar, Clock, Users, ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { reservationSchema, ReservationFormInput } from "../schema";
import { createReservation } from "../actions";

export function BookingForm() {
  const [isPending, startTransition] = useTransition();
  const [successData, setSuccessData] = useState<any>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReservationFormInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      guests: 2,
      time: "19:00",
      date: new Date().toISOString().split("T")[0],
    },
  });

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

  // 1. Success Rendering State
  if (successData) {
    return (
      <div className="w-full max-w-xl mx-auto p-8 border border-gold/20 bg-charcoal/80 rounded-sm text-center space-y-8 shadow-elevation relative overflow-hidden luxury-glass">
        {/* Absolute glow design highlights */}
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
            Your Table Awaits
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
            <span className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">Guests Count</span>
            <span className="flex items-center gap-1.5 font-medium text-zinc-200">
              <Users size={12} className="text-gold" /> {successData.guests} guests
            </span>
          </div>
          <div className="pt-2">
            <span className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">Date</span>
            <span className="flex items-center gap-1.5 font-medium text-zinc-200">
              <Calendar size={12} className="text-gold" />{" "}
              {new Date(successData.date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="pt-2">
            <span className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">Time</span>
            <span className="flex items-center gap-1.5 font-medium text-zinc-200">
              <Clock size={12} className="text-gold" /> {successData.time}
            </span>
          </div>
          <div className="col-span-2 border-t border-gold/5 pt-4 mt-2">
            <span className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">Booking Code</span>
            <span className="font-mono text-gold text-sm tracking-widest font-semibold">
              {successData.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-zinc-500 font-sans max-w-sm mx-auto leading-relaxed">
          A confirmation summary has been dispatched. Please note our smart elegant dress code. We look forward to hosting you.
        </p>

        <div className="pt-4">
          <Button variant="outline" size="sm" onClick={handleReset}>
            Book Another Seating
          </Button>
        </div>
      </div>
    );
  }

  // 2. Standard Input Form Rendering State
  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 border border-gold/10 bg-charcoal/40 rounded-sm shadow-elevation relative luxury-glass">
      {/* Structural layout glow borders */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute inset-2 border border-gold/5 pointer-events-none z-10" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-20">
        {/* Error reporting banner */}
        {serverError && (
          <div className="p-3 border border-red-500/20 bg-red-950/20 text-red-400 text-xs font-sans text-center rounded-sm">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Guest Name input */}
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

          {/* Email input */}
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

          {/* Phone input */}
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

          {/* Date Selector input */}
          <div className="space-y-1.5">
            <label htmlFor="date" className="block text-[10px] uppercase tracking-widest text-gold font-sans font-medium">
              Select Date
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

          {/* Time Selector select */}
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

          {/* Guest Count Input select */}
          <div className="space-y-1.5 col-span-1 sm:col-span-2">
            <label htmlFor="guests" className="block text-[10px] uppercase tracking-widest text-gold font-sans font-medium">
              Number of Guests
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
        </div>

        {/* Submit action CTA */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            className="w-full flex items-center justify-center gap-2"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <RefreshCw size={14} className="animate-spin" /> Verifying Table...
              </>
            ) : (
              <>Confirm Seating</>
            )}
          </Button>
        </div>

        {/* Security assurance */}
        <div className="flex items-center justify-center gap-2 text-[9px] text-zinc-500 font-sans uppercase tracking-widest pt-2">
          <ShieldCheck size={12} className="text-gold/60" /> Secure SSL Reservation
        </div>
      </form>
    </div>
  );
}
