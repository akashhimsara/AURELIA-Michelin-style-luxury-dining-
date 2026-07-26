"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function updateMessageStatus(id: string, status: string) {
  try {
    await db.message.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update message status:", error);
    return { error: "Failed to update message status." };
  }
}

export async function deleteMessage(id: string) {
  try {
    await db.message.delete({
      where: { id },
    });
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete message:", error);
    return { error: "Failed to delete message." };
  }
}
