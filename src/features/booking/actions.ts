"use server";

import { db } from "@/lib/db";
import { reservationSchema, ReservationFormInput } from "./schema";

export async function createReservation(data: ReservationFormInput) {
  // 1. Re-validate parameters on the server side
  const validated = reservationSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, date, time, guests } = validated.data;

  try {
    // 2. Persist in Neon database using Prisma
    const reservation = await db.reservation.create({
      data: {
        name,
        email,
        phone,
        date: new Date(date),
        time,
        guests,
      },
    });

    // 3. Mock dispatching transactional confirmation email
    console.log(`
============================================================
[MOCK MAIL SERVICE] Sending Confirmation Email
To: ${email}
Subject: AURELIA London - Reservation Confirmed (${reservation.id.slice(0, 8).toUpperCase()})
------------------------------------------------------------
Dear ${name},

We are delighted to confirm your reservation at AURELIA London.

Details of your booking:
- Guests: ${guests} guests
- Date: ${new Date(date).toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
- Time: ${time}
- Booking Code: ${reservation.id.slice(0, 8).toUpperCase()}

Our dress code is smart elegant. We look forward to welcoming you.

Warmest regards,
The AURELIA Guest Relations Team
============================================================
    `);

    return {
      success: true,
      reservation: {
        id: reservation.id,
        name: reservation.name,
        date: reservation.date.toISOString(),
        time: reservation.time,
        guests: reservation.guests,
      },
    };
  } catch (error) {
    console.error("Database write error:", error);
    return {
      success: false,
      message: "An error occurred while finalizing your reservation.",
    };
  }
}
