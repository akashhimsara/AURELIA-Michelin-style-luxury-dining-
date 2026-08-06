"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ReservationType = "room" | "dining" | "spa" | "wedding" | "all";
export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "all";
export type PaymentStatus = "paid" | "unpaid" | "refunded" | "all";
export type SortField = "date" | "amount" | "name" | "createdAt";
export type SortDir = "asc" | "desc";

export interface ReservationFilters {
  type?: ReservationType;
  status?: ReservationStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  sortBy?: SortField;
  sortDir?: SortDir;
  page?: number;
  pageSize?: number;
}

export interface SerializedReservation {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  date: string;
  checkOutDate: string | null;
  time: string | null;
  guests: number;
  children: number;
  status: string;
  paymentStatus: string;
  bookedRoomName: string | null;
  finalAmount: number | null;
  roomId: string | null;
  restaurantId: string | null;
  specialRequests: string | null;
  dietaryRequirements: string | null;
  stripeSessionId: string | null;
  createdAt: string;
  updatedAt: string;
  type: ReservationType;
}

function classifyType(r: {
  roomId: string | null;
  restaurantId: string | null;
  time: string | null;
  specialRequests: string | null;
}): ReservationType {
  if (r.roomId) return "room";
  if (r.specialRequests?.toLowerCase().includes("wedding")) return "wedding";
  if (r.restaurantId) return "dining";
  if (r.time) return "spa";
  return "dining";
}

function serializeReservation(r: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  date: Date;
  checkOutDate: Date | null;
  time: string | null;
  guests: number;
  children: number;
  status: string;
  paymentStatus: string;
  bookedRoomName: string | null;
  finalAmount: { toString(): string } | null;
  roomId: string | null;
  restaurantId: string | null;
  specialRequests: string | null;
  dietaryRequirements: string | null;
  stripeSessionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}): SerializedReservation {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    date: r.date.toISOString(),
    checkOutDate: r.checkOutDate?.toISOString() ?? null,
    time: r.time,
    guests: r.guests,
    children: r.children,
    status: r.status,
    paymentStatus: r.paymentStatus,
    bookedRoomName: r.bookedRoomName,
    finalAmount: r.finalAmount ? Number(r.finalAmount.toString()) : null,
    roomId: r.roomId,
    restaurantId: r.restaurantId,
    specialRequests: r.specialRequests,
    dietaryRequirements: r.dietaryRequirements,
    stripeSessionId: r.stripeSessionId,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    type: classifyType(r),
  };
}

function revalidateAll() {
  revalidatePath("/admin");
  revalidatePath("/admin/reservations");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/reservations");
}

// ─── Fetch All (with filters & pagination) ────────────────────────────────────

