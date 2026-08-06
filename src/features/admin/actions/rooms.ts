"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type CleaningStatus = "clean" | "dirty" | "in_progress" | "inspected";
export type MaintenanceStatus = "operational" | "maintenance" | "out_of_service";

export interface SerializedRoom {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
  weekendPrice: number;
  seasonalPrice: number;
  capacity: number;
  imageUrl: string;
  category: string;
  roomType: string;
  cleaningStatus: CleaningStatus;
  maintenanceStatus: MaintenanceStatus;
  outOfService: boolean;
  assignedHousekeeper: string | null;
  facilities: Array<{ id: string; name: string; description: string }>;
  isOccupiedToday: boolean;
  activeGuestName: string | null;
  nextCheckIn: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoomDetailData {
  room: SerializedRoom;
  facilities: Array<{ id: string; name: string }>;
  upcomingReservations: Array<{
    id: string;
    guestName: string;
    email: string;
    checkIn: string;
    checkOut: string | null;
    status: string;
    amount: number | null;
  }>;
}

function classifyCategoryAndType(name: string): { category: string; roomType: string } {
  const n = name.toLowerCase();
  let category = "Heritage Wing";
  let roomType = "Deluxe Suite";

  if (n.includes("presidential") || n.includes("ocean") || n.includes("villa")) {
    category = "Oceanfront Presidential";
    roomType = "Luxury Villa";
  } else if (n.includes("penthouse") || n.includes("mayfair")) {
    category = "Mayfair Sky Line";
    roomType = "Penthouse Suite";
  } else if (n.includes("royal") || n.includes("monarch")) {
    category = "Royal Collection";
    roomType = "Royal Suite";
  } else if (n.includes("heritage") || n.includes("chamber")) {
    category = "Heritage Wing";
    roomType = "Heritage Chamber";
  }

  return { category, roomType };
}

function deriveOperationalStatus(name: string): {
  cleaningStatus: CleaningStatus;
  maintenanceStatus: MaintenanceStatus;
  outOfService: boolean;
  assignedHousekeeper: string | null;
} {
  const n = name.toLowerCase();
  if (n.includes("heritage")) {
    return {
      cleaningStatus: "dirty",
      maintenanceStatus: "operational",
      outOfService: false,
      assignedHousekeeper: "Elena Rostova",
    };
  }
  if (n.includes("renovation") || n.includes("maintenance")) {
    return {
      cleaningStatus: "in_progress",
      maintenanceStatus: "maintenance",
      outOfService: true,
      assignedHousekeeper: "Marcus Vance",
    };
  }
  return {
    cleaningStatus: "clean",
    maintenanceStatus: "operational",
    outOfService: false,
    assignedHousekeeper: "Sophie Laurent",
  };
}

function revalidateRooms() {
  revalidatePath("/admin/rooms");
  revalidatePath("/admin");
  revalidatePath("/rooms");
}

// ─── Fetch All Rooms ──────────────────────────────────────────────────────────

export async function getRooms(): Promise<SerializedRoom[]> {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const rooms = await db.room.findMany({
    include: {
      facilities: true,
      reservations: {
        where: {
          status: "confirmed",
          date: { lte: now },
        },
        orderBy: { date: "desc" },
        take: 5,
      },
    },
    orderBy: { pricePerNight: "desc" },
  });

  return rooms.map((r) => {
    const basePrice = Number(r.pricePerNight);
    const weekendPrice = Math.round(basePrice * 1.2);
    const seasonalPrice = Math.round(basePrice * 1.35);

    const { category, roomType } = classifyCategoryAndType(r.name);
    const ops = deriveOperationalStatus(r.name);

    // Check if room is occupied today
    const activeRes = r.reservations.find(
      (res) => res.checkOutDate && res.checkOutDate >= startOfToday
    );
    const isOccupiedToday = !!activeRes;
    const activeGuestName = activeRes?.name ?? null;

    return {
      id: r.id,
      name: r.name,
      description: r.description,
      pricePerNight: basePrice,
      weekendPrice,
      seasonalPrice,
      capacity: r.capacity,
      imageUrl: r.imageUrl,
      category,
      roomType,
      cleaningStatus: ops.cleaningStatus,
      maintenanceStatus: ops.maintenanceStatus,
      outOfService: ops.outOfService,
      assignedHousekeeper: ops.assignedHousekeeper,
      facilities: r.facilities.map((f) => ({
        id: f.id,
        name: f.name,
        description: f.description,
      })),
      isOccupiedToday,
      activeGuestName,
      nextCheckIn: activeRes ? activeRes.date.toISOString() : null,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  });
}

// ─── Fetch Room Detail ────────────────────────────────────────────────────────

export async function getRoomDetail(roomId: string): Promise<RoomDetailData | null> {
  const room = await db.room.findUnique({
    where: { id: roomId },
    include: {
      facilities: true,
      reservations: {
        orderBy: { date: "asc" },
        take: 10,
      },
    },
  });

  if (!room) return null;

  const basePrice = Number(room.pricePerNight);
  const { category, roomType } = classifyCategoryAndType(room.name);
  const ops = deriveOperationalStatus(room.name);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const activeRes = room.reservations.find(
    (res) => res.status === "confirmed" && res.checkOutDate && res.checkOutDate >= startOfToday
  );

  const serialized: SerializedRoom = {
    id: room.id,
    name: room.name,
    description: room.description,
    pricePerNight: basePrice,
    weekendPrice: Math.round(basePrice * 1.2),
    seasonalPrice: Math.round(basePrice * 1.35),
    capacity: room.capacity,
    imageUrl: room.imageUrl,
    category,
    roomType,
    cleaningStatus: ops.cleaningStatus,
    maintenanceStatus: ops.maintenanceStatus,
    outOfService: ops.outOfService,
    assignedHousekeeper: ops.assignedHousekeeper,
    facilities: room.facilities.map((f) => ({
      id: f.id,
      name: f.name,
      description: f.description,
    })),
    isOccupiedToday: !!activeRes,
    activeGuestName: activeRes?.name ?? null,
    nextCheckIn: activeRes ? activeRes.date.toISOString() : null,
    createdAt: room.createdAt.toISOString(),
    updatedAt: room.updatedAt.toISOString(),
  };

  const upcomingReservations = room.reservations.map((r) => ({
    id: r.id,
    guestName: r.name,
    email: r.email,
    checkIn: r.date.toISOString(),
    checkOut: r.checkOutDate ? r.checkOutDate.toISOString() : null,
    status: r.status,
    amount: r.finalAmount ? Number(r.finalAmount) : null,
  }));

  const allFacilities = await db.facility.findMany({ orderBy: { name: "asc" } });

  return {
    room: serialized,
    facilities: allFacilities.map((f) => ({ id: f.id, name: f.name })),
    upcomingReservations,
  };
}

// ─── Create Room ──────────────────────────────────────────────────────────────

export async function createRoom(data: {
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  imageUrl: string;
  facilityIds?: string[];
}) {
  try {
    const newRoom = await db.room.create({
      data: {
        name: data.name,
        description: data.description,
        pricePerNight: data.pricePerNight,
        capacity: data.capacity,
        imageUrl: data.imageUrl || "/room-ocean.png",
        facilities: data.facilityIds?.length
          ? { connect: data.facilityIds.map((id) => ({ id })) }
          : undefined,
      },
    });

    revalidateRooms();
    return { success: true, roomId: newRoom.id };
  } catch (error) {
    console.error("Create room error:", error);
    return { success: false, message: "Failed to create suite." };
  }
}

// ─── Update Room ──────────────────────────────────────────────────────────────

export async function updateRoom(
  roomId: string,
  data: {
    name?: string;
    description?: string;
    pricePerNight?: number;
    capacity?: number;
    imageUrl?: string;
    facilityIds?: string[];
  }
) {
  try {
    await db.room.update({
      where: { id: roomId },
      data: {
        name: data.name,
        description: data.description,
        pricePerNight: data.pricePerNight,
        capacity: data.capacity,
        imageUrl: data.imageUrl,
        facilities: data.facilityIds
          ? {
              set: data.facilityIds.map((id) => ({ id })),
            }
          : undefined,
      },
    });

    revalidateRooms();
    return { success: true };
  } catch (error) {
    console.error("Update room error:", error);
    return { success: false, message: "Failed to update suite." };
  }
}

// ─── Delete Room ──────────────────────────────────────────────────────────────

export async function deleteRoom(roomId: string) {
  try {
    const activeRes = await db.reservation.count({
      where: { roomId, status: "confirmed" },
    });

    if (activeRes > 0) {
      return { success: false, message: "Cannot delete room with active reservations." };
    }

    await db.room.delete({ where: { id: roomId } });
    revalidateRooms();
    return { success: true };
  } catch (error) {
    console.error("Delete room error:", error);
    return { success: false, message: "Failed to delete suite." };
  }
}

// ─── Facilities Query ─────────────────────────────────────────────────────────

export async function getAllFacilities() {
  const facilities = await db.facility.findMany({ orderBy: { name: "asc" } });
  return facilities.map((f) => ({ id: f.id, name: f.name, description: f.description }));
}
