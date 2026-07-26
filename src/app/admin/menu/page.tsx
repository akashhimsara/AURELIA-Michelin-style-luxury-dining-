import React from "react";
import type { Metadata } from "next";
import { Heading } from "@/components/ui/heading";
import { db } from "@/lib/db";
import { MenuForm } from "@/features/admin/components/menu-form";
import { MenuList } from "@/features/admin/components/menu-list";

export const metadata: Metadata = {
  title: "Manage Menu | AURELIA Console",
  description: "Create, inspect, and delete catalog items from your menu.",
};

export default async function AdminMenuPage() {
  let menuItems = await db.menu.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Seed signature menu items on initial load to ensure a gorgeous out-of-the-box experience
  if (menuItems.length === 0) {
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

    menuItems = await db.menu.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  const mappedItems = menuItems.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    price: item.price.toFixed(2),
  }));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <Heading subtitle>Operational Management</Heading>
        <Heading as="h1" accent className="tracking-wide">
          Menu Catalog Manager
        </Heading>
        <p className="text-xs text-zinc-500 font-sans mt-1">
          Add new culinary dishes, set seasonal rates, and manage the current tasting catalog.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Creation form */}
        <div className="xl:col-span-1">
          <MenuForm />
        </div>

        {/* Dynamic lists */}
        <div className="xl:col-span-2">
          <MenuList items={mappedItems} />
        </div>
      </div>
    </div>
  );
}
