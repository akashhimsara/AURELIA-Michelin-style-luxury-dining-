import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { AnimationWrapper } from "@/components/ui/animation-wrapper";

export function Hero() {
  return (
    <Section
      padding="none"
      className="relative min-h-[85vh] flex items-center justify-center bg-black overflow-hidden"
    >
      {/* Ambient background gold leaf lighting leaks */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.03)_0%,_transparent_65%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Editorial horizontal borders */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-gold/10 to-transparent" />

      <Container className="relative z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Pre-Heading subtitle */}
          <AnimationWrapper delay={0.2}>
            <Heading subtitle>Aurelia London</Heading>
          </AnimationWrapper>

          {/* Primary Editorial Heading */}
          <AnimationWrapper delay={0.4}>
            <Heading as="h1" accent className="leading-[1.1] tracking-wide">
              Culinary Artistry <br />
              <span className="font-serif italic font-extralight text-zinc-100 tracking-normal">Orchestrated</span> for the Discerning
            </Heading>
          </AnimationWrapper>

          {/* Narrative Paragraph */}
          <AnimationWrapper delay={0.6}>
            <p className="text-zinc-400 font-sans text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed font-light">
              Enter a realm of meticulous gastronomy and sensory elegance. Each seating is a bespoke composition designed to transcend expectation.
            </p>
          </AnimationWrapper>

          {/* Action CTAs */}
          <AnimationWrapper delay={0.8} className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/reserve" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full">
                  Reserve a Table
                </Button>
              </Link>
              <Link href="/#menu" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full">
                  Explore the Menu
                </Button>
              </Link>
            </div>
          </AnimationWrapper>
        </div>

        {/* Scroll Indicator */}
        <AnimationWrapper delay={1.2} className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 hidden sm:block">
          <div className="flex flex-col items-center gap-3">
            <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 font-sans">Scroll</span>
            <div className="w-[1px] h-10 bg-gradient-to-b from-gold/40 to-transparent" />
          </div>
        </AnimationWrapper>
      </Container>
    </Section>
  );
}
