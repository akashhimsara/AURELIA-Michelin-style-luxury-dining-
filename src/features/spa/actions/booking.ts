"use server";

import { db } from "@/lib/db";
import { spaBookingSchema, SpaBookingInput } from "../schema";

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
    // 1. Fetch therapy details from the database (dynamic catalog resolution)
    const therapy = await db.spa.findUnique({
      where: { id: treatment },
    });

    if (!therapy) {
      return {
        success: false,
        message: "The requested wellness therapy could not be found in active catalogs.",
      };
    }

    // 2. CRM Lead Resolution
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

    const formattedSubject = `Spa Inquiry: ${therapy.name} (${therapy.duration}) - Date: ${date} ${time}`;
    const formattedMessage = `Phone: ${phone}\nTherapy Category: ${therapy.name}\nDuration: ${therapy.duration}\nSeating Slot: ${time}\nExpected Guests: ${guests}\n\nSpecial Notes:\n${notes || "None"}`;

    // 3. Persist inside Message database schema
    const inquiry = await db.message.create({
      data: {
        name,
        email: sanitizedEmail,
        subject: formattedSubject,
        message: formattedMessage,
        status: "unread",
      },
    });

    // 4. Create a Reservation log referencing Spa to contribute to Guest CRM LTV
    const finalAmount = Number(therapy.price) * guests;

    await db.reservation.create({
      data: {
        name,
        email: sanitizedEmail,
        phone,
        date: new Date(date),
        time: time,
        guests,
        userId: user.id,
        bookedRoomName: `Spa Treatment: ${therapy.name}`,
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
Therapy: ${therapy.name} (${therapy.duration})
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
