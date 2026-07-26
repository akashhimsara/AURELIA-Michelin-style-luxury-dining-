"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function updateReservationStatus(id: string, status: string) {
  try {
    await db.reservation.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/reservations");
    return { success: true };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { error: "Failed to update reservation status." };
  }
}

export async function deleteReservation(id: string) {
  try {
    await db.reservation.delete({
      where: { id },
    });
    revalidatePath("/admin/reservations");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete reservation:", error);
    return { error: "Failed to delete reservation." };
  }
}
