"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, RefreshCw, Check, FileText, Send, Mail, Phone, Tag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { generalInquirySchema, GeneralInquiryInput } from "../schema";
import { submitGeneralInquiry } from "../actions";

export function InquiryForm() {
  const [isPending, startTransition] = useTransition();
  const [successData, setSuccessData] = useState<any>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GeneralInquiryInput>({
    resolver: zodResolver(generalInquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: GeneralInquiryInput) => {
    setServerError(null);
    startTransition(async () => {
      try {
        const response = await submitGeneralInquiry(data);
        if (response.success) {
          setSuccessData(response.inquiry);
          reset();
        } else {
          setServerError(response.message || "Failed to submit. Please audit parameters.");
        }
      } catch (err) {
        setServerError("Could not reach guest relations network. Try again later.");
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
          <Heading subtitle>Inquiry Submitted</Heading>
          <Heading as="h2" accent className="tracking-wide">
            Concierge Notified
          </Heading>
          <p className="text-xs text-zinc-400 font-sans max-w-sm mx-auto leading-relaxed pt-2">
            Thank you, {successData.name}. Your inquiry has been logged in our system. Our Guest Relations team will review your message and reply via email within 24 hours.
          </p>
        </div>

        <div className="pt-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            Submit Another Message
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
          <Heading subtitle>Direct Channel</Heading>
          <h3 className="text-sm font-serif text-gold tracking-widest uppercase">
            Inquire Concierge
          </h3>
        </div>

        {serverError && (
          <div className="p-3 border border-red-500/20 bg-red-950/20 text-red-400 text-xs font-sans text-center rounded-sm">
            {serverError}
          </div>
        )}

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label htmlFor="name" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
              Full Name *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                <User size={12} />
              </span>
              <input
                id="name"
                type="text"
                required
                className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none pl-8 pr-2.5 py-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
                placeholder="e.g., Lord Sterling"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <span className="text-[9px] text-red-400 font-sans block">{errors.name.message}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
                Email Address *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                  <Mail size={12} />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none pl-8 pr-2.5 py-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
                  placeholder="sterling@belgravia.com"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <span className="text-[9px] text-red-400 font-sans block">{errors.email.message}</span>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label htmlFor="phone" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
                Phone Number *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                  <Phone size={12} />
                </span>
                <input
                  id="phone"
                  type="tel"
                  required
                  className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none pl-8 pr-2.5 py-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
                  placeholder="+44 7911 123456"
                  {...register("phone")}
                />
              </div>
              {errors.phone && (
                <span className="text-[9px] text-red-400 font-sans block">{errors.phone.message}</span>
              )}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1">
            <label htmlFor="subject" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
              Subject *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                <Tag size={12} />
              </span>
              <input
                id="subject"
                type="text"
                required
                className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none pl-8 pr-2.5 py-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
                placeholder="e.g., Suite custom configurations / Dining reservations inquiry"
                {...register("subject")}
              />
            </div>
            {errors.subject && (
              <span className="text-[9px] text-red-400 font-sans block">{errors.subject.message}</span>
            )}
          </div>

          {/* Message requirements */}
          <div className="space-y-1">
            <label htmlFor="message" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
              Inquiry / Message Content *
            </label>
            <div className="relative">
              <span className="absolute top-3 left-0 pl-3 flex items-start text-zinc-500 pointer-events-none">
                <FileText size={12} />
              </span>
              <textarea
                id="message"
                rows={4}
                required
                className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none pl-8 pr-2.5 py-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm resize-none"
                placeholder="Write your request, reservation details, dietary needs, or questions..."
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
                <RefreshCw size={12} className="animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <Send size={12} /> Send Inquiry
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-[8px] text-zinc-500 font-sans uppercase tracking-widest pt-1">
          <ShieldCheck size={10} className="text-gold/60" /> Verified Secure Communication
        </div>
      </form>
    </div>
  );
}