export async function getReservations(filters: ReservationFilters = {}) {
  const {
    type = "all",
    status = "all",
    paymentStatus = "all",
    search = "",
    dateFrom,
    dateTo,
    amountMin,
    amountMax,
    sortBy = "createdAt",
    sortDir = "desc",
    page = 1,
    pageSize = 15,
  } = filters;

  const where: Record<string, unknown> = {};

  // Status filter
  if (status !== "all") where.status = status;
  // Payment status filter
  if (paymentStatus !== "all") where.paymentStatus = paymentStatus;

  // Type filter
  if (type === "room") {
    where.roomId = { not: null };
  } else if (type === "dining") {
    where.roomId = null;
    where.restaurantId = { not: null };
    where.NOT = { specialRequests: { contains: "wedding", mode: "insensitive" } };
  } else if (type === "spa") {
    where.roomId = null;
    where.restaurantId = null;
    where.time = { not: null };
  } else if (type === "wedding") {
    where.specialRequests = { contains: "wedding", mode: "insensitive" };
  }

  // Date range
  if (dateFrom || dateTo) {
    where.date = {
      ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
      ...(dateTo ? { lte: new Date(dateTo) } : {}),
    };
  }

  // Amount range
  if (amountMin !== undefined || amountMax !== undefined) {
    where.finalAmount = {
      ...(amountMin !== undefined ? { gte: amountMin } : {}),
      ...(amountMax !== undefined ? { lte: amountMax } : {}),
    };
  }

  // Search
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { bookedRoomName: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy: Record<string, string> =
    sortBy === "amount"
      ? { finalAmount: sortDir }
      : sortBy === "name"
      ? { name: sortDir }
      : sortBy === "date"
      ? { date: sortDir }
      : { createdAt: sortDir };

  const [total, rows] = await Promise.all([
    db.reservation.count({ where }),
    db.reservation.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    reservations: rows.map(serializeReservation),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// ─── Get Single Reservation Detail ────────────────────────────────────────────

export async function getReservationDetail(id: string) {
  const r = await db.reservation.findUnique({
    where: { id },
    include: {
      user: {
        include: { profile: true, role: true },
      },
      room: true,
    },
  });
  if (!r) return null;

  return {
    reservation: serializeReservation(r),
    user: r.user
      ? {
          id: r.user.id,
          name: r.user.name,
          email: r.user.email,
          phone: r.user.phone ?? null,
          role: r.user.role?.name ?? "guest",
          createdAt: r.user.createdAt.toISOString(),
          profile: r.user.profile
            ? {
                vipTier: r.user.profile.vipTier,
                loyaltyPoints: r.user.profile.loyaltyPoints,
                nationality: r.user.profile.nationality ?? null,
                pillowType: r.user.profile.pillowType ?? null,
                dietaryNotes: r.user.profile.dietaryNotes ?? null,
                emergencyContact: r.user.profile.emergencyContact ?? null,
              }
            : null,
        }
      : null,
    room: r.room
      ? {
          id: r.room.id,
          name: r.room.name,
          pricePerNight: Number(r.room.pricePerNight),
          capacity: r.room.capacity,
        }
      : null,
  };
}

// ─── Status Actions ────────────────────────────────────────────────────────────

export async function approveReservation(id: string) {
  try {
    const reservation = await db.reservation.findUnique({ where: { id } });
    if (!reservation) return { success: false, message: "Reservation not found." };
    await db.reservation.update({ where: { id }, data: { status: "confirmed" } });
    revalidateAll();
    return { success: true };
  } catch {
    return { success: false, message: "Failed to approve reservation." };
  }
}

export async function cancelReservation(id: string) {
  try {
    const reservation = await db.reservation.findUnique({ where: { id } });
    if (!reservation) return { success: false, message: "Reservation not found." };
    await db.reservation.update({ where: { id }, data: { status: "cancelled" } });
    revalidateAll();
    return { success: true };
  } catch {
    return { success: false, message: "Failed to cancel reservation." };
  }
}

export async function updateReservationStatus(id: string, status: "pending" | "confirmed" | "cancelled") {
  try {
    await db.reservation.update({ where: { id }, data: { status } });
    revalidateAll();
    return { success: true };
  } catch {
    return { success: false, message: "Failed to update status." };
  }
}

export async function markRefunded(id: string) {
  try {
    await db.reservation.update({
      where: { id },
      data: { paymentStatus: "refunded", status: "cancelled" },
    });
    revalidateAll();
    return { success: true };
  } catch {
    return { success: false, message: "Failed to mark refunded." };
  }
}

// ─── Room Management ──────────────────────────────────────────────────────────

export async function assignRoom(reservationId: string, roomId: string) {
  try {
    const room = await db.room.findUnique({ where: { id: roomId } });
    if (!room) return { success: false, message: "Room not found." };
    await db.reservation.update({
      where: { id: reservationId },
      data: {
        roomId,
        bookedRoomName: room.name,
        roomRateAtBooking: room.pricePerNight,
      },
    });
    revalidateAll();
    return { success: true };
  } catch {
    return { success: false, message: "Failed to assign room." };
  }
}

export async function changeRoom(reservationId: string, roomId: string) {
  return assignRoom(reservationId, roomId);
}

export async function upgradeRoom(reservationId: string, roomId: string) {
  try {
    const room = await db.room.findUnique({ where: { id: roomId } });
    if (!room) return { success: false, message: "Room not found." };

    const reservation = await db.reservation.findUnique({ where: { id: reservationId } });
    if (!reservation) return { success: false, message: "Reservation not found." };

    const currentRate = Number(reservation.roomRateAtBooking ?? 0);
    const newRate = Number(room.pricePerNight);
    if (newRate <= currentRate) {
      return { success: false, message: "Upgrade must be to a higher-rate room." };
    }

    await db.reservation.update({
      where: { id: reservationId },
      data: { roomId, bookedRoomName: room.name, roomRateAtBooking: room.pricePerNight },
    });
    revalidateAll();
    return { success: true };
  } catch {
    return { success: false, message: "Failed to upgrade room." };
  }
}

// ─── Notes ────────────────────────────────────────────────────────────────────

export async function addNote(reservationId: string, note: string) {
  try {
    const reservation = await db.reservation.findUnique({ where: { id: reservationId } });
    if (!reservation) return { success: false, message: "Reservation not found." };
    const existing = reservation.specialRequests ?? "";
    const separator = existing ? "\n\n--- Admin Note ---\n" : "--- Admin Note ---\n";
    await db.reservation.update({
      where: { id: reservationId },
      data: { specialRequests: existing + separator + note },
    });
    revalidateAll();
    return { success: true };
  } catch {
    return { success: false, message: "Failed to save note." };
  }
}

// ─── Bulk Actions ─────────────────────────────────────────────────────────────

export async function bulkUpdateStatus(ids: string[], status: "confirmed" | "cancelled") {
  try {
    await db.reservation.updateMany({
      where: { id: { in: ids } },
      data: { status },
    });
    revalidateAll();
    return { success: true, count: ids.length };
  } catch {
    return { success: false, message: "Failed to bulk update." };
  }
}

// ─── Available Rooms ──────────────────────────────────────────────────────────

export async function getAvailableRooms() {
  const rooms = await db.room.findMany({ orderBy: { pricePerNight: "asc" } });
  return rooms.map((r) => ({
    id: r.id,
    name: r.name,
    pricePerNight: Number(r.pricePerNight),
    capacity: r.capacity,
  }));
}
