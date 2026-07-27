import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { GalleryGrid } from "@/features/gallery/components/gallery-grid";

export const metadata: Metadata = {
  title: "The Editorial Gallery | AURELIA London",
  description: "Browse curated photographic collections of our luxury suites, gastronomy dishes, spa treatments, and ballroom ceremonies.",
};

export default function GalleryPage() {
  return (
    <PageWrapper>
      {/* Editorial Header */}
      <Section className="relative pt-32 pb-16 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.015)_0%,_black_100%)] border-b border-gold/5">
        <Container className="max-w-2xl mx-auto space-y-4 text-center">
          <Heading subtitle>Visual Collections</Heading>
          <Heading as="h1" accent className="tracking-wide">
            The Editorial Gallery
          </Heading>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed font-light">
            Step behind the sensory design elements of AURELIA. Browse authentic snapshots detailing our private garden lawns, poached saffron pear displays, and panoramic pool horizons.
          </p>
        </Container>
      </Section>

      {/* Masonry / Filterable Grid */}
      <Section className="py-20 bg-black">
        <Container>
          <GalleryGrid />
        </Container>
      </Section>
    </PageWrapper>
  );
}
