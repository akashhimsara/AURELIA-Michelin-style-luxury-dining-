import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { AnimationWrapper } from "@/components/ui/animation-wrapper";
import { db } from "@/lib/db";
import { MenuCard } from "./menu-card";

async function getFeaturedDishes() {
  let dishes = await db.menu.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (dishes.length === 0) {
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

    await db.menu.createMany({
      data: [
        {
          name: "Forest Chanterelles",
          description: "Pan-roasted wild chanterelle mushrooms, local pine oil infusion, and smoked emulsion served over warm chestnut purée.",
          price: 26,
          category: "Appetizer",
          image: "/menu-chanterelles.png",
          tags: ["Appetizer", "Foraged"],
          restaurantId: restaurant.id,
        },
        {
          name: "Atlantic Halibut",
          description: "Dry-aged white halibut steak, finished with oscietra caviar cream sauce, samphire spikes, and pressed sea herbs.",
          price: 48,
          category: "Main Course",
          image: "/menu-halibut.png",
          tags: ["Main Course", "Signature"],
          restaurantId: restaurant.id,
        },
        {
          name: "Saffron Honey Pear",
          description: "Slow-poached autumn pear in saffron nectar, gold leaf garnish, served with whipped Madagascar vanilla bean custard.",
          price: 18,
          category: "Dessert",
          image: "/menu-pear.png",
          tags: ["Dessert", "Heritage"],
          restaurantId: restaurant.id,
        },
      ],
    });

    dishes = await db.menu.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  return dishes;
}

export async function FeaturedMenu() {
  const dishes = await getFeaturedDishes();
  
  const mappedDishes = dishes.map((dish) => ({
    id: dish.id,
    name: dish.name,
    description: dish.description,
    price: Number(dish.price),
    tags: dish.tags,
    image: dish.image,
  }));

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
          {mappedDishes.map((dish, index) => (
            <AnimationWrapper key={dish.id} delay={0.2 + index * 0.15}>
              <MenuCard item={dish} />
            </AnimationWrapper>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="text-center pt-4">
          <AnimationWrapper delay={0.7}>
            <Link href="/reserve">
              <Button variant="primary">
                Reserve Your Seating
              </Button>
            </Link>
          </AnimationWrapper>
        </div>
      </Container>
    </Section>
  );
}
