import React from "react";
import type { Metadata } from "next";
import { Heading } from "@/components/ui/heading";
import { db } from "@/lib/db";
import { ReservationRow } from "@/features/admin/components/reservation-row";

export const metadata: Metadata = {
  title: "Manage Reservations | AURELIA Console",
  description: "Review, confirm, and update guest dining seatings.",
};

export default async function AdminReservationsPage() {
  const reservations = await db.reservation.findMany({
    orderBy: {
      date: "asc",
    },
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <Heading subtitle>Operational Management</Heading>
        <Heading as="h1" accent className="tracking-wide">
          Reservations Panel
        </Heading>
        <p className="text-xs text-zinc-500 font-sans mt-1">
          Review guest bookings, confirm seatings, and manage table cancellations.
        </p>
      </div>

      {/* Database bookings table */}
      <div className="border border-gold/15 bg-charcoal/20 rounded-sm overflow-hidden luxury-glass">
        {reservations.length === 0 ? (
          <div className="text-center py-20 font-sans">
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              No reservations found
            </p>
            <p className="text-[10px] text-zinc-600 mt-1 font-light">
              Table bookings will display here once customers confirm reservations.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gold/15 bg-black/60 text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
                  <th className="p-4">Guest</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Time</th>
                  <th className="p-4 text-center">Party</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <ReservationRow
                    key={reservation.id}
                    reservation={{
                      ...reservation,
                      date: reservation.date.toISOString(),
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
