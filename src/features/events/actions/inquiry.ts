"use server";

import { db } from "@/lib/db";
import { eventInquirySchema, EventInquiryInput, eventLimits } from "../schema";
import { revalidatePath } from "next/cache";

export async function createEventInquiry(data: EventInquiryInput) {
  const validated = eventInquirySchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, eventType, guests, date, message } = validated.data;
  const sanitizedEmail = email.toLowerCase().trim();

  try {
    // 1. CRM Lead Resolution
    let user = await db.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email: sanitizedEmail,
          name,
          phone: phone || null,
        },
      });
    }

    const limit = eventLimits[eventType];
    const formattedSubject = `Event Inquiry: ${eventType.toUpperCase()} (${guests} Guests) - Date: ${date}`;
    const formattedMessage = `Phone: ${phone}\nVenue Pavilion: ${limit.label}\nPreferred Date: ${date}\nExpected Guests: ${guests}\n\nRequirements:\n${message}`;

    // 2. Store inside Message database schema
    const inquiry = await db.message.create({
      data: {
        name,
        email: sanitizedEmail,
        subject: formattedSubject,
        message: formattedMessage,
        status: "unread",
      },
    });

    // 3. Create a Reservation log referencing Event to contribute to Guest CRM LTV
    // Est. Billing = Package base spend
    let finalAmount = 4000;
    if (eventType === "wedding") finalAmount = 12000;
    else if (eventType === "corporate") finalAmount = 8000;

    await db.reservation.create({
      data: {
        name,
        email: sanitizedEmail,
        phone,
        date: new Date(date),
        guests,
        userId: user.id,
        bookedRoomName: `Event: ${limit.label} (${eventType.toUpperCase()})`,
        finalAmount: finalAmount,
        specialRequests: message || null,
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
Venue: ${limit.label}
Expected Party Size: ${guests} guests
Target Schedule: ${date}
Est. Event Spend: £${finalAmount} (LTV Linked)

Message detail:
${message}
============================================================
    `);

    revalidatePath("/dashboard");
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
