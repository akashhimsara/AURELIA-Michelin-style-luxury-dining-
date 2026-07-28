"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/features/auth/utils";
import { reservationSchema, ReservationFormInput } from "./schema";
import { revalidatePath } from "next/cache";

export async function checkRoomAvailability(roomId: string, checkIn: string, checkOut: string, excludeReservationId?: string) {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  const overlap = await db.reservation.findFirst({
    where: {
      roomId,
      status: { not: "cancelled" },
      id: excludeReservationId ? { not: excludeReservationId } : undefined,
      OR: [
        {
          date: { lte: checkInDate },
          checkOutDate: { gt: checkInDate },
        },
        {
          date: { lt: checkOutDate },
          checkOutDate: { gte: checkOutDate },
        },
        {
          date: { gte: checkInDate },
          checkOutDate: { lte: checkOutDate },
        },
      ],
    },
  });

  return !overlap;
}

export async function createReservation(data: ReservationFormInput) {
  const validated = reservationSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const {
    name,
    email,
    phone,
    date,
    checkOutDate,
    time,
    guests,
    children = 0,
    roomId,
    restaurantId,
    promoCode,
    specialRequests,
    dietaryRequirements,
  } = validated.data;
  
  const sanitizedEmail = email.toLowerCase().trim();

  try {
    // Determine active user context
    const currentUser = await getCurrentUser();
    let userId = currentUser?.userId || null;

    if (!userId) {
      // Find or create guest registry in CRM database
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
      userId = user.id;
    }

    let bookedRoomName: string | null = null;
    let roomRateAtBooking: number | null = null;
    let finalAmount: number | null = null;
    let nightsCount = 1;

    // Apply promo code logic
    let discountRate = 0;
    if (promoCode) {
      const code = promoCode.toUpperCase().trim();
      if (code === "ROYAL15") discountRate = 0.15;
      else if (code === "MICHELIN10") discountRate = 0.10;
      else if (code === "SANCTUARY20") discountRate = 0.20;
    }

    // Process Suite Stay Booking
    if (roomId && checkOutDate) {
      // 1. Double check room date availability bounds
      const isAvailable = await checkRoomAvailability(roomId, date, checkOutDate);
      if (!isAvailable) {
        return {
          success: false,
          message: "The selected room has already been reserved for these dates. Please try another range.",
        };
      }

      const room = await db.room.findUnique({
        where: { id: roomId },
      });
      if (!room) {
        return {
          success: false,
          message: "The requested accommodation suite could not be found.",
        };
      }

      const ms = new Date(checkOutDate).getTime() - new Date(date).getTime();
      nightsCount = Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));

      bookedRoomName = room.name;
      roomRateAtBooking = Number(room.pricePerNight);

      // Price calculation: nights * rate per night - discount + 12% VAT + 5% service charge
      const baseTotal = roomRateAtBooking * nightsCount;
      const discountVal = baseTotal * discountRate;
      const taxable = baseTotal - discountVal;
      const tax = taxable * 0.12;
      const service = taxable * 0.05;
      finalAmount = taxable + tax + service;
    }

    // Dining table branch lookup logic
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

    const reservation = await db.reservation.create({
      data: {
        name,
        email: sanitizedEmail,
        phone,
        date: new Date(date),
        checkOutDate: checkOutDate ? new Date(checkOutDate) : null,
        time: time || null,
        guests,
        children,
        restaurantId: resolvedRestaurantId || null,
        roomId: roomId || null,
        userId,
        roomRateAtBooking: roomRateAtBooking ? roomRateAtBooking : null,
        bookedRoomName: bookedRoomName || null,
        finalAmount: finalAmount ? finalAmount : null,
        specialRequests: specialRequests || null,
        dietaryRequirements: dietaryRequirements || null,
      },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      reservation: {
        id: reservation.id,
        name: reservation.name,
        date: reservation.date.toISOString(),
        checkOutDate: reservation.checkOutDate?.toISOString() || null,
        time: reservation.time,
        guests: reservation.guests,
        children: reservation.children,
        bookedRoomName: reservation.bookedRoomName,
        roomRateAtBooking: reservation.roomRateAtBooking ? Number(reservation.roomRateAtBooking) : null,
        finalAmount: reservation.finalAmount ? Number(reservation.finalAmount) : null,
      },
    };
  } catch (error) {
    console.error("Create reservation error:", error);
    return {
      success: false,
      message: "An error occurred while establishing your reservation. Try again later.",
    };
  }
}

export async function cancelReservation(reservationId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const reservation = await db.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation || reservation.userId !== currentUser.userId) {
      return { success: false, message: "Reservation record could not be found." };
    }

    await db.reservation.update({
      where: { id: reservationId },
      data: {
        status: "cancelled",
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/reservations");
    return { success: true, message: "Reservation cancelled successfully." };
  } catch (error) {
    console.error("Cancel reservation error:", error);
    return { success: false, message: "Could not process stay cancellation. Try again." };
  }
}

export async function modifyReservation(
  reservationId: string,
  newCheckIn: string,
  newCheckOut: string | null,
  guests: number,
  newTime?: string | null,
  specialRequests?: string | null,
  dietaryRequirements?: string | null
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const reservation = await db.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation || reservation.userId !== currentUser.userId) {
      return { success: false, message: "Reservation record could not be found." };
    }

    if (reservation.roomId && newCheckOut) {
      // Check date availability conflicts excluding current reservation
      const isAvailable = await checkRoomAvailability(reservation.roomId, newCheckIn, newCheckOut, reservationId);
      if (!isAvailable) {
        return {
          success: false,
          message: "The requested accommodation suite is occupied during the new date range.",
        };
      }

      // Calculate new rates based on new stay length
      const ms = new Date(newCheckOut).getTime() - new Date(newCheckIn).getTime();
      const nightsCount = Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
      const rate = Number(reservation.roomRateAtBooking || 0);

      // Re-apply same discount if existed
      let discountRate = 0;
      if (reservation.finalAmount && reservation.roomRateAtBooking) {
        const originalNights = Math.max(1, Math.round((new Date(reservation.checkOutDate || "").getTime() - new Date(reservation.date).getTime()) / (1000 * 60 * 60 * 24)));
        const originalBase = rate * originalNights;
        const discountVal = originalBase - (Number(reservation.finalAmount) / 1.17); // reverse VAT/service calculation roughly
        discountRate = Math.max(0, Math.min(0.5, discountVal / originalBase));
      }

      const baseTotal = rate * nightsCount;
      const discountAmount = baseTotal * discountRate;
      const taxable = baseTotal - discountAmount;
      const tax = taxable * 0.12;
      const service = taxable * 0.05;
      const finalAmount = taxable + tax + service;

      await db.reservation.update({
        where: { id: reservationId },
        data: {
          date: new Date(newCheckIn),
          checkOutDate: new Date(newCheckOut),
          guests,
          finalAmount,
        },
      });
    } else {
      // Dining modification
      await db.reservation.update({
        where: { id: reservationId },
        data: {
          date: new Date(newCheckIn),
          time: newTime || reservation.time,
          guests,
          specialRequests: specialRequests !== undefined ? specialRequests : reservation.specialRequests,
          dietaryRequirements: dietaryRequirements !== undefined ? dietaryRequirements : reservation.dietaryRequirements,
        },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/reservations");
    return { success: true, message: "Your booking modifications have been successfully updated." };
  } catch (error) {
    console.error("Modify reservation error:", error);
    return { success: false, message: "Could not save booking modifications. Try again." };
  }
}
