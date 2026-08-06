import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { db } from "@/lib/db";
import { ReservationsTable } from "./reservations-table";

export const metadata: Metadata = { title: "Reservations — AURELIA Admin" };

export default async function ReservationsPage() {
  // Fetch all reservations from the database
  const reservations = await db.reservation.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Convert Decimal and Date to standard serializable types
  const serializedReservations = reservations.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone || null,
    date: r.date.toISOString(),
    checkOutDate: r.checkOutDate ? r.checkOutDate.toISOString() : null,
    time: r.time,
    guests: r.guests,
    children: r.children,
    status: r.status,
    bookedRoomName: r.bookedRoomName,
    finalAmount: r.finalAmount ? Number(r.finalAmount) : null,
    roomId: r.roomId,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <>
      <PageHeader title="Reservations" description="View, approve, and manage all luxury hotel reservations." />
      <div className="mt-6">
        <ReservationsTable initialReservations={serializedReservations} />
      </div>
    </>
  );
}
