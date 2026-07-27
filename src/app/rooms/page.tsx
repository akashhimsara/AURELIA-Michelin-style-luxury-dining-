import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { BookingWidget } from "@/features/accommodation/components/booking-widget";
import { RoomCard } from "@/features/accommodation/components/room-card";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Accommodation | AURELIA London",
  description: "Experience absolute architectural luxury and bespoke guest suites.",
};

export default async function RoomsPage({
  searchParams,
}: {
  searchParams: Promise<{
    checkin?: string;
    checkout?: string;
    guests?: string;
    promo?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const { checkin, checkout, guests } = resolvedParams;

  const guestsCount = guests ? parseInt(guests) : 2;

  // Query database suites matching capacity constraints
  let rooms = await db.room.findMany({
    where: {
      capacity: { gte: guestsCount },
    },
    include: {
      facilities: true,
    },
  });

  // Automatically seed catalog on initial hit if empty (thread-safe upserts)
  if (rooms.length === 0) {
    const butler = await db.facility.upsert({
      where: { name: "Private Butler Service" },
      update: {},
      create: { name: "Private Butler Service", description: "24/7 bespoke guest support" },
    });

    const pool = await db.facility.upsert({
      where: { name: "Private Infinity Pool" },
      update: {},
      create: { name: "Private Infinity Pool", description: "Heated swimming waters with ocean line sights" },
    });

    const spa = await db.facility.upsert({
      where: { name: "Spa Bathroom" },
      update: {},
      create: { name: "Spa Bathroom", description: "Marble finishes and steam showers" },
    });

    // Create suites
    await db.room.upsert({
      where: { name: "Ocean Presidential Villa" },
      update: {},
      create: {
        name: "Ocean Presidential Villa",
        description: "A masterwork of architectural luxury. Features floor-to-ceiling glass panes facing coastal horizons, private deck lounges, and a dedicated butler team.",
        pricePerNight: 850.00,
        capacity: 4,
        imageUrl: "/room-ocean.png",
        facilities: { connect: [{ id: butler.id }, { id: pool.id }, { id: spa.id }] },
      },
    });

    await db.room.upsert({
      where: { name: "Mayfair Penthouse Suite" },
      update: {},
      create: {
        name: "Mayfair Penthouse Suite",
        description: "Our signature urban retreat. Comprises generous lounge quadrants, a copper soaking bath, and access to private heliport transfer pads.",
        pricePerNight: 1200.00,
        capacity: 6,
        imageUrl: "/room-penthouse.png",
        facilities: { connect: [{ id: butler.id }, { id: spa.id }] },
      },
    });

    await db.room.upsert({
      where: { name: "Deluxe Heritage Chamber" },
      update: {},
      create: {
        name: "Deluxe Heritage Chamber",
        description: "Classic styling coupled with contemporary utilities. Intimate seating alcoves, bespoke oak writing desks, and curated art accents.",
        pricePerNight: 450.00,
        capacity: 2,
        imageUrl: "/room-heritage.png",
        facilities: { connect: [{ id: spa.id }] },
      },
    });

    rooms = await db.room.findMany({
      where: {
        capacity: { gte: guestsCount },
      },
      include: {
        facilities: true,
      },
    });
  }

  const mappedRooms = rooms.map((room) => ({
    id: room.id,
    name: room.name,
    description: room.description,
    pricePerNight: Number(room.pricePerNight),
    capacity: room.capacity,
    imageUrl: room.imageUrl,
    facilities: room.facilities.map((f) => f.name),
  }));

  return (
    <PageWrapper>
      {/* Header section */}
      <Section className="relative pt-32 pb-16 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.015)_0%,_black_100%)]">
        <Container className="space-y-12 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <Heading subtitle>Sanctuaries of Rest</Heading>
            <Heading as="h1" accent className="tracking-wide">
              Luxury Accommodations
            </Heading>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed font-light">
              Immerse yourself in our premium sanctuaries, designed for absolute comfort and privacy. Select an arrangement to verify check-in requirements.
            </p>
          </div>

          {/* Booking search console widget */}
          <div className="pt-4">
            <BookingWidget />
          </div>
        </Container>
      </Section>

      {/* Catalog items */}
      <Section className="pb-24">
        <Container>
          {mappedRooms.length === 0 ? (
            <div className="text-center py-20 border border-gold/10 bg-charcoal/20 rounded-sm">
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-sans block">
                No Available Accommodations
              </span>
              <p className="text-[10px] text-zinc-600 mt-2 font-light">
                Try reducing your guest party counters or searching alternative schedules.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {mappedRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  checkin={checkin}
                  checkout={checkout}
                />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </PageWrapper>
  );
}
