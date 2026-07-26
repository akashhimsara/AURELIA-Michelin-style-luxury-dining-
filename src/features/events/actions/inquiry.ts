"use server";

import { db } from "@/lib/db";
import { eventInquirySchema, EventInquiryInput } from "../schema";

export async function createEventInquiry(data: EventInquiryInput) {
  const validated = eventInquirySchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, eventType, guests, date, message } = validated.data;

  try {
    const formattedSubject = `Event Inquiry: ${eventType.toUpperCase()} (${guests} Guests) - Date: ${date}`;
    const formattedMessage = `Phone: ${phone}\nPreferred Date: ${date}\nExpected Guests: ${guests}\n\nRequirements:\n${message}`;

    // Store inside Message database schema
    const inquiry = await db.message.create({
      data: {
        name,
        email,
        subject: formattedSubject,
        message: formattedMessage,
        status: "unread",
      },
    });

    console.log(`
============================================================
[MOCK MAIL SERVICE] Dispatched Event Inquiry Alert
To: event-relations@aurelia.com
From: ${email}
Subject: NEW ${eventType.toUpperCase()} INQUIRY - Ref: ${inquiry.id.slice(0, 8).toUpperCase()}
------------------------------------------------------------
New Event Request Received:
Guest: ${name}
Phone: ${phone}
Event Type: ${eventType}
Expected Party Size: ${guests} guests
Target Schedule: ${date}

Message detail:
${message}
============================================================
    `);

    return {
      success: true,
      inquiry: {
        id: inquiry.id,
        name: inquiry.name,
      },
    };
  } catch (error) {
    console.error("Inquiry creation database write error:", error);
    return {
      success: false,
      message: "Could not record inquiry. Please verify inputs.",
    };
  }
}
