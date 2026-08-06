"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, CreditCard, Lock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { processMockPayment } from "@/features/booking/actions";

interface PaymentFormProps {
  reservationId: string;
  amount: number;
}

export function PaymentForm({ reservationId, amount }: PaymentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Helper formatting for credit card inputs
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardExpiry(formatExpiry(e.target.value));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^0-9]/gi, "").slice(0, 4);
    setCardCvv(v);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || cardNumber.length < 15 || cardExpiry.length < 5 || cardCvv.length < 3) {
      setError("Please fill in valid credit card credentials.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await processMockPayment(reservationId);
      if (result.success) {
        // Redirect back to guest dashboard showing success
        router.push("/dashboard/reservations?status=success");
        router.refresh();
      } else {
        setError(result.message || "Failed to process card billing payment.");
      }
    });
  };

  return (
    <div className="w-full p-6 sm:p-8 border border-gold/15 bg-charcoal/40 rounded-sm shadow-elevation relative luxury-glass text-left">
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute inset-2 border border-gold/5 pointer-events-none z-10" />

      <form onSubmit={onSubmit} className="space-y-6 relative z-20">
        <div className="text-center space-y-1">
          <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-sans block">Settlement Gateway</span>
          <Heading as="h3" accent className="text-base sm:text-lg font-sans tracking-wide">
            Card Settlement
          </Heading>
        </div>

        {error && (
          <div className="p-3 border border-red-500/20 bg-red-950/20 text-red-400 text-xs font-sans text-center rounded-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Cardholder Name */}
          <div className="space-y-1.5">
            <label htmlFor="card-name" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
              Cardholder Name
            </label>
            <input
              id="card-name"
              type="text"
              required
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full bg-black/60 border border-gold/15 focus:border-gold outline-none p-3 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
              placeholder="Lord Sterling"
            />
          </div>

          {/* Card Number */}
          <div className="space-y-1.5">
            <label htmlFor="card-number" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
              Card Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                <CreditCard size={12} />
              </span>
              <input
                id="card-number"
                type="text"
                required
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
                className="w-full bg-black/60 border border-gold/15 focus:border-gold outline-none pl-8 pr-3 py-3 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
                placeholder="4111 2222 3333 4444"
              />
            </div>
          </div>

          {/* Expiry & CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="card-expiry" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
                Expiry Date
              </label>
              <input
                id="card-expiry"
                type="text"
                required
                value={cardExpiry}
                onChange={handleExpiryChange}
                maxLength={5}
                className="w-full bg-black/60 border border-gold/15 focus:border-gold outline-none p-3 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300 text-center"
                placeholder="MM/YY"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="card-cvv" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
                CVV Code
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
                  <Lock size={12} />
                </span>
                <input
                  id="card-cvv"
                  type="password"
                  required
                  value={cardCvv}
                  onChange={handleCvvChange}
                  maxLength={4}
                  className="w-full bg-black/60 border border-gold/15 focus:border-gold outline-none pl-8 pr-3 py-3 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300 text-center"
                  placeholder="•••"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full flex items-center justify-center gap-1.5 text-xs py-3 cursor-pointer"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <RefreshCw size={12} className="animate-spin" /> Authorizing...
              </>
            ) : (
              <>Authorize Card Settlement</>
            )}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-[8px] text-zinc-500 font-sans uppercase tracking-widest pt-2 border-t border-gold/5">
          <ShieldCheck size={10} className="text-gold/60" /> Encrypted Vault Settlement Protection
        </div>
      </form>
    </div>
  );
}
