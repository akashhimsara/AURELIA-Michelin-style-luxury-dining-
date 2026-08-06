import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { db } from "@/lib/db";
import { ReservationsShell } from "./reservations-shell";
import type { SerializedReservation } from "@/features/admin/actions/reservations";

export const metadata: Metadata = {
  title: "Reservations — AURELIA Admin",
  description: "Manage all room, dining, spa and wedding reservations at AURELIA.",
};

export const dynamic = "force-dynamic";

function classifyType(r: {
  roomId: string | null;
  restaurantId: string | null;
  time: string | null;
  specialRequests: string | null;
}): SerializedReservation["type"] {
  if (r.roomId) return "room";
  if (r.specialRequests?.toLowerCase().includes("wedding")) return "wedding";
  if (r.restaurantId) return "dining";
  if (r.time) return "spa";
  return "dining";
}

export default async function ReservationsPage() {
  // Fetch all reservations (client handles filtering/pagination)
  const [reservationsRaw, roomsRaw] = await Promise.all([
    db.reservation.findMany({ orderBy: { createdAt: "desc" } }),
    db.room.findMany({ orderBy: { pricePerNight: "asc" } }),
  ]);

  const reservations: SerializedReservation[] = reservationsRaw.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone ?? null,
    date: r.date.toISOString(),
    checkOutDate: r.checkOutDate?.toISOString() ?? null,
    time: r.time ?? null,
    guests: r.guests,
    children: r.children,
    status: r.status,
    paymentStatus: r.paymentStatus,
    bookedRoomName: r.bookedRoomName ?? null,
    finalAmount: r.finalAmount ? Number(r.finalAmount) : null,
    roomId: r.roomId ?? null,
    restaurantId: r.restaurantId ?? null,
    specialRequests: r.specialRequests ?? null,
    dietaryRequirements: r.dietaryRequirements ?? null,
    stripeSessionId: r.stripeSessionId ?? null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    type: classifyType(r),
  }));

  const availableRooms = roomsRaw.map((r) => ({
    id: r.id,
    name: r.name,
    pricePerNight: Number(r.pricePerNight),
    capacity: r.capacity,
  }));

  const total = reservations.length;
  const totalPages = Math.max(1, Math.ceil(total / 15));

  return (
    <div className="space-y-0">
      <PageHeader
        title="Reservations"
        description="Manage all room, dining, spa, and wedding reservations. Search, filter, approve, and export."
      />
      <ReservationsShell
        initialReservations={reservations}
        total={total}
        totalPages={totalPages}
        availableRooms={availableRooms}
      />
    </div>
  );
}
