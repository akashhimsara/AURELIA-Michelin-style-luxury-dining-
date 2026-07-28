import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { InquiryForm } from "@/features/inquiries/components/inquiry-form";

export const metadata: Metadata = {
  title: "Inquiries & Contact | AURELIA London",
  description: "Connect with our guest relations concierge. Submit custom requests, dietary details, or general inquiries.",
};

export default function InquirePage() {
  return (
    <PageWrapper>
      {/* Header Section */}
      <Section className="relative pt-32 pb-16 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.015)_0%,_black_100%)] border-b border-gold/5">
        <Container className="max-w-2xl mx-auto space-y-4 text-center">
          <Heading subtitle>Contact Coordinates</Heading>
          <Heading as="h1" accent className="tracking-wide">
            Guest Inquiries
          </Heading>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed font-light">
            Connect with our dedicated Mayfair concierge team. Whether planning a custom seating configuration, inquiring about suite availability, or specifying dietary coordinates, we design every parameter to your standard.
          </p>
        </Container>
      </Section>

      {/* Form Section */}
      <Section className="py-20 bg-black">
        <Container className="text-center">
          <InquiryForm />
        </Container>
      </Section>
    </PageWrapper>
  );
}
