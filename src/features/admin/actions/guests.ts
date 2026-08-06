"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ─── Types ────────────────────────────────────────────────────────────────────

export type GuestStatus = "vip" | "loyal" | "regular" | "new" | "blacklisted";

export interface SerializedGuest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  emailVerified: string | null;
  socialProvider: string | null;
  // Profile
  vipTier: string;
  loyaltyPoints: number;
  nationality: string | null;
  avatarUrl: string | null;
  // Computed
  totalReservations: number;
  confirmedReservations: number;
  roomStays: number;
  diningVisits: number;
  lifetimeValue: number;
  avgSpend: number;
  favoriteRoom: string | null;
  lastStay: string | null;
  status: GuestStatus;
}

export interface GuestDetailData {
  guest: SerializedGuest;
  profile: {
    nationality: string | null;
    emergencyContact: string | null;
    pillowType: string | null;
    dietaryNotes: string | null;
    vipTier: string;
    loyaltyPoints: number;
    avatarUrl: string | null;
  } | null;
  roomHistory: Array<{
    id: string;
    bookedRoomName: string | null;
    date: string;
    checkOutDate: string | null;
    guests: number;
    finalAmount: number | null;
    status: string;
    paymentStatus: string;
    nights: number;
  }>;
  diningHistory: Array<{
    id: string;
    date: string;
    time: string | null;
    guests: number;
    finalAmount: number | null;
    status: string;
    specialRequests: string | null;
  }>;
  spaHistory: Array<{
    id: string;
    date: string;
    time: string | null;
    finalAmount: number | null;
    status: string;
    specialRequests: string | null;
  }>;
  weddingHistory: Array<{
    id: string;
    date: string;
    guests: number;
    finalAmount: number | null;
    status: string;
    specialRequests: string | null;
  }>;
  monthlySpend: Array<{ month: string; amount: number }>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeStatus(
  vipTier: string,
  loyaltyPoints: number,
  confirmedCount: number
): GuestStatus {
  if (vipTier === "Blacklisted") return "blacklisted";
  if (vipTier.toLowerCase().includes("vip") || loyaltyPoints >= 1000) return "vip";
  if (confirmedCount >= 3) return "loyal";
  if (confirmedCount >= 1) return "regular";
  return "new";
}

function classifyReservationType(r: {
  roomId: string | null;
  restaurantId: string | null;
  time: string | null;
  specialRequests: string | null;
}) {
  if (r.roomId) return "room";
  if (r.specialRequests?.toLowerCase().includes("wedding")) return "wedding";
  if (r.restaurantId) return "dining";
  if (r.time) return "spa";
  return "dining";
}

function revalidateGuests() {
  revalidatePath("/admin/guests");
  revalidatePath("/admin");
}

// ─── Get All Guests ────────────────────────────────────────────────────────────

export async function getGuests(): Promise<SerializedGuest[]> {
  const users = await db.user.findMany({
    include: {
      profile: true,
      reservations: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return users.map((u) => {
    const reservations = u.reservations;
    const confirmed = reservations.filter((r) => r.status === "confirmed");
    const roomStays = confirmed.filter((r) => r.roomId).length;
    const diningVisits = confirmed.filter(
      (r) => !r.roomId && (r.restaurantId || !r.time)
    ).length;
    const lifetimeValue = confirmed.reduce(
      (sum, r) => sum + Number(r.finalAmount || 0),
      0
    );
    const avgSpend =
      confirmed.length > 0 ? lifetimeValue / confirmed.length : 0;

    // Favorite room
    const roomCounts: Record<string, number> = {};
    for (const r of confirmed.filter((r) => r.bookedRoomName)) {
      const name = r.bookedRoomName!;
      roomCounts[name] = (roomCounts[name] || 0) + 1;
    }
    const favoriteRoom =
      Object.entries(roomCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null;

    // Last stay
    const roomDates = confirmed
      .filter((r) => r.roomId)
      .map((r) => r.date.getTime());
    const lastStay =
      roomDates.length > 0
        ? new Date(Math.max(...roomDates)).toISOString()
        : null;

    const vipTier = u.profile?.vipTier ?? "Standard Guest";
    const loyaltyPoints = u.profile?.loyaltyPoints ?? 0;

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone ?? null,
      createdAt: u.createdAt.toISOString(),
      emailVerified: u.emailVerified?.toISOString() ?? null,
      socialProvider: u.socialProvider ?? null,
      vipTier,
      loyaltyPoints,
      nationality: u.profile?.nationality ?? null,
      avatarUrl: u.profile?.avatarUrl ?? null,
      totalReservations: reservations.length,
      confirmedReservations: confirmed.length,
      roomStays,
      diningVisits,
      lifetimeValue,
      avgSpend,
      favoriteRoom,
      lastStay,
      status: computeStatus(vipTier, loyaltyPoints, confirmed.length),
    };
  });
}

// ─── Get Guest Detail ──────────────────────────────────────────────────────────

export async function getGuestDetail(userId: string): Promise<GuestDetailData | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      reservations: { orderBy: { date: "desc" } },
    },
  });
  if (!user) return null;

