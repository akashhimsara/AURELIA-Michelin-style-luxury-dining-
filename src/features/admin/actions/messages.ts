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

export async function sendInquiryReply(id: string, replyContent: string) {
  try {
    const inquiry = await db.message.findUnique({
      where: { id },
    });

    if (!inquiry) {
      return { error: "Inquiry not found." };
    }

    // Mock dispatch email logs
    console.log(`
============================================================
[MOCK MAIL SERVICE] Sending Concierge Proposal Reply
To: ${inquiry.email}
Subject: Re: ${inquiry.subject} - AURELIA Concierge
------------------------------------------------------------
Dear ${inquiry.name},

Thank you for your inquiry regarding:
"${inquiry.subject}"

Proposal / Response details:
${replyContent}

If you require any further customizations or pricing revisions, please do not hesitate to contact our Mayfair desk directly.

Warmest regards,
The AURELIA Concierge Team
============================================================
    `);

    // Update status to replied in database
    await db.message.update({
      where: { id },
      data: { status: "replied" },
    });

    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to send inquiry reply:", error);
    return { error: "Failed to process concierge proposal." };
  }
}
