"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface SerializedMenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SerializedDiningReservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string | null;
  guests: number;
  status: string;
  specialRequests: string | null;
  dietaryRequirements: string | null;
  tableNumber: number | null;
  finalAmount: number | null;
  createdAt: string;
}

export interface RestaurantTableInfo {
  tableNumber: number;
  zone: string;
  capacity: number;
  status: "available" | "reserved" | "seated";
  reservedForGuest: string | null;
  reservationId: string | null;
}

export interface RestaurantData {
  restaurant: {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  menuItems: SerializedMenuItem[];
  diningReservations: SerializedDiningReservation[];
  tables: RestaurantTableInfo[];
}

function revalidateRestaurant() {
  revalidatePath("/admin/restaurant");
  revalidatePath("/admin");
  revalidatePath("/");
}

// Default 12 Mayfair Dining Tables Layout
const DEFAULT_TABLES: Omit<RestaurantTableInfo, "status" | "reservedForGuest" | "reservationId">[] = [
  { tableNumber: 1, zone: "Window Solarium", capacity: 2 },
  { tableNumber: 2, zone: "Window Solarium", capacity: 2 },
  { tableNumber: 3, zone: "Window Solarium", capacity: 4 },
  { tableNumber: 4, zone: "Main Dining Room", capacity: 4 },
  { tableNumber: 5, zone: "Main Dining Room", capacity: 4 },
  { tableNumber: 6, zone: "Main Dining Room", capacity: 6 },
  { tableNumber: 7, zone: "Main Dining Room", capacity: 6 },
  { tableNumber: 8, zone: "Chef's Counter", capacity: 2 },
  { tableNumber: 9, zone: "Chef's Counter", capacity: 2 },
  { tableNumber: 10, zone: "Private Salon", capacity: 8 },
  { tableNumber: 11, zone: "Private Salon", capacity: 8 },
  { tableNumber: 12, zone: "Terrace Lounge", capacity: 4 },
];

// ─── Fetch All Restaurant Data ────────────────────────────────────────────────

export async function getRestaurantData(): Promise<RestaurantData> {
  // Ensure default Restaurant record exists
  let restaurant = await db.restaurant.findFirst({
    include: {
      menuItems: { orderBy: { category: "asc" } },
    },
  });

  if (!restaurant) {
    restaurant = await db.restaurant.create({
      data: {
        name: "AURELIA Fine Dining Mayfair",
        address: "14 Mayfair Square, London W1J 8AJ",
        phone: "+44 20 7946 0912",
        email: "dining@aurelia.com",
      },
      include: {
        menuItems: true,
      },
    });

    // Seed initial culinary menu items if empty
    await db.menu.createMany({
      data: [
        {
          restaurantId: restaurant.id,
          name: "Oscietra Caviar Tartlet",
          description: "Smoked crème fraîche, cured egg yolk, gold leaf in crisp buckwheat shell.",
          price: 48.0,
          category: "Appetizer",
          image: "/hero-bg.png",
          tags: ["Chef Special", "Signature"],
        },
        {
          restaurantId: restaurant.id,
          name: "Hand-Dived Cornish Scallops",
          description: "Pan-seared with cauliflower velvet, brown butter, and black truffle reduction.",
          price: 36.0,
          category: "Appetizer",
          image: "/hero-bg.png",
          tags: ["Gluten-Free"],
        },
        {
          restaurantId: restaurant.id,
          name: "Wagyu A5 Fillet & Truffle Jus",
          description: "Kagoshima A5 Wagyu, charred king oyster mushroom, bone marrow glaze.",
          price: 125.0,
          category: "Main Course",
          image: "/hero-bg.png",
          tags: ["Chef Special", "Signature"],
        },
        {
          restaurantId: restaurant.id,
          name: "Brittany Blue Lobster",
          description: "Poached in citrus butter, saffron bisque, braised fennel, sea succulents.",
          price: 95.0,
          category: "Main Course",
          image: "/hero-bg.png",
          tags: ["Signature"],
        },
        {
          restaurantId: restaurant.id,
          name: "Grand Cru Chocolate Sphere",
          description: "Valrhona 70% dark chocolate, salted caramel core, hazelnut praline pour.",
          price: 24.0,
          category: "Dessert",
          image: "/hero-bg.png",
          tags: ["Signature"],
        },
        {
          restaurantId: restaurant.id,
          name: "Dom Pérignon Vintage 2013",
          description: "Epernay, Champagne. Crisp minerality, toasted brioche and white peach notes.",
          price: 340.0,
          category: "Wine List",
          image: "/hero-bg.png",
          tags: ["Wine List", "Sommelier Reserve"],
        },
        {
          restaurantId: restaurant.id,
          name: "Château Margaux Premier Grand Cru 2015",
          description: "Bordeaux, France. Complex aromas of violet, cassis, cedar, and velvety tannins.",
          price: 850.0,
          category: "Wine List",
          image: "/hero-bg.png",
          tags: ["Wine List", "Sommelier Reserve"],
        },
        {
          restaurantId: restaurant.id,
          name: "AURELIA Golden Elixir Cocktail",
          description: "24k Gold Flakes, Yamazaki 12yr, Truffle Honey, Grand Marnier Cuvée.",
          price: 42.0,
          category: "Cocktail",
          image: "/hero-bg.png",
          tags: ["Signature"],
        },
      ],
    });

    restaurant = await db.restaurant.findFirst({
      where: { id: restaurant.id },
      include: { menuItems: { orderBy: { category: "asc" } } },
    });
  }

  // Fetch all dining reservations (roomId is null)
  const reservations = await db.reservation.findMany({
    where: { roomId: null },
    orderBy: { date: "desc" },
  });

  const serializedMenuItems: SerializedMenuItem[] = (restaurant?.menuItems ?? []).map((m) => ({
    id: m.id,
    restaurantId: m.restaurantId,
    name: m.name,
    description: m.description,
    price: Number(m.price),
    category: m.category,
    image: m.image,
    tags: m.tags ?? [],
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  }));

  const serializedReservations: SerializedDiningReservation[] = reservations.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    date: r.date.toISOString(),
    time: r.time ?? null,
    guests: r.guests,
    status: r.status,
    specialRequests: r.specialRequests ?? null,
    dietaryRequirements: r.dietaryRequirements ?? null,
    tableNumber: (r as unknown as { tableNumber?: number }).tableNumber ?? null,
    finalAmount: r.finalAmount ? Number(r.finalAmount) : null,
    createdAt: r.createdAt.toISOString(),
  }));

  // Build table availability mapping for today's reservations
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const confirmedToday = reservations.filter(
    (r) => r.status === "confirmed" && r.date >= startOfToday
  );

  const tables: RestaurantTableInfo[] = DEFAULT_TABLES.map((t) => {
    const assignedRes = confirmedToday.find((r) => {
      const assignedNum = (r as unknown as { tableNumber?: number }).tableNumber;
      return assignedNum === t.tableNumber;
    });

    if (assignedRes) {
      return {
        ...t,
        status: assignedRes.status === "confirmed" ? "reserved" : "seated",
        reservedForGuest: assignedRes.name,
        reservationId: assignedRes.id,
      };
    }

    return {
      ...t,
      status: "available",
      reservedForGuest: null,
      reservationId: null,
    };
  });

  return {
    restaurant: {
      id: restaurant!.id,
      name: restaurant!.name,
      address: restaurant!.address,
      phone: restaurant!.phone,
      email: restaurant!.email,
    },
    menuItems: serializedMenuItems,
    diningReservations: serializedReservations,
    tables,
  };
}

