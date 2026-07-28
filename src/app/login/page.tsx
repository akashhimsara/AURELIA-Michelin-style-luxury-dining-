"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, RefreshCw, KeyRound, Mail, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { loginSchema, LoginInput } from "@/features/auth/schema";
import { loginGuest } from "@/features/auth/actions";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    setError(null);
    startTransition(async () => {
      const result = await loginGuest(data);
      if (!result.success) {
        setError(result.message || "Failed to log in.");
      } else {
        router.push("/");
        router.refresh();
      }
    });
  };

  return (
    <PageWrapper>
      <Section className="flex-1 flex items-center justify-center pt-20 pb-24 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.015)_0%,_black_100%)]">
        <Container className="max-w-md mx-auto">
          <div className="w-full p-6 sm:p-8 border border-gold/10 bg-charcoal/40 rounded-sm shadow-elevation relative luxury-glass">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
            <div className="absolute inset-2 border border-gold/5 pointer-events-none z-10" />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-20 text-left">
              <div className="text-center space-y-1.5 mb-6">
                <Heading subtitle>Exclusive Access</Heading>
                <Heading as="h1" accent className="tracking-wide text-2xl sm:text-3xl">
                  Guest Registry
                </Heading>
                <p className="text-xs text-zinc-400 font-sans font-light leading-relaxed">
                  Authenticate credentials to manage bespoke reservations and coordinate luxury services.
                </p>
              </div>

              {error && (
                <div className="p-3 border border-red-500/20 bg-red-950/20 text-red-400 text-xs font-sans text-center rounded-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
                    Email Address
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

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-[9px] uppercase tracking-widest text-zinc-500 hover:text-gold transition-colors font-sans"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                      <KeyRound size={12} />
                    </span>
                    <input
                      id="password"
                      type="password"
                      required
                      className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none pl-8 pr-2.5 py-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
                      placeholder="••••••••"
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
                      <RefreshCw size={12} className="animate-spin" /> Authenticating...
                    </>
                  ) : (
                    <>
                      <LogIn size={12} /> Authenticate
                    </>
                  )}
                </Button>
              </div>

              {/* Toggle to Register */}
              <div className="text-center pt-2">
                <p className="text-[10px] text-zinc-500 font-sans font-light">
                  New to AURELIA?{" "}
                  <Link
                    href="/register"
                    className="text-gold hover:underline transition-all font-medium font-sans ml-1"
                  >
                    Create Guest Account
                  </Link>
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-[8px] text-zinc-500 font-sans uppercase tracking-widest pt-2 border-t border-gold/5">
                <ShieldCheck size={10} className="text-gold/60" /> Encrypted Vault Protection
              </div>
            </form>
          </div>
        </Container>
      </Section>
    </PageWrapper>
  );
}
