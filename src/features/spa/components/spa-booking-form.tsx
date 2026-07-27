"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, RefreshCw, Check, Calendar, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { spaBookingSchema, SpaBookingInput } from "../schema";
import { createSpaInquiry } from "../actions/booking";

interface SpaBookingFormProps {
  therapies: {
    id: string;
    name: string;
    duration: string;
    price: number;
  }[];
}

export function SpaBookingForm({ therapies }: SpaBookingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [successData, setSuccessData] = useState<any>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [minDateString, setMinDateString] = useState("");

  useEffect(() => {
    // Client-side execution of dynamic min date calculations
    const today = new Date();
    if (today.getHours() >= 18) {
      today.setDate(today.getDate() + 1);
    }
    setMinDateString(today.toISOString().split("T")[0]);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<SpaBookingInput>({
    resolver: zodResolver(spaBookingSchema),
    defaultValues: {
      guests: 1,
      treatment: therapies[0]?.id || "",
      time: "10:00",
    },
  });

  const selectedTreatmentId = watch("treatment");
  const selectedTreatment = therapies.find((t) => t.id === selectedTreatmentId) || therapies[0] || {
    name: "Therapy Session",
    duration: "60 Mins",
    price: 150,
  };

  const onSubmit = (data: SpaBookingInput) => {
    setServerError(null);
    startTransition(async () => {
      try {
        const response = await createSpaInquiry(data);
        if (response.success) {
          setSuccessData(response.inquiry);
          reset();
        } else {
          setServerError(response.message || "Failed to submit. Please review inputs.");
        }
      } catch (err) {
        setServerError("Could not reach spa relations desk. Try again later.");
      }
    });
  };

  const handleReset = () => {
    setSuccessData(null);
    setServerError(null);
  };

  if (successData) {
    return (
      <div className="w-full max-w-xl mx-auto p-8 border border-gold/20 bg-charcoal/80 rounded-sm text-center space-y-6 shadow-elevation relative overflow-hidden luxury-glass">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-gold/10 rounded-full blur-[40px] pointer-events-none" />

        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full border border-gold/30 bg-gold/10 flex items-center justify-center text-gold animate-pulse">
            <Check size={24} />
          </div>
        </div>

        <div className="space-y-2">
          <Heading subtitle>Wellness Confirmed</Heading>
          <Heading as="h2" accent className="tracking-wide">
            Your Sanctuary Awaits
          </Heading>
          <p className="text-xs text-zinc-400 font-sans max-w-sm mx-auto leading-relaxed pt-2">
            Dear {successData.name}, we have locked your wellness request. A booking confirmation email containing therapy prep instructions has been sent.
          </p>
        </div>

        <div className="pt-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            Book Another Session
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 border border-gold/10 bg-charcoal/40 rounded-sm shadow-elevation relative luxury-glass">
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute inset-2 border border-gold/5 pointer-events-none z-10" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-20 text-left">
        <div className="text-center space-y-1 mb-4">
          <Heading subtitle>Treatment Booking</Heading>
          <h3 className="text-sm font-serif text-gold tracking-widest uppercase">
            Reserve Wellness Slot
          </h3>
        </div>

        {serverError && (
          <div className="p-3 border border-red-500/20 bg-red-950/20 text-red-400 text-xs font-sans text-center rounded-sm">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div className="space-y-1">
            <label htmlFor="name" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
              Guest Name *
            </label>
            <input
              id="name"
              type="text"
              required
              className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
              placeholder="e.g., Alexandra Vane"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-[9px] text-red-400 font-sans block">{errors.name.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
              placeholder="alexandra@mayfair.com"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-[9px] text-red-400 font-sans block">{errors.email.message}</span>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label htmlFor="phone" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
              Phone Number *
            </label>
            <input
              id="phone"
              type="tel"
              required
              className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
              placeholder="+44 7911 123456"
              {...register("phone")}
            />
            {errors.phone && (
              <span className="text-[9px] text-red-400 font-sans block">{errors.phone.message}</span>
            )}
          </div>

          {/* Therapy Selection */}
          <div className="space-y-1">
            <label htmlFor="treatment" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
              Select Therapy *
            </label>
            <select
              id="treatment"
              className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm cursor-pointer"
              {...register("treatment")}
            >
              {therapies.map((tp) => (
                <option key={tp.id} value={tp.id}>
                  {tp.name} (&pound;{tp.price} / {tp.duration})
                </option>
              ))}
            </select>
            {errors.treatment && (
              <span className="text-[9px] text-red-400 font-sans block">{errors.treatment.message}</span>
            )}
          </div>

          {/* Date Selection */}
          <div className="space-y-1">
            <label htmlFor="date" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
              Sanctuary Date *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                <Calendar size={12} />
              </span>
              <input
                id="date"
                type="date"
                required
                min={minDateString}
                className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none pl-8 pr-2.5 py-2 text-xs text-zinc-200 font-sans font-light rounded-sm scheme-dark"
                {...register("date")}
              />
            </div>
            {errors.date && (
              <span className="text-[9px] text-red-400 font-sans block">{errors.date.message}</span>
            )}
          </div>

          {/* Hour Slot selection */}
          <div className="space-y-1">
            <label htmlFor="time" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
              Hour Slot *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                <Clock size={12} />
              </span>
              <select
                id="time"
                className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none pl-8 pr-2.5 py-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm cursor-pointer"
                {...register("time")}
              >
                <option value="09:00">09:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="13:00">01:00 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="17:00">05:00 PM</option>
                <option value="19:00">07:00 PM</option>
              </select>
            </div>
            {errors.time && (
              <span className="text-[9px] text-red-400 font-sans block">{errors.time.message}</span>
            )}
          </div>

          {/* Guest Count */}
          <div className="space-y-1">
            <label htmlFor="guests" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
              Guests (Max 4) *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                <Users size={12} />
              </span>
              <input
                id="guests"
                type="number"
                required
                className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none pl-8 pr-2.5 py-2 text-xs text-zinc-200 font-sans font-light rounded-sm"
                placeholder="1"
                {...register("guests", { valueAsNumber: true })}
              />
            </div>
            {errors.guests && (
              <span className="text-[9px] text-red-400 font-sans block">{errors.guests.message}</span>
            )}
          </div>

          {/* Notes requirements */}
          <div className="space-y-1 col-span-1 sm:col-span-2">
            <label htmlFor="notes" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
              Therapist Preferences & Health Notes (Optional)
            </label>
            <textarea
              id="notes"
              rows={2}
              className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm resize-none"
              placeholder="e.g. Female therapist preferred, skin allergies, deep pressure details..."
              {...register("notes")}
            />
          </div>
        </div>

        {/* Selected Therapy summary billing calculation */}
        {therapies.length > 0 && (
          <div className="p-3 bg-black/50 border border-gold/5 rounded-sm flex justify-between items-center text-xs font-sans text-zinc-300">
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-zinc-500 font-medium">Selected Therapy</span>
              <span className="text-zinc-200 font-medium">{selectedTreatment.name}</span>
            </div>
            <div className="text-right">
              <span className="block text-[8px] uppercase tracking-wider text-zinc-500 font-medium">Est. Session Rate</span>
              <span className="text-gold font-medium font-mono">&pound;{selectedTreatment.price} / head</span>
            </div>
          </div>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full flex items-center justify-center gap-1.5 text-xs py-2.5"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <RefreshCw size={12} className="animate-spin" /> Scheduling Session...
              </>
            ) : (
              <>Confirm Sanctuary Reservation</>
            )}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-[8px] text-zinc-500 font-sans uppercase tracking-widest pt-1">
          <ShieldCheck size={10} className="text-gold/60" /> Verified Sanctuary Security
        </div>
      </form>
    </div>
  );
}
