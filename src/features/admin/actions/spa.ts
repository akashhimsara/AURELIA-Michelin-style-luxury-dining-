"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

export async function createSpaTherapy(data: {
  name: string;
  duration: string;
  price: number;
  description: string;
  imageUrl: string;
}) {
  try {
    await db.spa.create({
      data: {
        name: data.name,
        duration: data.duration,
        price: new Prisma.Decimal(data.price),
        description: data.description,
        imageUrl: data.imageUrl,
      },
    });

    revalidatePath("/admin/spa");
    revalidatePath("/spa");
    return { success: true };
  } catch (error) {
    console.error("Failed to create spa therapy:", error);
    return { error: "Failed to create spa therapy. Name must be unique." };
  }
}

export async function deleteSpaTherapy(id: string) {
  try {
    await db.spa.delete({
      where: { id },
    });
    revalidatePath("/admin/spa");
    revalidatePath("/spa");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete spa therapy:", error);
    return { error: "Failed to delete spa therapy." };
  }
}
