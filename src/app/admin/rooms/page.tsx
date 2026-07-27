import React from "react";
import type { Metadata } from "next";
import { Heading } from "@/components/ui/heading";
import { db } from "@/lib/db";
import { RoomForm } from "@/features/admin/components/room-form";
import { RoomList } from "@/features/admin/components/room-list";

export const metadata: Metadata = {
  title: "Manage Suites | AURELIA Console",
  description: "Create, inspect, and delete room profiles in your active inventory.",
};

export default async function AdminRoomsPage() {
  const rooms = await db.room.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const mappedRooms = rooms.map((room) => ({
    id: room.id,
    name: room.name,
    capacity: room.capacity,
    pricePerNight: room.pricePerNight.toFixed(2),
  }));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <Heading subtitle>Operational Management</Heading>
        <Heading as="h1" accent className="tracking-wide">
          Suites Catalog Manager
        </Heading>
        <p className="text-xs text-zinc-500 font-sans mt-1">
          Deploy new guest suites, configure seasonal rates, and manage the current lodging catalog.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Creation form */}
        <div className="xl:col-span-1">
          <RoomForm />
        </div>

        {/* Dynamic lists */}
        <div className="xl:col-span-2">
          <RoomList items={mappedRooms} />
        </div>
      </div>
    </div>
  );
}
