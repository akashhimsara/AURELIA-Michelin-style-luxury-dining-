import React from "react";
import type { Metadata } from "next";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { PaymentForm } from "./payment-form";

export const metadata: Metadata = {
  title: "Secure Settlement Gateway | AURELIA London",
  description: "Secure payment arrangement authorization.",
};

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{
    reservationId?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const { reservationId } = resolvedParams;

  if (!reservationId) {
    redirect("/reserve");
  }

  const reservation = await db.reservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation || !reservation.finalAmount) {
    redirect("/reserve");
  }

  // Calculate pricing values
  const grandTotal = Number(reservation.finalAmount);
  const baseTotal = Number(reservation.roomRateAtBooking || 0);
  const checkInDate = new Date(reservation.date);
  const checkOutDate = reservation.checkOutDate ? new Date(reservation.checkOutDate) : null;

  let nightsCount = 1;
  if (checkOutDate) {
    const ms = checkOutDate.getTime() - checkInDate.getTime();
    nightsCount = Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
  }

  const basePriceTotal = baseTotal * nightsCount;
  const taxesAndService = grandTotal - basePriceTotal;

  return (
    <PageWrapper>
      <Section className="flex-1 flex items-center justify-center pt-28 pb-20 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.01)_0%,_black_100%)]">
        <Container className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left Panel: Invoice details summary */}
          <div className="p-6 border border-gold/10 bg-charcoal/20 rounded-sm relative luxury-glass text-left space-y-6">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
            
            <div className="space-y-1.5">
              <span className="text-[9px] uppercase tracking-widest text-gold font-sans font-medium">Arrangement Receipt</span>
              <Heading as="h2" accent className="text-xl sm:text-2xl tracking-wide">
                Invoice Details
              </Heading>
              <p className="text-[10px] text-zinc-500 font-sans">
                Billing Reference: AUR-{reservation.id.slice(0, 8).toUpperCase()}
              </p>
            </div>

            <div className="h-[1px] bg-gold/10" />

            <div className="space-y-4 font-sans text-xs">
              <div className="flex justify-between items-center text-zinc-400">
                <span>Guest Name:</span>
                <span className="text-zinc-200 font-medium">{reservation.name}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Suite Name:</span>
                <span className="text-zinc-200 font-medium">{reservation.bookedRoomName || "Luxury Suite"}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Check-in Date:</span>
                <span className="text-zinc-200 font-medium">
                  {checkInDate.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              {checkOutDate && (
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Check-out Date:</span>
                  <span className="text-zinc-200 font-medium">
                    {checkOutDate.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-zinc-400">
                <span>Stay Duration:</span>
                <span className="text-zinc-200 font-medium">{nightsCount} {nightsCount === 1 ? "night" : "nights"}</span>
              </div>
            </div>

            <div className="h-[1px] bg-gold/10" />

            {/* Price breakdown */}
            <div className="space-y-2.5 font-sans text-xs">
              <div className="flex justify-between items-center text-zinc-400">
                <span>Stay Rate ({nightsCount} nights):</span>
                <span className="text-zinc-200 font-mono">&pound;{basePriceTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span>Taxes & Service (17%):</span>
                <span className="text-zinc-200 font-mono">&pound;{taxesAndService.toFixed(2)}</span>
              </div>
              <div className="pt-2.5 border-t border-gold/5 flex justify-between items-center text-sm font-medium">
                <span className="text-gold">Total Stay Amount:</span>
                <span className="text-gold font-mono font-semibold">&pound;{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive payment authorization form */}
          <PaymentForm reservationId={reservationId} amount={grandTotal} />

        </Container>
      </Section>
    </PageWrapper>
  );
}