  const reservations = user.reservations;
  const confirmed = reservations.filter((r) => r.status === "confirmed");

  // Segment history
  const roomHistory = reservations
    .filter((r) => r.roomId)
    .map((r) => ({
      id: r.id,
      bookedRoomName: r.bookedRoomName,
      date: r.date.toISOString(),
      checkOutDate: r.checkOutDate?.toISOString() ?? null,
      guests: r.guests,
      finalAmount: r.finalAmount ? Number(r.finalAmount) : null,
      status: r.status,
      paymentStatus: r.paymentStatus,
      nights: r.checkOutDate
        ? Math.max(1, Math.round((r.checkOutDate.getTime() - r.date.getTime()) / 86400000))
        : 1,
    }));

  const diningHistory = reservations
    .filter((r) => classifyReservationType(r) === "dining")
    .map((r) => ({
      id: r.id,
      date: r.date.toISOString(),
      time: r.time,
      guests: r.guests,
      finalAmount: r.finalAmount ? Number(r.finalAmount) : null,
      status: r.status,
      specialRequests: r.specialRequests,
    }));

  const spaHistory = reservations
    .filter((r) => classifyReservationType(r) === "spa")
    .map((r) => ({
      id: r.id,
      date: r.date.toISOString(),
      time: r.time,
      finalAmount: r.finalAmount ? Number(r.finalAmount) : null,
      status: r.status,
      specialRequests: r.specialRequests,
    }));

  const weddingHistory = reservations
    .filter((r) => classifyReservationType(r) === "wedding")
    .map((r) => ({
      id: r.id,
      date: r.date.toISOString(),
      guests: r.guests,
      finalAmount: r.finalAmount ? Number(r.finalAmount) : null,
      status: r.status,
      specialRequests: r.specialRequests,
    }));

