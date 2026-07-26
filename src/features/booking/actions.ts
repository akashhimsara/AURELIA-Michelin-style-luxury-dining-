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

  const { name, email, phone, date, time, guests, roomId, restaurantId, promoCode } = validated.data;
  const sanitizedEmail = email.toLowerCase().trim();

  try {
    // 2. Resolve or create CRM Guest User profile
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

    let bookedRoomName: string | null = null;
    let roomRateAtBooking: number | null = null;
    let finalAmount: number | null = null;

    // 3. Resolve active promo discounts
    let discount = 0;
    if (promoCode) {
      const code = promoCode.toUpperCase().trim();
      if (code === "ROYAL15") discount = 0.15;
      else if (code === "MICHELIN10") discount = 0.10;
      else if (code === "SANCTUARY20") discount = 0.20;
    }

    // 4. If Room booking, fetch the details to freeze historical rates
    if (roomId) {
      const room = await db.room.findUnique({
        where: { id: roomId },
      });
      if (!room) {
        return {
          success: false,
          message: "The requested accommodation suite could not be found.",
        };
      }
      bookedRoomName = room.name;
      roomRateAtBooking = Number(room.pricePerNight);
      
      // Apply promo discounts to room rate billings
      finalAmount = roomRateAtBooking * (1 - discount);
    }

    // 5. Resolve default restaurant branch for dining bookings
    let resolvedRestaurantId = restaurantId;
    if (!roomId && !resolvedRestaurantId) {
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
      resolvedRestaurantId = restaurant.id;
    }

    // 6. Persist in database using Prisma with historical snapshots and CRM links
    const reservation = await db.reservation.create({
      data: {
        name,
        email: sanitizedEmail,
        phone,
        date: new Date(date),
        time: time || null,
        guests,
        restaurantId: resolvedRestaurantId || null,
        roomId: roomId || null,
        userId: user.id, // Linked to guest CRM profile
        roomRateAtBooking: roomRateAtBooking ? roomRateAtBooking : null,
        bookedRoomName: bookedRoomName || null,
        finalAmount: finalAmount ? finalAmount : null,
      },
    });

    // 7. Mock dispatching transactional confirmation email
    const bookingType = roomId ? "Accommodation" : "Dining";
    const detailLabel = roomId 
      ? `Suite: ${bookedRoomName} (Rate: £${roomRateAtBooking}/night, Discount Applied: ${discount * 100}%, Paid: £${finalAmount})` 
      : `Seating Time: ${time}`;

    console.log(`
============================================================
[MOCK MAIL SERVICE] Sending Transactional Confirmation Email
To: ${sanitizedEmail}
Subject: AURELIA London - ${bookingType} Confirmed (${reservation.id.slice(0, 8).toUpperCase()})
------------------------------------------------------------
Dear ${name},

We are delighted to confirm your ${bookingType.toLowerCase()} arrangement at AURELIA London.

Details of your booking:
- Guests: ${guests} guests
- Date: ${new Date(date).toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
- ${detailLabel}
- Booking Code: ${reservation.id.slice(0, 8).toUpperCase()}

${roomId ? "Our check-in begins at 15:00 PM." : "Our dress code is smart elegant."} We look forward to welcoming you.

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
        bookedRoomName: reservation.bookedRoomName,
        roomRateAtBooking: reservation.roomRateAtBooking ? Number(reservation.roomRateAtBooking) : null,
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