// ─── Create Menu Item ─────────────────────────────────────────────────────────

export async function createMenuItem(data: {
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  tags?: string[];
}) {
  try {
    const item = await db.menu.create({
      data: {
        restaurantId: data.restaurantId,
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        image: data.image || "/hero-bg.png",
        tags: data.tags || [],
      },
    });

    revalidateRestaurant();
    return { success: true, itemId: item.id };
  } catch (error) {
    console.error("Create menu item error:", error);
    return { success: false, message: "Failed to create menu item." };
  }
}

// ─── Update Menu Item ─────────────────────────────────────────────────────────

export async function updateMenuItem(
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    image?: string;
    tags?: string[];
  }
) {
  try {
    await db.menu.update({
      where: { id },
      data,
    });

    revalidateRestaurant();
    return { success: true };
  } catch (error) {
    console.error("Update menu item error:", error);
    return { success: false, message: "Failed to update menu item." };
  }
}

// ─── Delete Menu Item ─────────────────────────────────────────────────────────

export async function deleteMenuItem(id: string) {
  try {
    await db.menu.delete({ where: { id } });
    revalidateRestaurant();
    return { success: true };
  } catch (error) {
    console.error("Delete menu item error:", error);
    return { success: false, message: "Failed to delete menu item." };
  }
}

// ─── Assign Table to Reservation ──────────────────────────────────────────────

export async function assignTableToReservation(
  reservationId: string,
  tableNumber: number
) {
  try {
    await db.reservation.update({
      where: { id: reservationId },
      data: {
        specialRequests: `Assigned Table #${tableNumber}`,
      },
    });

    revalidateRestaurant();
    return { success: true };
  } catch (error) {
    console.error("Assign table error:", error);
    return { success: false, message: "Failed to assign table." };
  }
}

// ─── Update Dining Reservation Status ─────────────────────────────────────────

export async function updateDiningReservationStatus(
  reservationId: string,
  status: "pending" | "confirmed" | "cancelled"
) {
  try {
    await db.reservation.update({
      where: { id: reservationId },
      data: { status },
    });

    revalidateRestaurant();
    return { success: true };
  } catch (error) {
    console.error("Update dining status error:", error);
    return { success: false, message: "Failed to update status." };
  }
}