  // Monthly spend (last 6 months)
  const now = new Date();
  const monthlySpend: Array<{ month: string; amount: number }> = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
    const amount = confirmed
      .filter((r) => {
        const rd = new Date(r.date);
        return rd.getFullYear() === d.getFullYear() && rd.getMonth() === d.getMonth();
      })
      .reduce((sum, r) => sum + Number(r.finalAmount || 0), 0);
    monthlySpend.push({ month: label, amount });
  }

  const lifetimeValue = confirmed.reduce((sum, r) => sum + Number(r.finalAmount || 0), 0);
  const avgSpend = confirmed.length > 0 ? lifetimeValue / confirmed.length : 0;

  const roomCounts: Record<string, number> = {};
  for (const r of confirmed.filter((r) => r.bookedRoomName)) {
    const name = r.bookedRoomName!;
    roomCounts[name] = (roomCounts[name] || 0) + 1;
  }
  const favoriteRoom =
    Object.entries(roomCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null;

  const roomDates = confirmed.filter((r) => r.roomId).map((r) => r.date.getTime());
  const lastStay = roomDates.length > 0 ? new Date(Math.max(...roomDates)).toISOString() : null;

  const vipTier = user.profile?.vipTier ?? "Standard Guest";
  const loyaltyPoints = user.profile?.loyaltyPoints ?? 0;

  const guestSummary: SerializedGuest = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone ?? null,
    createdAt: user.createdAt.toISOString(),
    emailVerified: user.emailVerified?.toISOString() ?? null,
    socialProvider: user.socialProvider ?? null,
    vipTier,
    loyaltyPoints,
    nationality: user.profile?.nationality ?? null,
    avatarUrl: user.profile?.avatarUrl ?? null,
    totalReservations: reservations.length,
    confirmedReservations: confirmed.length,
    roomStays: roomHistory.length,
    diningVisits: diningHistory.length,
    lifetimeValue,
    avgSpend,
    favoriteRoom,
    lastStay,
    status: computeStatus(vipTier, loyaltyPoints, confirmed.length),
  };

  return {
    guest: guestSummary,
    profile: user.profile
      ? {
          nationality: user.profile.nationality,
          emergencyContact: user.profile.emergencyContact,
          pillowType: user.profile.pillowType,
          dietaryNotes: user.profile.dietaryNotes,
          vipTier: user.profile.vipTier,
          loyaltyPoints: user.profile.loyaltyPoints,
          avatarUrl: user.profile.avatarUrl,
        }
      : null,
    roomHistory,
    diningHistory,
    spaHistory,
    weddingHistory,
    monthlySpend,
  };
}

// ─── Update Profile ────────────────────────────────────────────────────────────

export async function updateGuestProfile(
  userId: string,
  data: {
    nationality?: string;
    pillowType?: string;
    dietaryNotes?: string;
    emergencyContact?: string;
  }
) {
  try {
    await db.guestProfile.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
    revalidateGuests();
    return { success: true };
  } catch {
    return { success: false, message: "Failed to update profile." };
  }
}

// ─── VIP Tier ─────────────────────────────────────────────────────────────────

export async function setVipTier(userId: string, tier: string) {
  try {
    await db.guestProfile.upsert({
      where: { userId },
      update: { vipTier: tier },
      create: { userId, vipTier: tier },
    });
    revalidateGuests();
    return { success: true };
  } catch {
    return { success: false, message: "Failed to set VIP tier." };
  }
}

// ─── Add Note ─────────────────────────────────────────────────────────────────

export async function addGuestNote(userId: string, note: string) {
  try {
    const profile = await db.guestProfile.findUnique({ where: { userId } });
    const existing = profile?.dietaryNotes ?? "";
    const sep = existing ? "\n\n--- Admin Note ---\n" : "--- Admin Note ---\n";
    await db.guestProfile.upsert({
      where: { userId },
      update: { dietaryNotes: existing + sep + note },
      create: { userId, dietaryNotes: "--- Admin Note ---\n" + note },
    });
    revalidateGuests();
    return { success: true };
  } catch {
    return { success: false, message: "Failed to save note." };
  }
}

// ─── Blacklist / Unblacklist ───────────────────────────────────────────────────

export async function blacklistGuest(userId: string) {
  try {
    await db.guestProfile.upsert({
      where: { userId },
      update: { vipTier: "Blacklisted" },
      create: { userId, vipTier: "Blacklisted" },
    });
    revalidateGuests();
    return { success: true };
  } catch {
    return { success: false, message: "Failed to blacklist guest." };
  }
}

export async function unblacklistGuest(userId: string) {
  try {
    await db.guestProfile.upsert({
      where: { userId },
      update: { vipTier: "Standard Guest" },
      create: { userId, vipTier: "Standard Guest" },
    });
    revalidateGuests();
    return { success: true };
  } catch {
    return { success: false, message: "Failed to restore guest." };
  }
}

// ─── Update Loyalty Points ────────────────────────────────────────────────────

export async function updateLoyaltyPoints(userId: string, points: number) {
  try {
    await db.guestProfile.upsert({
      where: { userId },
      update: { loyaltyPoints: points },
      create: { userId, loyaltyPoints: points },
    });
    revalidateGuests();
    return { success: true };
  } catch {
    return { success: false, message: "Failed to update loyalty points." };
  }
}
