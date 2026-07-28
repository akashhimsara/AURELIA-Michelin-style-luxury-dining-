"use server";

import { db } from "@/lib/db";
import { experienceBookingSchema, ExperienceBookingInput, experiencesCatalog } from "../schema";
import { revalidatePath } from "next/cache";
import { createStripeSessionForReservation } from "@/features/booking/actions";

export async function createExperienceBooking(data: ExperienceBookingInput) {
  const validated = experienceBookingSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, experience, date, time, guests, notes } = validated.data;
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

    const selectedExp = experiencesCatalog[experience];
    const formattedSubject = `Experience Booking: ${selectedExp.name} - Date: ${date} ${time}`;
    const formattedMessage = `Phone: ${phone}\nActivity Target: ${selectedExp.name}\nSeating Slot: ${time}\nExpected Guests: ${guests}\n\nRequests & Notes:\n${notes || "None"}`;

    // 2. Persist inside Message database schema
    const inquiry = await db.message.create({
      data: {
        name,
        email: sanitizedEmail,
        subject: formattedSubject,
        message: formattedMessage,
        status: "unread",
      },
    });

    // 3. Create a Reservation log referencing Experience to contribute to Guest CRM LTV
    const finalAmount = selectedExp.pricePerGuest * guests;

    const reservation = await db.reservation.create({
      data: {
        name,
        email: sanitizedEmail,
        phone,
        date: new Date(date),
        time: time,
        guests,
        userId: user.id,
        bookedRoomName: `Experience: ${selectedExp.name}`,
        finalAmount: finalAmount,
        specialRequests: notes || null,
      },
    });

    // Generate Stripe session URL for card capture
    let checkoutUrl: string | null = null;
    if (finalAmount > 0) {
      const stripeRes = await createStripeSessionForReservation(reservation.id);
      if (stripeRes.success) {
        checkoutUrl = stripeRes.checkoutUrl || null;
      }
    }

    console.log(`
============================================================
[MOCK MAIL SERVICE] Dispatched Experience Booking Alert
To: experience-concierge@aurelia.com
From: ${email}
Subject: NEW EXPERIENCE BOOKING REQUEST - Ref: ${inquiry.id.slice(0, 8).toUpperCase()}
------------------------------------------------------------
New Experience Request Received:
Guest: ${name}
Phone: ${phone}
Experience: ${selectedExp.name}
Guests: ${guests} guests
Schedule Target: ${date} at ${time}
Est. Spend: £${finalAmount} (LTV Linked)

Notes:
${notes || "None"}
============================================================
    `);

    revalidatePath("/dashboard");
    return {
      success: true,
      checkoutUrl,
      reservation: {
        id: reservation.id,
        name: reservation.name,
        date: reservation.date.toISOString(),
        time: reservation.time,
        guests: reservation.guests,
        bookedRoomName: reservation.bookedRoomName,
        finalAmount: Number(reservation.finalAmount),
      },
    };
  } catch (error) {
    console.error("Experience booking database write error:", error);
    return {
      success: false,
      message: "Could not register experience booking. Please verify inputs.",
    };
  }
}
