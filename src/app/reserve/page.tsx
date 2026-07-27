import type { Metadata } from "next";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { BookingForm } from "@/features/booking/components/booking-form";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Secure Arrangements | AURELIA London",
  description: "Arrange exclusive table seatings and luxury room accommodations at AURELIA.",
};

export default async function ReservePage({
  searchParams,
}: {
  searchParams: Promise<{
    roomId?: string;
    date?: string;
    promo?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const { roomId, date, promo } = resolvedParams;

  let selectedRoomName: string | null = null;
  let selectedRoomPrice: number | null = null;

  if (roomId) {
    const room = await db.room.findUnique({
      where: { id: roomId },
    });
    if (room) {
      selectedRoomName = room.name;
      selectedRoomPrice = Number(room.pricePerNight);
    }
  }

  return (
    <PageWrapper>
      <Section className="flex-1 flex items-center justify-center min-h-[75vh] pt-28">
        <Container className="space-y-12">
          {/* Header titles */}
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <Heading subtitle>Seatings & Accommodations</Heading>
            <Heading as="h1" accent className="tracking-wide leading-tight">
              {roomId ? "Arrange Your Stay" : "Bespoke Dining Arrangement"}
            </Heading>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed font-light">
              {roomId 
                ? "Verify guest details to finalize your luxury suite arrangement. Bookings are confirmed instantly." 
                : "Select your dining coordinates. All reservations are subject to availability and confirmed instantly."
              }
            </p>
          </div>

          {/* Interactive Form Component */}
          <BookingForm 
            roomId={roomId} 
            selectedRoomName={selectedRoomName} 
            roomPrice={selectedRoomPrice || undefined}
            date={date} 
            promo={promo}
          />
        </Container>
      </Section>
    </PageWrapper>
  );
}
