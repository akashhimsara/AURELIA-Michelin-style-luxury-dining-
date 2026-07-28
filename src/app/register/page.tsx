"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, RefreshCw, KeyRound, Mail, User, Phone, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { registerSchema, RegisterInput } from "@/features/auth/schema";
import { registerGuest } from "@/features/auth/actions";

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterInput) => {
    setError(null);
    setSuccessMessage(null);
    startTransition(async () => {
      const result = await registerGuest(data);
      if (!result.success) {
        setError(result.message || "Failed to register.");
      } else {
        setSuccessMessage(result.message || "Registration successful.");
        reset();
      }
    });
  };

  if (successMessage) {
    return (
      <PageWrapper>
        <Section className="flex-1 flex items-center justify-center pt-20 pb-24 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.015)_0%,_black_100%)]">
          <Container className="max-w-md mx-auto">
            <div className="w-full p-8 border border-gold/20 bg-charcoal/80 rounded-sm text-center space-y-6 shadow-elevation relative overflow-hidden luxury-glass">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-gold/10 rounded-full blur-[40px] pointer-events-none" />

              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full border border-gold/30 bg-gold/10 flex items-center justify-center text-gold animate-pulse">
                  <Check size={24} />
                </div>
              </div>

              <div className="space-y-2">
                <Heading subtitle>Verification Dispatched</Heading>
                <Heading as="h2" accent className="tracking-wide">
                  Guest Registry Created
                </Heading>
                <p className="text-xs text-zinc-400 font-sans max-w-sm mx-auto leading-relaxed pt-2">
                  {successMessage}
                </p>
                <p className="text-[10px] text-zinc-500 font-sans leading-relaxed pt-2">
                  (In development: Please check your terminal console logs for the mock verification link.)
                </p>
              </div>

              <div className="pt-2">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Return to Login
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Section className="flex-1 flex items-center justify-center pt-20 pb-24 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.015)_0%,_black_100%)]">
        <Container className="max-w-md mx-auto">
          <div className="w-full p-6 sm:p-8 border border-gold/10 bg-charcoal/40 rounded-sm shadow-elevation relative luxury-glass">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
            <div className="absolute inset-2 border border-gold/5 pointer-events-none z-10" />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-20 text-left">
              <div className="text-center space-y-1.5 mb-5">
                <Heading subtitle>Luxury Stays</Heading>
                <Heading as="h1" accent className="tracking-wide text-2xl sm:text-3xl">
                  Register Guest
                </Heading>
                <p className="text-xs text-zinc-400 font-sans font-light leading-relaxed">
                  Establish a secure guest profile to unlock premium loyalty reward points and exclusive rates.
                </p>
              </div>

              {error && (
                <div className="p-3 border border-red-500/20 bg-red-950/20 text-red-400 text-xs font-sans text-center rounded-sm">
                  {error}
                </div>
              )}

              <div className="space-y-3.5">
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
                      className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none pl-8 pr-2.5 py-2 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
                      placeholder="e.g. Lord Sterling"
                      {...register("name")}
                    />
                  </div>
                  {errors.name && (
                    <span className="text-[9px] text-red-400 font-sans block">{errors.name.message}</span>
                  )}
                </div>

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
                      className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none pl-8 pr-2.5 py-2 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
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
                      className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none pl-8 pr-2.5 py-2 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
                      placeholder="+44 7911 123456"
                      {...register("phone")}
                    />
                  </div>
                  {errors.phone && (
                    <span className="text-[9px] text-red-400 font-sans block">{errors.phone.message}</span>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
                    Create Password *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                      <KeyRound size={12} />
                    </span>
                    <input
                      id="password"
                      type="password"
                      required
                      className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none pl-8 pr-2.5 py-2 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
                      placeholder="Min. 6 characters"
                      {...register("password")}
                    />
                  </div>
                  {errors.password && (
                    <span className="text-[9px] text-red-400 font-sans block">{errors.password.message}</span>
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
                      <RefreshCw size={12} className="animate-spin" /> Registering...
                    </>
                  ) : (
                    <>Establish Profile</>
                  )}
                </Button>
              </div>

              {/* Toggle to Login */}
              <div className="text-center pt-1">
                <p className="text-[10px] text-zinc-500 font-sans font-light">
                  Already registered?{" "}
                  <Link
                    href="/login"
                    className="text-gold hover:underline transition-all font-medium font-sans ml-1"
                  >
                    Authenticate here
                  </Link>
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-[8px] text-zinc-500 font-sans uppercase tracking-widest pt-2 border-t border-gold/5">
                <ShieldCheck size={10} className="text-gold/60" /> SECURE IDENTITY INTEGRITY
              </div>
            </form>
          </div>
        </Container>
      </Section>
    </PageWrapper>
  );
}
