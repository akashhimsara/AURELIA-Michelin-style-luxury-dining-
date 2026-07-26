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
    // 2. Resolve default restaurant branch to satisfy relational database schema constraints
    let restaurant = await db.restaurant.findFirst();
    if (!restaurant) {
      restaurant = await db.restaurant.create({
        data: {
          name: "AURELIA London",
          address: "15 Bruton Place, Mayfair, London W1J 6NP",
          phone: "+44 20 7123 4567",
          email: "london@aurelia-dining.com",
        },
      });
    }

    // 3. Persist in Neon database using Prisma
    const reservation = await db.reservation.create({
      data: {
        name,
        email,
        phone,
        date: new Date(date),
        time,
        guests,
        restaurantId: restaurant.id,
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
