"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function approveReservation(id: string) {
  try {
    const reservation = await db.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      return { success: false, message: "Reservation record not found." };
    }

    await db.reservation.update({
      where: { id },
      data: {
        status: "confirmed",
      },
    });

    // Revalidate paths for real-time updates
    revalidatePath("/admin");
    revalidatePath("/admin/reservations");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/reservations");

    return { success: true };
  } catch (error) {
    console.error("Approve reservation error:", error);
    return { success: false, message: "Failed to approve reservation." };
  }
}

export async function cancelReservation(id: string) {
  try {
    const reservation = await db.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      return { success: false, message: "Reservation record not found." };
    }

    await db.reservation.update({
      where: { id },
      data: {
        status: "cancelled",
      },
    });

    // Revalidate paths for real-time updates
    revalidatePath("/admin");
    revalidatePath("/admin/reservations");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/reservations");

    return { success: true };
  } catch (error) {
    console.error("Cancel reservation error:", error);
    return { success: false, message: "Failed to cancel reservation." };
  }
}
