import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { PrivateDiningForm } from "@/features/private-dining/components/private-dining-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bespoke Private Dining | AURELIA London",
  description: "Dine at Aurelia's exclusive private rooms including The Chef's Oak Table, The Botanical Glasshouse, and The Vintage Wine Crypt.",
};

const salons = [
  {
    title: "The Chef's Oak Table",
    subtitle: "Culinary Theater",
    description: "An interactive dining salon styled with a massive hand-carved oak table, exposing a view of the prep kitchen. Features a bespoke 9-course tasting menu.",
    capacity: "Up to 12 Guests",
    rate: "£150 per head",
    image: "/private-oak.png",
  },
  {
    title: "The Botanical Glasshouse Room",
    subtitle: "Garden Banquets",
    description: "A tropical glasshouse sanctuary filled with hanging orchids and green foliage. Ideal for large family-style celebratory banquets under the stars.",
    capacity: "Up to 30 Guests",
    rate: "£120 per head",
    image: "/private-glasshouse.png",
  },
  {
    title: "The Vintage Wine Crypt",
    subtitle: "Intimate Vaults",
    description: "Surrounded by thousands of rare vintage reserves behind custom iron gates. Heated stone hearths, candle chandeliers, and a private sommelier.",
    capacity: "Up to 8 Guests",
    rate: "£200 per head",
    image: "/private-crypt.png",
  },
];

export default function PrivateDiningPage() {
  return (
    <PageWrapper>
      {/* Header section */}
      <Section className="relative pt-32 pb-16 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.015)_0%,_black_100%)] border-b border-gold/5">
        <Container className="max-w-2xl mx-auto space-y-4 text-center">
          <Heading subtitle>Exclusive Salons</Heading>
          <Heading as="h1" accent className="tracking-wide">
            Private Dining
          </Heading>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed font-light">
            Orchestrate your bespoke dining arrangements in our secure architectural vaults. From interactive sommelier matches to private family banquets, we design every coordinate.
          </p>
        </Container>
      </Section>

      {/* Salon listings */}
      <Section className="py-20 bg-black">
        <Container className="space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {salons.map((sal, index) => (
              <article key={sal.title} className="group relative border border-gold/10 bg-charcoal/40 rounded-sm overflow-hidden gold-border-glow shadow-elevation flex flex-col justify-between">
                <div className="absolute inset-1.5 border border-gold/5 pointer-events-none z-10" />

                <div className="space-y-4">
                  {/* Photo wrapper */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
                    <Image
                      src={sal.image}
                      alt={sal.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 350px"
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      priority={index === 0}
                      loading={index === 0 ? undefined : "lazy"}
                    />
                  </div>

                  {/* Descriptions */}
                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[8px] uppercase tracking-widest text-gold font-sans font-medium block">
                        {sal.subtitle}
                      </span>
                      <Heading as="h3" className="text-base sm:text-lg font-light mt-0.5 tracking-wide">
                        {sal.title}
                      </Heading>
                    </div>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed font-light">
                      {sal.description}
                    </p>
                  </div>
                </div>

                {/* Specs and rates */}
                <div className="p-5 pt-0 border-t border-gold/5 mt-4 space-y-3">
                  <div className="flex justify-between items-center text-[10px] text-zinc-300 font-sans font-light">
                    <span>Capacity: {sal.capacity}</span>
                    <span className="text-gold font-medium">{sal.rate}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* Interactive Seating Form */}
      <Section className="pb-24 pt-10 border-t border-gold/5 bg-[radial-gradient(circle_at_bottom,_rgba(212,175,55,0.015)_0%,_black_100%)]">
        <Container className="text-center space-y-12">
          <div className="max-w-xl mx-auto space-y-2">
            <Heading subtitle>Select Dining Vault</Heading>
            <h2 className="text-xl sm:text-2xl font-serif text-zinc-100 font-light tracking-wide">
              Request Private Salon Booking
            </h2>
            <p className="text-xs text-zinc-400 font-sans font-light leading-relaxed">
              Verify guest credentials and private configurations below to check room availabilities.
            </p>
          </div>

          <PrivateDiningForm />
        </Container>
      </Section>
    </PageWrapper>
  );
}
