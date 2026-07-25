import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { AnimationWrapper } from "@/components/ui/animation-wrapper";

export function About() {
  return (
    <Section id="story" padding="md" className="bg-black border-t border-gold/5 relative overflow-hidden">
      {/* Ambient background gold leaf lighting leak */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-gold/3 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
      
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Brand Story Narrative */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              {/* Category Label */}
              <AnimationWrapper delay={0.2}>
                <Heading subtitle>Our Philosophy</Heading>
              </AnimationWrapper>

              {/* Story Heading */}
              <AnimationWrapper delay={0.4}>
                <Heading as="h2" accent className="tracking-wide">
                  A Sanctuary of Culinary Harmony
                </Heading>
              </AnimationWrapper>
            </div>

            {/* Horizontal thin gold divider line */}
            <AnimationWrapper delay={0.5}>
              <div className="h-[1px] w-20 bg-gradient-to-r from-gold/50 to-transparent" />
            </AnimationWrapper>

            {/* Editorial Story Paragraphs */}
            <div className="space-y-6 text-zinc-400 font-sans text-sm sm:text-base leading-relaxed font-light">
              <AnimationWrapper delay={0.6}>
                <p>
                  At Aurelia, dining is conceptualized as an act of architectural composition. We believe that fine food must speak to both visual geometry and sensory depth, presenting a gallery of tastes designed to tell a historical story.
                </p>
              </AnimationWrapper>

              <AnimationWrapper delay={0.7}>
                <p>
                  Our ingredients are sourced through singular partnerships with organic estates, biodynamic farms, and select coastal foragers. Under the meticulous orchestration of our culinary artisans, these pure elements are transformed into curated tasting experiences that honor the soil they arose from.
                </p>
              </AnimationWrapper>
            </div>

            {/* Story CTA */}
            <AnimationWrapper delay={0.8} className="pt-4">
              <Button variant="outline">
                Explore the Story
              </Button>
            </AnimationWrapper>
          </div>

          {/* Right Column: Culinary Masterpiece Image Showcase */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <AnimationWrapper delay={0.5} className="w-full max-w-[400px] lg:max-w-none">
              {/* Double border luxury photo frame */}
              <div className="relative aspect-[4/5] w-full p-2 border border-gold/10 bg-charcoal/50 rounded-sm overflow-hidden gold-border-glow shadow-elevation">
                {/* Thin gold border spacer line */}
                <div className="absolute inset-2 border border-gold/5 pointer-events-none z-10" />
                
                {/* Next.js optimized image wrapper */}
                <div className="relative w-full h-full overflow-hidden rounded-sm bg-zinc-950">
                  <Image
                    src="/about-dish.png"
                    alt="Premium Michelin-starred dish presentation at Aurelia"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                    className="object-cover transition-transform duration-1000 ease-out hover:scale-105"
                    priority={false}
                  />
                </div>
              </div>
            </AnimationWrapper>
          </div>

        </div>
      </Container>
    </Section>
  );
}
