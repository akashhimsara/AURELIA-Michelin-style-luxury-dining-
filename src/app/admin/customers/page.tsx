import React from "react";
import type { Metadata } from "next";
import { Heading } from "@/components/ui/heading";
import { db } from "@/lib/db";
import { CustomerRow } from "@/features/admin/components/customer-row";
import { calculateLTV } from "@/features/admin/utils/crm";

export const metadata: Metadata = {
  title: "Guest CRM | AURELIA Console",
  description: "Monitor guest stay records, booking frequencies, and lifetime value calculations.",
};

export default async function AdminCustomersPage() {
  let users = await db.user.findMany({
    include: {
      reservations: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Lazy-seed mock luxury CRM profiles if empty to demonstrate functionality
  if (users.length === 0) {
    const totalCount = await db.user.count();
    if (totalCount === 0) {
      let guestRole = await db.role.findUnique({ where: { name: "guest" } });
      if (!guestRole) {
        guestRole = await db.role.create({ data: { name: "guest" } });
      }

      let room = await db.room.findFirst();
      if (!room) {
        room = await db.room.create({
          data: {
            name: "Ocean Presidential Villa",
            description: "A masterwork of architectural luxury.",
            pricePerNight: 850.00,
            capacity: 4,
            imageUrl: "/room-ocean.png",
          },
        });
      }

      // Guest A: Lord Sterling
      const sterling = await db.user.create({
        data: {
          name: "Lord Sterling",
          email: "sterling@belgravia.com",
          phone: "+44 7911 123456",
          roleId: guestRole.id,
        },
      });

      await db.reservation.create({
        data: {
          name: sterling.name,
          email: sterling.email,
          phone: sterling.phone!,
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          guests: 2,
          status: "confirmed",
          roomId: room.id,
          roomRateAtBooking: room.pricePerNight,
          bookedRoomName: room.name,
          finalAmount: room.pricePerNight,
          userId: sterling.id,
        },
      });

      await db.reservation.create({
        data: {
          name: sterling.name,
          email: sterling.email,
          phone: sterling.phone!,
          date: new Date(),
          guests: 4,
          time: "19:00",
          status: "pending",
          userId: sterling.id,
        },
      });

      // Guest B: Lady Alexandra
      const alexandra = await db.user.create({
        data: {
          name: "Lady Alexandra",
          email: "alexandra@mayfair.com",
          phone: "+44 7911 654321",
          roleId: guestRole.id,
        },
      });

      await db.reservation.create({
        data: {
          name: alexandra.name,
          email: alexandra.email,
          phone: alexandra.phone!,
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          guests: 3,
          status: "confirmed",
          roomId: room.id,
          roomRateAtBooking: room.pricePerNight,
          bookedRoomName: room.name,
          finalAmount: room.pricePerNight,
          userId: alexandra.id,
        },
      });

      users = await db.user.findMany({
        include: {
          reservations: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
  }

  // Compile LTV metrics and booking frequencies
  const mappedCustomers = users.map((user) => {
    const totalGuestsCount = user.reservations.reduce((sum, res) => sum + res.guests, 0);
    const ltv = calculateLTV(user.reservations.map((res) => ({
      finalAmount: res.finalAmount ? Number(res.finalAmount) : null,
      guests: res.guests,
    })));

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      totalBookings: user.reservations.length,
      totalGuests: totalGuestsCount,
      lifetimeValue: ltv,
      reservations: user.reservations.map((res) => ({
        id: res.id,
        date: res.date.toISOString(),
        guests: res.guests,
        status: res.status,
        bookedRoomName: res.bookedRoomName,
        finalAmount: res.finalAmount ? Number(res.finalAmount) : null,
        time: res.time,
      })),
    };
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <Heading subtitle>Relationship Intelligence</Heading>
        <Heading as="h1" accent className="tracking-wide">
          Guest Profiles CRM
        </Heading>
        <p className="text-xs text-zinc-500 font-sans mt-1">
          Review customer stay patterns, dining histories, and guest lifetime values.
        </p>
      </div>

      {/* Guest profiles table grid */}
      <div className="border border-gold/15 bg-charcoal/20 rounded-sm overflow-hidden luxury-glass">
        {mappedCustomers.length === 0 ? (
          <div className="text-center py-20 font-sans">
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              No guests found
            </p>
            <p className="text-[10px] text-zinc-600 mt-1 font-light">
              Guest profiles will compile automatically as customers submit booking forms.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gold/15 bg-black/60 text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
                  <th className="p-4 w-4"></th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4 text-center">Total Stays</th>
                  <th className="p-4 text-right">Lifetime LTV</th>
                  <th className="p-4 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {mappedCustomers.map((customer) => (
                  <CustomerRow key={customer.id} customer={customer} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
