"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

export async function createRoom(data: {
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  imageUrl: string;
}) {
  try {
    await db.room.create({
      data: {
        name: data.name,
        description: data.description,
        pricePerNight: new Prisma.Decimal(data.pricePerNight),
        capacity: data.capacity,
        imageUrl: data.imageUrl,
      },
    });

    revalidatePath("/admin/rooms");
    revalidatePath("/rooms");
    return { success: true };
  } catch (error) {
    console.error("Failed to create room:", error);
    return { error: "Failed to create room profile. Name must be unique." };
  }
}

export async function deleteRoom(id: string) {
  try {
    await db.room.delete({
      where: { id },
    });
    revalidatePath("/admin/rooms");
    revalidatePath("/rooms");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete room:", error);
    return { error: "Failed to delete room profile." };
  }
}
