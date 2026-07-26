import type { Metadata } from "next";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { BookingForm } from "@/features/booking/components/booking-form";

export const metadata: Metadata = {
  title: "Reserve a Table | AURELIA London",
  description: "Secure an exclusive dining arrangement at AURELIA London.",
};

export default function ReservePage() {
  return (
    <PageWrapper>
      <Section className="flex-1 flex items-center justify-center min-h-[75vh]">
        <Container className="space-y-12">
          {/* Header titles */}
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <Heading subtitle>Seatings & Reservations</Heading>
            <Heading as="h1" accent className="tracking-wide leading-tight">
              Bespoke Seating Arrangement
            </Heading>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed font-light">
              Select your dining coordinates. All reservations are subject to availability and confirmed instantly via secure transactional receipts.
            </p>
          </div>

          {/* Interactive Form Component */}
          <BookingForm />
        </Container>
      </Section>
    </PageWrapper>
  );
}
