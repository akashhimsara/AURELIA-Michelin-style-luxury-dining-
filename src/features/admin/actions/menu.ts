"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

export async function createMenuItem(data: {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tags: string[];
}) {
  try {
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

    await db.menu.create({
      data: {
        name: data.name,
        description: data.description,
        price: new Prisma.Decimal(data.price),
        category: data.category,
        image: data.image,
        tags: data.tags,
        restaurantId: restaurant.id,
      },
    });

    revalidatePath("/admin/menu");
    return { success: true };
  } catch (error) {
    console.error("Failed to create menu item:", error);
    return { error: "Failed to create menu item." };
  }
}

export async function deleteMenuItem(id: string) {
  try {
    await db.menu.delete({
      where: { id },
    });
    revalidatePath("/admin/menu");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete menu item:", error);
    return { error: "Failed to delete menu item." };
  }
}
