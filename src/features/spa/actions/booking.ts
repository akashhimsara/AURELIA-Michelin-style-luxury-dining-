"use server";

import { db } from "@/lib/db";
import { spaBookingSchema, SpaBookingInput, spaTreatments } from "../schema";

export async function createSpaInquiry(data: SpaBookingInput) {
  const validated = spaBookingSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, treatment, date, time, guests, notes } = validated.data;
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

    const selectedSpa = spaTreatments[treatment];
    const formattedSubject = `Spa Inquiry: ${selectedSpa.name} (${selectedSpa.duration}) - Date: ${date} ${time}`;
    const formattedMessage = `Phone: ${phone}\nTherapy Category: ${selectedSpa.name}\nDuration: ${selectedSpa.duration}\nSeating Slot: ${time}\nExpected Guests: ${guests}\n\nSpecial Notes:\n${notes || "None"}`;

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

    // 3. Create a Reservation log referencing Spa (using restaurantId or roomId null references)
    // We register the spa billing in the reservation table so it correctly contributes to CRM LTV!
    // Since spa doesn't have roomId or restaurantId, we write it with Nulls but set finalAmount!
    // Est Spa Billing = Price * Guests
    const finalAmount = selectedSpa.price * guests;

    await db.reservation.create({
      data: {
        name,
        email: sanitizedEmail,
        phone,
        date: new Date(date),
        time: time,
        guests,
        userId: user.id,
        bookedRoomName: `Spa Treatment: ${selectedSpa.name}`,
        finalAmount: finalAmount,
      },
    });

    console.log(`
============================================================
[MOCK MAIL SERVICE] Dispatched Spa Reservation Alert
To: spa-scheduler@aurelia.com
From: ${email}
Subject: NEW SPA SESSION INQUIRY - Ref: ${inquiry.id.slice(0, 8).toUpperCase()}
------------------------------------------------------------
New Treatment Reservation Request Received:
Guest: ${name}
Phone: ${phone}
Therapy: ${selectedSpa.name} (${selectedSpa.duration})
Guests: ${guests} guests
Schedule Target: ${date} at ${time}
Est. Lodging Spend: £${finalAmount} (LTV Linked)

Notes:
${notes || "None"}
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
    console.error("Spa booking database write error:", error);
    return {
      success: false,
      message: "Could not register spa reservation. Please verify inputs.",
    };
  }
}
