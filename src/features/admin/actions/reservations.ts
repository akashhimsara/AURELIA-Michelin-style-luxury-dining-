"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function updateReservationStatus(id: string, status: string) {
  try {
    await db.reservation.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/reservations");
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { error: "Failed to update reservation status." };
  }
}

export async function deleteReservation(id: string) {
  try {
    await db.reservation.delete({
      where: { id },
    });
    revalidatePath("/admin/reservations");
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete reservation:", error);
    return { error: "Failed to delete reservation." };
  }
}

export async function updateReservation(
  id: string,
  data: {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string | null;
    guests: number;
    status: string;
    roomId?: string | null;
  }
) {
  try {
    let bookedRoomName: string | null = null;
    let roomRateAtBooking: number | null = null;
    let finalAmount: number | null = null;

    if (data.roomId) {
      const room = await db.room.findUnique({
        where: { id: data.roomId },
      });
      if (room) {
        bookedRoomName = room.name;
        roomRateAtBooking = Number(room.pricePerNight);
        finalAmount = roomRateAtBooking;
      }
    }

    await db.reservation.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email.toLowerCase().trim(),
        phone: data.phone,
        date: new Date(data.date),
        time: data.time || null,
        guests: data.guests,
        status: data.status,
        roomId: data.roomId || null,
        bookedRoomName,
        roomRateAtBooking,
        finalAmount,
      },
    });

    revalidatePath("/admin/reservations");
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error) {
    console.error("Failed to update reservation:", error);
    return { error: "Failed to update reservation details." };
  }
}

export async function createReservationAdmin(data: {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string | null;
  guests: number;
  status: string;
  roomId?: string | null;
}) {
  const sanitizedEmail = data.email.toLowerCase().trim();
  try {
    // CRM profile link
    let user = await db.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email: sanitizedEmail,
          name: data.name,
          phone: data.phone || null,
        },
      });
    }

    let bookedRoomName: string | null = null;
    let roomRateAtBooking: number | null = null;
    let finalAmount: number | null = null;

    if (data.roomId) {
      const room = await db.room.findUnique({
        where: { id: data.roomId },
      });
      if (room) {
        bookedRoomName = room.name;
        roomRateAtBooking = Number(room.pricePerNight);
        finalAmount = roomRateAtBooking;
      }
    }

    await db.reservation.create({
      data: {
        name: data.name,
        email: sanitizedEmail,
        phone: data.phone,
        date: new Date(data.date),
        time: data.time || null,
        guests: data.guests,
        status: data.status,
        roomId: data.roomId || null,
        userId: user.id,
        bookedRoomName,
        roomRateAtBooking,
        finalAmount,
      },
    });

    revalidatePath("/admin/reservations");
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error) {
    console.error("Failed to create reservation:", error);
    return { error: "Failed to create reservation." };
  }
}
