import React from "react";
import type { Metadata } from "next";
import { Heading } from "@/components/ui/heading";
import { db } from "@/lib/db";
import { ReservationsDashboard } from "@/features/admin/components/reservations-dashboard";

export const metadata: Metadata = {
  title: "Manage Reservations | AURELIA Console",
  description: "Review, confirm, reschedule, and manually override guest booking reservations.",
};

export default async function AdminReservationsPage() {
  const reservations = await db.reservation.findMany({
    orderBy: {
      date: "asc",
    },
  });

  const rooms = await db.room.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const mappedReservations = reservations.map((res) => ({
    id: res.id,
    name: res.name,
    email: res.email,
    phone: res.phone,
    date: res.date.toISOString(),
    time: res.time,
    guests: res.guests,
    status: res.status,
    roomId: res.roomId,
  }));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <Heading subtitle>Operational Management</Heading>
        <Heading as="h1" accent className="tracking-wide">
          Reservations Panel
        </Heading>
        <p className="text-xs text-zinc-500 font-sans mt-1">
          Manually reschedule, confirm, cancel, delete, or create lodging and table bookings directly inside the system.
        </p>
      </div>

      {/* Main Consolidated Manager Dashboard */}
      <ReservationsDashboard 
        reservations={mappedReservations} 
        rooms={rooms} 
      />
    </div>
  );
}
