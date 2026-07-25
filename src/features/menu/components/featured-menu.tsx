import React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { AnimationWrapper } from "@/components/ui/animation-wrapper";
import { MenuCard, MenuItem } from "./menu-card";

const FEATURED_DISHES: MenuItem[] = [
  {
    id: "dish-1",
    name: "Forest Chanterelles",
    description: "Pan-roasted wild chanterelle mushrooms, local pine oil infusion, and smoked emulsion served over warm chestnut purée.",
    price: 26,
    tags: ["Appetizer", "Foraged"],
    image: "/menu-chanterelles.png",
  },
  {
    id: "dish-2",
    name: "Atlantic Halibut",
    description: "Dry-aged white halibut steak, finished with oscietra caviar cream sauce, samphire spikes, and pressed sea herbs.",
    price: 48,
    tags: ["Main Course", "Signature"],
    image: "/menu-halibut.png",
  },
  {
    id: "dish-3",
    name: "Saffron Honey Pear",
    description: "Slow-poached autumn pear in saffron nectar, gold leaf garnish, served with whipped Madagascar vanilla bean custard.",
    price: 18,
    tags: ["Dessert", "Heritage"],
    image: "/menu-pear.png",
  },
];

export function FeaturedMenu() {
  return (
    <Section id="menu" padding="md" className="bg-black border-t border-gold/5 relative overflow-hidden">
      {/* Ambient background gold leaf leak */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold/2 rounded-full blur-[120px] pointer-events-none translate-y-1/3 translate-x-1/3" />

      <Container className="space-y-16">
        {/* Header Block */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <AnimationWrapper delay={0.1}>
            <Heading subtitle>Curated Selections</Heading>
          </AnimationWrapper>
          <AnimationWrapper delay={0.2}>
            <Heading as="h2" accent className="tracking-wide">
              The Autumn Tasting Catalog
            </Heading>
          </AnimationWrapper>
          <AnimationWrapper delay={0.3}>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed font-light">
              An introductory preview of our seasonal composition. Sourced sustainably, executed with architectural precision.
            </p>
          </AnimationWrapper>
        </div>

        {/* Dynamic Grid Mapping */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_DISHES.map((dish, index) => (
            <AnimationWrapper key={dish.id} delay={0.2 + index * 0.15}>
              <MenuCard item={dish} />
            </AnimationWrapper>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="text-center pt-4">
          <AnimationWrapper delay={0.7}>
            <Button variant="primary">
              Reserve Your Seating
            </Button>
          </AnimationWrapper>
        </div>
      </Container>
    </Section>
  );
}
