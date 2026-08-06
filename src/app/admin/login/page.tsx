"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShieldCheck, RefreshCw, KeyRound, Mail, LogIn } from "lucide-react";
import { loginAdmin } from "@/features/auth/admin-actions";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
      const result = await loginAdmin(data);
      if (!result.success) {
        setError(result.message || "Failed to log in.");
      } else {
        const redirectUrl = searchParams.get("redirect") || "/admin";
        router.push(redirectUrl);
        router.refresh();
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm">
        {/* Wordmark */}
        <div className="text-center mb-10">
          <span className="font-serif text-3xl tracking-[0.25em] text-amber-500 font-semibold">AURELIA</span>
          <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 font-sans mt-2">
            Admin Portal
          </p>
        </div>

        {/* Card */}
        <div className="rounded-sm border border-zinc-800 bg-zinc-900/60 p-8 space-y-5 backdrop-blur-md relative">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1 text-center mb-6">
              <h1 className="text-sm font-semibold font-sans text-zinc-200 tracking-tight">
                Sign in to continue
              </h1>
              <p className="text-xs font-sans text-zinc-500">
                Authorised personnel only
              </p>
            </div>

            {error && (
              <div className="p-3 border border-red-500/20 bg-red-950/20 text-red-400 text-xs font-sans text-center rounded-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="admin-email" className="block text-[10px] uppercase tracking-widest font-sans font-medium text-zinc-400 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                    <Mail size={12} />
                  </span>
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="admin@aurelia.com"
                    className="w-full rounded-sm border border-zinc-800 bg-zinc-900 pl-8 pr-3 py-2 text-xs font-sans text-zinc-200 placeholder-zinc-600 outline-none focus:border-amber-500/40 transition-colors"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <span className="text-[10px] text-red-400 font-sans block">{errors.email.message}</span>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="admin-password" className="block text-[10px] uppercase tracking-widest font-sans font-medium text-zinc-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                    <KeyRound size={12} />
                  </span>
                  <input
                    id="admin-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className="w-full rounded-sm border border-zinc-800 bg-zinc-900 pl-8 pr-3 py-2 text-xs font-sans text-zinc-200 placeholder-zinc-600 outline-none focus:border-amber-500/40 transition-colors"
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <span className="text-[10px] text-red-400 font-sans block">{errors.password.message}</span>
                )}
              </div>
            </div>

            <button
              id="admin-login-btn"
              type="submit"
              disabled={isPending}
              className="w-full mt-2 py-2.5 rounded-sm bg-amber-500 text-zinc-950 text-xs font-semibold font-sans uppercase tracking-widest hover:bg-amber-400 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isPending ? (
                <>
                  <RefreshCw size={12} className="animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  <LogIn size={12} /> Sign In
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[8px] text-zinc-500 font-sans uppercase tracking-widest pt-2 border-t border-zinc-800">
              <ShieldCheck size={10} className="text-amber-500/60" /> Secure Vault Protection
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
