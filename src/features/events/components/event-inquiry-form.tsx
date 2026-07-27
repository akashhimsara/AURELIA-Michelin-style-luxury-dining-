"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, RefreshCw, Check, Calendar, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { eventInquirySchema, EventInquiryInput } from "../schema";
import { createEventInquiry } from "../actions/inquiry";

export function EventInquiryForm() {
  const [isPending, startTransition] = useTransition();
  const [successData, setSuccessData] = useState<any>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventInquiryInput>({
    resolver: zodResolver(eventInquirySchema),
    defaultValues: {
      guests: 50,
      eventType: "wedding",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = (data: EventInquiryInput) => {
    setServerError(null);
    startTransition(async () => {
      try {
        const response = await createEventInquiry(data);
        if (response.success) {
          setSuccessData(response.inquiry);
          reset();
        } else {
          setServerError(response.message || "Failed to submit. Please audit parameters.");
        }
      } catch (err) {
        setServerError("Could not reach event relations network. Try again later.");
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
          <Heading subtitle>Inquiry Received</Heading>
          <Heading as="h2" accent className="tracking-wide">
            Orchestrating Your Vision
          </Heading>
          <p className="text-xs text-zinc-400 font-sans max-w-sm mx-auto leading-relaxed pt-2">
            Dear {successData.name}, our luxury event coordinators will review your capacity requirements and reach out within 24 hours.
          </p>
        </div>

        <div className="pt-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            Submit Another Inquiry
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
          <Heading subtitle>Bespoke Gathering</Heading>
          <h3 className="text-sm font-serif text-gold tracking-widest uppercase">
            Inquire Event Coordinates
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
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              required
              className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
              placeholder="e.g., Lady Victoria"
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
              placeholder="victoria@manor.com"
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

          {/* Event Type */}
          <div className="space-y-1">
            <label htmlFor="eventType" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
              Event Category *
            </label>
            <select
              id="eventType"
              className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm cursor-pointer"
              {...register("eventType")}
            >
              <option value="wedding">Wedding Ceremony (Min 50)</option>
              <option value="corporate">Corporate Seminar (Min 20)</option>
              <option value="private">Private Dinner / Celebration (Min 10)</option>
            </select>
            {errors.eventType && (
              <span className="text-[9px] text-red-400 font-sans block">{errors.eventType.message}</span>
            )}
          </div>

          {/* Date Selection */}
          <div className="space-y-1">
            <label htmlFor="date" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
              Preferred Date *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                <Calendar size={12} />
              </span>
              <input
                id="date"
                type="date"
                required
                className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none pl-8 pr-2.5 py-2 text-xs text-zinc-200 font-sans font-light rounded-sm scheme-dark"
                {...register("date")}
              />
            </div>
            {errors.date && (
              <span className="text-[9px] text-red-400 font-sans block">{errors.date.message}</span>
            )}
          </div>

          {/* Guest Count */}
          <div className="space-y-1">
            <label htmlFor="guests" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
              Expected Guests *
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
                placeholder="100"
                {...register("guests", { valueAsNumber: true })}
              />
            </div>
            {errors.guests && (
              <span className="text-[9px] text-red-400 font-sans block">{errors.guests.message}</span>
            )}
          </div>

          {/* Message requirements */}
          <div className="space-y-1 col-span-1 sm:col-span-2">
            <label htmlFor="message" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
              Special Venue & Catering Configurations *
            </label>
            <div className="relative">
              <span className="absolute top-3 left-0 pl-3 flex items-start text-zinc-500 pointer-events-none">
                <FileText size={12} />
              </span>
              <textarea
                id="message"
                rows={3}
                required
                className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none pl-8 pr-2.5 py-2 text-xs text-zinc-200 font-sans font-light rounded-sm resize-none"
                placeholder="Mention theme options, custom menus, structural audiovisual needs, etc..."
                {...register("message")}
              />
            </div>
            {errors.message && (
              <span className="text-[9px] text-red-400 font-sans block">{errors.message.message}</span>
            )}
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full flex items-center justify-center gap-1.5 text-xs py-2.5"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <RefreshCw size={12} className="animate-spin" /> Transmitting Inquiry...
              </>
            ) : (
              <>Submit Event Inquiry</>
            )}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-[8px] text-zinc-500 font-sans uppercase tracking-widest pt-1">
          <ShieldCheck size={10} className="text-gold/60" /> Verified Lead Security
        </div>
      </form>
    </div>
  );
}
