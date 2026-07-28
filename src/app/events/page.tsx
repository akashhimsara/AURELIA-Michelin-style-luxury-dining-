import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { EventInquiryForm } from "@/features/events/components/event-inquiry-form";

export const metadata: Metadata = {
  title: "Bespoke Events & Weddings | AURELIA London",
  description: "Arrange exclusive wedding ceremonies, corporate galas, and botanical glasshouse banquets.",
};

import { db } from "@/lib/db";

async function getEvents() {
  const fallbackPackages = [
    {
      title: "Imperial Pavilion Ceremony",
      subtitle: "Luxury Weddings",
      description: "An open-air garden sanctuary featuring manicured flower borders, white drapes, and customized floral arches. Perfect for grand union celebrations.",
      capacity: "50 - 300 Guests",
      rate: "From £12,000",
      image: "/event-wedding.png",
    },
    {
      title: "Grand Ballroom Seminar",
      subtitle: "Corporate Events",
      description: "A spacious formal hall featuring modern gold and charcoal panel accents, laser projection fixtures, and fine catering options for executive seminars.",
      capacity: "20 - 500 Guests",
      rate: "From £8,000",
      image: "/event-corporate.png",
    },
    {
      title: "Glasshouse Canopy Banquet",
      subtitle: "Private Celebrations",
      description: "An intimate dining hall nested in tropical glass domes. Surrounded by exotic orchids and suspended ferns, illuminated by soft tea candles.",
      capacity: "10 - 100 Guests",
      rate: "From £4,000",
      image: "/event-private.png",
    },
  ];

  try {
    let events = await db.event.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (events.length === 0) {
      let restaurant = await db.restaurant.findFirst();
      if (!restaurant) {
        restaurant = await db.restaurant.create({
          data: {
            name: "AURELIA London",
            address: "15 Bruton Place, Mayfair, London W1J 6NP",
            phone: "+44 20 7123 4567",
            email: "london@aurelia-dining.com",
          },
        });
      }

      await db.event.createMany({
        data: [
          {
            title: "Imperial Pavilion Ceremony",
            description: "An open-air garden sanctuary featuring manicured flower borders, white drapes, and customized floral arches. Perfect for grand union celebrations.",
            capacity: 300,
            price: 12000,
            date: new Date(),
            imageUrl: "/event-wedding.png",
            restaurantId: restaurant.id,
          },
          {
            title: "Grand Ballroom Seminar",
            description: "A spacious formal hall featuring modern gold and charcoal panel accents, laser projection fixtures, and fine catering options for executive seminars.",
            capacity: 500,
            price: 8000,
            date: new Date(),
            imageUrl: "/event-corporate.png",
            restaurantId: restaurant.id,
          },
          {
            title: "Glasshouse Canopy Banquet",
            description: "An intimate dining hall nested in tropical glass domes. Surrounded by exotic orchids and suspended ferns, illuminated by soft tea candles.",
            capacity: 100,
            price: 4000,
            date: new Date(),
            imageUrl: "/event-private.png",
            restaurantId: restaurant.id,
          },
        ],
      });

      events = await db.event.findMany({
        orderBy: { createdAt: "desc" },
      });
    }

    return events.map((ev) => {
      let subtitle = "Special Celebration";
      if (ev.title.toLowerCase().includes("wedding") || ev.title.toLowerCase().includes("ceremony") || ev.capacity === 300) {
        subtitle = "Luxury Weddings";
      } else if (ev.title.toLowerCase().includes("corporate") || ev.title.toLowerCase().includes("seminar") || ev.capacity === 500) {
        subtitle = "Corporate Events";
      } else if (ev.title.toLowerCase().includes("private") || ev.title.toLowerCase().includes("banquet") || ev.capacity === 100) {
        subtitle = "Private Celebrations";
      }

      return {
        title: ev.title,
        subtitle,
        description: ev.description,
        capacity: ev.capacity <= 100 ? `10 - ${ev.capacity} Guests` : ev.capacity <= 300 ? `50 - ${ev.capacity} Guests` : `20 - ${ev.capacity} Guests`,
        rate: `From £${Number(ev.price).toLocaleString()}`,
        image: ev.imageUrl,
      };
    });
  } catch (error) {
    console.warn("Database connection issue in events/page.tsx. Falling back to default packages.", error);
    return fallbackPackages;
  }
}

export default async function EventsPage() {
  const packages = await getEvents();
  return (
    <PageWrapper>
      {/* Header section */}
      <Section className="relative pt-32 pb-16 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.015)_0%,_black_100%)] border-b border-gold/5">
        <Container className="max-w-2xl mx-auto space-y-4 text-center">
          <Heading subtitle>Bespoke Formats</Heading>
          <Heading as="h1" accent className="tracking-wide">
            Events & Weddings
          </Heading>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed font-light">
            Host your landmark gatherings in our architectural sanctuaries. From sunset weddings to corporate symposiums, our dedicated teams design every parameter.
          </p>
        </Container>
      </Section>

      {/* Package listings */}
      <Section className="py-20 bg-black">
        <Container className="space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <article key={pkg.title} className="group relative border border-gold/10 bg-charcoal/40 rounded-sm overflow-hidden gold-border-glow shadow-elevation flex flex-col justify-between">
                {/* Decorative borders */}
                <div className="absolute inset-1.5 border border-gold/5 pointer-events-none z-10" />

                <div className="space-y-4">
                  {/* Photo wrapper */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
                    <Image
                      src={pkg.image}
                      alt={pkg.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 350px"
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      priority={pkg.title.includes("Imperial")}
                      loading={pkg.title.includes("Imperial") ? undefined : "lazy"}
                    />
                  </div>

                  {/* Descriptions */}
                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[8px] uppercase tracking-widest text-gold font-sans font-medium block">
                        {pkg.subtitle}
                      </span>
                      <Heading as="h3" className="text-base sm:text-lg font-light mt-0.5 tracking-wide">
                        {pkg.title}
                      </Heading>
                    </div>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed font-light">
                      {pkg.description}
                    </p>
                  </div>
                </div>

                {/* Specs and rates */}
                <div className="p-5 pt-0 border-t border-gold/5 mt-4 space-y-3">
                  <div className="flex justify-between items-center text-[10px] text-zinc-300 font-sans font-light">
                    <span>Capacity: {pkg.capacity}</span>
                    <span className="text-gold font-medium">{pkg.rate}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* Interactive Inquiry Form */}
      <Section className="pb-24 pt-10 border-t border-gold/5 bg-[radial-gradient(circle_at_bottom,_rgba(212,175,55,0.015)_0%,_black_100%)]">
        <Container className="text-center space-y-12">
          <div className="max-w-xl mx-auto space-y-2">
            <Heading subtitle>Reserve Venue Coordinates</Heading>
            <h2 className="text-xl sm:text-2xl font-serif text-zinc-100 font-light tracking-wide">
              Submit Event Inquiry
            </h2>
            <p className="text-xs text-zinc-400 font-sans font-light leading-relaxed">
              Input details below to verify date blockings and receive custom catering rate quotes.
            </p>
          </div>

          <EventInquiryForm />
        </Container>
      </Section>
    </PageWrapper>
  );
}
