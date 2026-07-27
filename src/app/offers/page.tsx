import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Percent, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Exclusive Offers & Packages | AURELIA London",
  description: "Browse bespoke seasonal escapes, Michelin dining bundles, and wellness retreats at AURELIA.",
};

export default async function OffersPage() {
  let rooms = [];
  try {
    rooms = await db.room.findMany();
  } catch (error) {
    console.warn("Database connection issue inside offers page.tsx. Falling back to default rooms list.", error);
    rooms = [
      { id: "fallback-penthouse", name: "Mayfair Penthouse Suite" },
      { id: "fallback-heritage", name: "Deluxe Heritage Chamber" },
      { id: "fallback-presidential", name: "Ocean Presidential Villa" },
    ];
  }
  
  // Resolve database room references dynamically
  const penthouse = rooms.find((r) => r.name.includes("Penthouse")) || rooms[0];
  const heritage = rooms.find((r) => r.name.includes("Heritage")) || rooms[0];
  const presidential = rooms.find((r) => r.name.includes("Presidential")) || rooms[0];

  const packages = [
    {
      title: "The Royal Mayfair Escape",
      subtitle: "Exclusive Lodging",
      description: "Indulge in two nights inside our premier Penthouse Suite accompanied by custom breakfast setups and complimentary champagne bottles upon arrival.",
      code: "ROYAL15",
      discount: "15% off accommodation rate",
      targetRoomId: penthouse?.id || "",
    },
    {
      title: "Michelin Gastronomy Weekend",
      subtitle: "Bespoke Dining",
      description: "A one-night stay inside our Deluxe Heritage Chamber combined with a priority tasting menu arrangement for two at The Chef's Oak Table.",
      code: "MICHELIN10",
      discount: "10% off package rates",
      targetRoomId: heritage?.id || "",
    },
    {
      title: "Sanctuary Wellness Retreat",
      subtitle: "Spa & Serenity",
      description: "A two-night relaxation booking inside our Presidential Villa, featuring unlimited access to thermal cabins and a 90m hot stone massage session.",
      code: "SANCTUARY20",
      discount: "20% off villa lodgings",
      targetRoomId: presidential?.id || "",
    },
  ];

  return (
    <PageWrapper>
      {/* Page Header */}
      <Section className="relative pt-32 pb-16 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.015)_0%,_black_100%)] border-b border-gold/5">
        <Container className="max-w-2xl mx-auto space-y-4 text-center">
          <Heading subtitle>Seasonal Bundles</Heading>
          <Heading as="h1" accent className="tracking-wide">
            Exclusive Offers
          </Heading>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed font-light">
            Maximize your sanctuary experiences with custom dining and lodging bundles. Input promo codes during checkout to apply dynamic CRM billing discounts.
          </p>
        </Container>
      </Section>

      {/* Offers Catalog List */}
      <Section className="py-20 bg-black">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <article key={pkg.title} className="group relative border border-gold/10 bg-charcoal/40 p-6 sm:p-8 rounded-sm overflow-hidden gold-border-glow shadow-elevation flex flex-col justify-between space-y-6">
                <div className="absolute inset-1.5 border border-gold/5 pointer-events-none z-10" />

                <div className="space-y-4 relative z-20">
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] uppercase tracking-widest text-gold font-sans font-medium block">
                      {pkg.subtitle}
                    </span>
                    <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-950/40 border border-emerald-500/20">
                      <Percent size={10} /> CODE: {pkg.code}
                    </div>
                  </div>

                  <Heading as="h3" className="text-base sm:text-lg font-light mt-1.5 tracking-wide">
                    {pkg.title}
                  </Heading>

                  <p className="text-xs text-zinc-400 font-sans leading-relaxed font-light">
                    {pkg.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gold/5 mt-4 space-y-4 relative z-20">
                  <div className="text-[10px] text-zinc-300 font-sans font-light flex justify-between items-center">
                    <span>Promotion:</span>
                    <span className="text-gold font-medium">{pkg.discount}</span>
                  </div>

                  <Link href={`/reserve?roomId=${pkg.targetRoomId}&promo=${pkg.code}`}>
                    <Button variant="outline" className="w-full flex items-center justify-center gap-1.5 text-xs py-2">
                      Book Escape Package <ArrowRight size={12} />
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </PageWrapper>
  );
}
