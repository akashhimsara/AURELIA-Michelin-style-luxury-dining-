import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { SpaBookingForm } from "@/features/spa/components/spa-booking-form";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Sanctuary Spa & Wellness | AURELIA London",
  description: "Rejuvenate at Aurelia with bespoke hot stone therapies, gold leaf facials, and organic body wraps.",
};

export default async function SpaPage() {
  let dbTherapies = await db.spa.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Lazy-seed default treatments if empty to ensure out-of-the-box luxury styling
  if (dbTherapies.length === 0) {
    const defaultSpaItems = [
      {
        name: "Himalayan Salt Stone Massage",
        duration: "90 Mins",
        price: 180.00,
        description: "Deep thermal pressure therapy using hand-carved organic salt stones to release tension and enrich skin with 84 essential minerals.",
        imageUrl: "/spa-massage.png",
      },
      {
        name: "Gold Leaf Facial Regenerator",
        duration: "60 Mins",
        price: 240.00,
        description: "Micro-massage lymphatic drainage followed by the application of authentic 24k gold leaves to restore skin elasticity and natural radiance.",
        imageUrl: "/spa-facial.png",
      },
      {
        name: "Organic Seaweed Body Wrap",
        duration: "75 Mins",
        price: 150.00,
        description: "A full-body mineral wrap of wild-harvested Atlantic seaweed to draw impurities, improve circulation, and lock in deep hydration.",
        imageUrl: "/spa-detox.png",
      },
    ];

    // Use thread-safe upserts to write default catalog entries
    for (const item of defaultSpaItems) {
      await db.spa.upsert({
        where: { name: item.name },
        update: {},
        create: {
          name: item.name,
          duration: item.duration,
          price: item.price,
          description: item.description,
          imageUrl: item.imageUrl,
        },
      });
    }

    dbTherapies = await db.spa.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  const mappedTherapies = dbTherapies.map((tp) => ({
    id: tp.id,
    name: tp.name,
    duration: tp.duration,
    price: Number(tp.price),
    description: tp.description,
    imageUrl: tp.imageUrl || "/spa-massage.png",
  }));

  return (
    <PageWrapper>
      {/* Header section */}
      <Section className="relative pt-32 pb-16 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.015)_0%,_black_100%)] border-b border-gold/5">
        <Container className="max-w-2xl mx-auto space-y-4 text-center">
          <Heading subtitle>Sanctuary Coordinates</Heading>
          <Heading as="h1" accent className="tracking-wide">
            Spa & Wellness
          </Heading>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed font-light">
            Erase temporal noise inside our sound-isolated thermal cabins. Our licensed practitioners customize botanical treatments to reset sensory alignment.
          </p>
        </Container>
      </Section>

      {/* Therapy listings */}
      <Section className="py-20 bg-black">
        <Container className="space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {mappedTherapies.map((tp) => (
              <article key={tp.id} className="group relative border border-gold/10 bg-charcoal/40 rounded-sm overflow-hidden gold-border-glow shadow-elevation flex flex-col justify-between">
                <div className="absolute inset-1.5 border border-gold/5 pointer-events-none z-10" />

                <div className="space-y-4">
                  {/* Photo wrapper */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
                    <Image
                      src={tp.imageUrl}
                      alt={tp.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 350px"
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Descriptions */}
                  <div className="p-5 space-y-3">
                    <div>
                      <Heading as="h3" className="text-base sm:text-lg font-light mt-0.5 tracking-wide">
                        {tp.name}
                      </Heading>
                    </div>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed font-light">
                      {tp.description}
                    </p>
                  </div>
                </div>

                {/* Specs and rates */}
                <div className="p-5 pt-0 border-t border-gold/5 mt-4 space-y-3">
                  <div className="flex justify-between items-center text-[10px] text-zinc-300 font-sans font-light">
                    <span>Duration: {tp.duration}</span>
                    <span className="text-gold font-medium">&pound;{tp.price.toFixed(2)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* Interactive Spa Request Form */}
      <Section className="pb-24 pt-10 border-t border-gold/5 bg-[radial-gradient(circle_at_bottom,_rgba(212,175,55,0.015)_0%,_black_100%)]">
        <Container className="text-center space-y-12">
          <div className="max-w-xl mx-auto space-y-2">
            <Heading subtitle>Reserve Therapy Session</Heading>
            <h2 className="text-xl sm:text-2xl font-serif text-zinc-100 font-light tracking-wide">
              Request Spa Booking
            </h2>
            <p className="text-xs text-zinc-400 font-sans font-light leading-relaxed">
              Fill in guest credentials below. Wellness coordinators verify calendar slot allocations and dispatch confirmation codes.
            </p>
          </div>

          <SpaBookingForm therapies={mappedTherapies} />
        </Container>
      </Section>
    </PageWrapper>
  );
}
