"use client";

import React, { useActionState } from "react";
import { Lock, Mail, RefreshCw } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { loginAdmin } from "../actions/auth";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdmin, null);

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 border border-gold/15 bg-charcoal/40 rounded-sm shadow-elevation relative luxury-glass">
      {/* Decorative luxury lines */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute inset-2 border border-gold/5 pointer-events-none z-10" />

      <div className="space-y-6 relative z-20">
        {/* Title branding */}
        <div className="text-center space-y-2">
          <Heading subtitle>Secure Access</Heading>
          <Heading as="h2" accent className="tracking-wide">
            AURELIA Console
          </Heading>
          <p className="text-[10px] text-zinc-500 font-sans uppercase tracking-widest leading-relaxed">
            Authorized Personnel Only
          </p>
        </div>

        <form action={formAction} className="space-y-5">
          {/* Error Message */}
          {state?.error && (
            <div className="p-3 border border-red-500/20 bg-red-950/20 text-red-400 text-xs font-sans text-center rounded-sm">
              {state.error}
            </div>
          )}

          {/* Email input field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-[10px] uppercase tracking-widest text-gold font-sans font-medium">
              Administrator Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                <Mail size={14} />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none pl-9 pr-3 py-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
                placeholder="admin@aurelia.com"
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-[10px] uppercase tracking-widest text-gold font-sans font-medium">
              Access Code / Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                <Lock size={14} />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none pl-9 pr-3 py-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          {/* Submit action CTA */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full flex items-center justify-center gap-2"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <RefreshCw size={12} className="animate-spin" /> Verifying Access...
                </>
              ) : (
                <>Sign In</>
              )}
            </Button>
          </div>
        </form>

        {/* Credentials hints for local testing */}
        <div className="border-t border-gold/5 pt-4 text-center">
          <p className="text-[9px] text-zinc-500 font-sans leading-relaxed">
            Demo Credentials:<br />
            Email: <span className="text-gold">admin@aurelia.com</span> | Password: <span className="text-gold">password123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
