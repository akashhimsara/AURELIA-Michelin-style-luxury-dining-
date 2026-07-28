"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

export async function createEvent(data: {
  title: string;
  description: string;
  dateStr: string;
  price: number;
  capacity: number;
  imageUrl: string;
}) {
  try {
    // Resolve restaurant first
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

    const parsedDate = new Date(data.dateStr);
    if (isNaN(parsedDate.getTime())) {
      return { error: "Please enter a valid launch/target date." };
    }

    await db.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: parsedDate,
        price: new Prisma.Decimal(data.price),
        capacity: data.capacity,
        imageUrl: data.imageUrl,
        restaurantId: restaurant.id,
      },
    });

    revalidatePath("/admin/events");
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    console.error("Failed to create event package:", error);
    return { error: "Failed to create event package. Title must be unique." };
  }
}

export async function deleteEvent(id: string) {
  try {
    await db.event.delete({
      where: { id },
    });
    revalidatePath("/admin/events");
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete event package:", error);
    return { error: "Failed to delete event package." };
  }
}
