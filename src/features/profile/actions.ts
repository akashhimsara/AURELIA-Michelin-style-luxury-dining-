"use server";

import { db } from "@/lib/db";
import { getCurrentUser, encryptPassword, comparePassword } from "@/features/auth/utils";
import { profileUpdateSchema, changePasswordSchema, ProfileUpdateInput, ChangePasswordInput } from "./schema";
import { revalidatePath } from "next/cache";

export async function getGuestProfile() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const user = await db.user.findUnique({
      where: { id: currentUser.userId },
      include: { profile: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    let profile = user.profile;
    if (!profile) {
      profile = await db.guestProfile.create({
        data: {
          userId: user.id,
          vipTier: "Standard Guest",
          loyaltyPoints: 100, // 100 welcome loyalty points!
        },
      });
    }

    return {
      success: true,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      },
      profile: {
        avatarUrl: profile.avatarUrl || "",
        nationality: profile.nationality || "",
        emergencyContact: profile.emergencyContact || "",
        pillowType: profile.pillowType || "",
        dietaryNotes: profile.dietaryNotes || "",
        vipTier: profile.vipTier,
        loyaltyPoints: profile.loyaltyPoints,
      },
    };
  } catch (error) {
    console.error("Fetch profile error:", error);
    return { success: false, error: "Could not retrieve guest profile data." };
  }
}

export async function updateGuestProfile(data: ProfileUpdateInput) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Unauthorized" };
  }

  const validated = profileUpdateSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, phone, nationality, emergencyContact, pillowType, dietaryNotes, avatarUrl } = validated.data;

  try {
    // Update core User details
    await db.user.update({
      where: { id: currentUser.userId },
      data: {
        name,
        phone,
      },
    });

    // Upsert Guest Profile configurations
    await db.guestProfile.upsert({
      where: { userId: currentUser.userId },
      update: {
        avatarUrl: avatarUrl || null,
        nationality: nationality || null,
        emergencyContact: emergencyContact || null,
        pillowType: pillowType || null,
        dietaryNotes: dietaryNotes || null,
      },
      create: {
        userId: currentUser.userId,
        avatarUrl: avatarUrl || null,
        nationality: nationality || null,
        emergencyContact: emergencyContact || null,
        pillowType: pillowType || null,
        dietaryNotes: dietaryNotes || null,
        vipTier: "Standard Guest",
        loyaltyPoints: 100,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    return { success: true, message: "Your guest profile has been successfully saved." };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, message: "Could not update guest profile details. Try again." };
  }
}

export async function updateGuestPassword(data: ChangePasswordInput) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Unauthorized" };
  }

  const validated = changePasswordSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { currentPassword, newPassword } = validated.data;

  try {
    const user = await db.user.findUnique({
      where: { id: currentUser.userId },
    });

    if (!user || !user.passwordHash) {
      return { success: false, message: "Profile authentication credentials not established." };
    }

    const isMatch = await comparePassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      return { success: false, message: "The current password you provided is incorrect." };
    }

    const newHash = await encryptPassword(newPassword);

    await db.user.update({
      where: { id: currentUser.userId },
      data: {
        passwordHash: newHash,
      },
    });

    return { success: true, message: "Password updated successfully." };
  } catch (error) {
    console.error("Change password error:", error);
    return { success: false, message: "Failed to update your credentials. Try again." };
  }
}

export async function getGuestDashboardData() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const user = await db.user.findUnique({
      where: { id: currentUser.userId },
      include: { profile: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Resolve profile details
    let profile = user.profile;
    if (!profile) {
      profile = await db.guestProfile.create({
        data: {
          userId: user.id,
          vipTier: "Standard Guest",
          loyaltyPoints: 100,
        },
      });
    }

    // Get Upcoming Reservations
    const upcoming = await db.reservation.findMany({
      where: {
        userId: currentUser.userId,
        date: { gte: new Date() },
      },
      orderBy: { date: "asc" },
      include: {
        room: {
          include: { facilities: true },
        },
        restaurant: true,
      },
    });

    // Get Booking Stays History
    const history = await db.reservation.findMany({
      where: {
        userId: currentUser.userId,
        date: { lt: new Date() },
      },
      orderBy: { date: "desc" },
      include: {
        room: {
          include: { facilities: true },
        },
        restaurant: true,
      },
    });

    const mapReservation = (res: any) => ({
      id: res.id,
      type: res.restaurantId
        ? "Dining"
        : res.bookedRoomName?.startsWith("Spa Treatment:")
        ? "Spa"
        : res.bookedRoomName?.startsWith("Event:")
        ? "Event"
        : "Lodging",
      name: res.restaurantId
        ? res.restaurant?.name || "Restaurant Table"
        : res.bookedRoomName?.startsWith("Spa Treatment:")
        ? res.bookedRoomName.replace("Spa Treatment: ", "")
        : res.bookedRoomName?.startsWith("Event:")
        ? res.bookedRoomName.replace("Event: ", "")
        : res.room?.name || "Suite Stay",
      date: res.date.toISOString(),
      checkOutDate: res.checkOutDate?.toISOString() || null,
      time: res.time,
      guests: res.guests,
      status: res.status,
      finalAmount: res.finalAmount ? Number(res.finalAmount) : null,
      specialRequests: res.specialRequests,
      dietaryRequirements: res.dietaryRequirements,
    });

    return {
      success: true,
      user: {
        name: user.name,
        email: user.email,
      },
      loyaltyPoints: profile.loyaltyPoints,
      vipTier: profile.vipTier,
      upcoming: upcoming.map(mapReservation),
      history: history.map(mapReservation),
    };
  } catch (error) {
    console.error("Dashboard data error:", error);
    return { success: false, error: "Could not retrieve guest dashboard summary." };
  }
}
