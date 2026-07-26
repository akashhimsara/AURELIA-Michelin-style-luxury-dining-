"use server";

import { db } from "@/lib/db";
import { privateDiningSchema, PrivateDiningInput, privateDiningSalons } from "../schema";

export async function createPrivateDiningInquiry(data: PrivateDiningInput) {
  const validated = privateDiningSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, roomSelection, date, time, guests, sommelierService, notes } = validated.data;
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

    const salon = privateDiningSalons[roomSelection];
    const formattedSubject = `Private Dining: ${salon.name} - Date: ${date} ${time}`;
    const formattedMessage = `Phone: ${phone}\nPrivate Salon: ${salon.name}\nSeating Slot: ${time}\nExpected Guests: ${guests}\nVIP Sommelier Service: ${sommelierService ? "Requested" : "Not Requested"}\n\nDietary & Setup Notes:\n${notes || "None"}`;

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

    // 3. Create a Reservation log representing this booking to contribute to Guest CRM LTV
    // Est. Billing = (Guests * Price) + (Sommelier ? 200 : 0)
    const baseSpend = guests * salon.pricePerGuest;
    const sommelierSpend = sommelierService ? 200 : 0;
    const finalAmount = baseSpend + sommelierSpend;

    await db.reservation.create({
      data: {
        name,
        email: sanitizedEmail,
        phone,
        date: new Date(date),
        time: time,
        guests,
        userId: user.id,
        bookedRoomName: `Private Salon: ${salon.name}`,
        finalAmount: finalAmount,
      },
    });

    console.log(`
============================================================
[MOCK MAIL SERVICE] Dispatched Private Dining Reservation Alert
To: dining-reservations@aurelia.com
From: ${email}
Subject: NEW PRIVATE DINING SALON REQUEST - Ref: ${inquiry.id.slice(0, 8).toUpperCase()}
------------------------------------------------------------
New Private Salon Booking Request Received:
Guest: ${name}
Phone: ${phone}
Salon: ${salon.name}
Guests: ${guests} guests
Schedule Target: ${date} at ${time}
VIP Sommelier Service: ${sommelierService ? "YES" : "NO"}
Est. Seating Spend: £${finalAmount} (LTV Linked)

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
    console.error("Private dining booking database write error:", error);
    return {
      success: false,
      message: "Could not register private dining reservation. Please verify inputs.",
    };
  }
}
