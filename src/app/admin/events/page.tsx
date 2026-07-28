import React from "react";
import type { Metadata } from "next";
import { Heading } from "@/components/ui/heading";
import { db } from "@/lib/db";
import { EventCatalogForm } from "@/features/admin/components/event-catalog-form";
import { EventCatalogList } from "@/features/admin/components/event-catalog-list";

export const metadata: Metadata = {
  title: "Manage Events | AURELIA Console",
  description: "Create, inspect, and delete event packages in your active inventory.",
};

export default async function AdminEventsPage() {
  const events = await db.event.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const mappedEvents = events.map((ev) => {
    const isValidDate = ev.date && !isNaN(ev.date.getTime());
    const formattedDate = isValidDate ? ev.date.toISOString().split("T")[0] : "Invalid Date";

    return {
      id: ev.id,
      title: ev.title,
      date: formattedDate,
      capacity: String(ev.capacity),
      price: ev.price.toFixed(2),
    };
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <Heading subtitle>Venues & Celebrations</Heading>
        <Heading as="h1" accent className="tracking-wide">
          Event Catalog Manager
        </Heading>
        <p className="text-xs text-zinc-500 font-sans mt-1">
          Deploy new event packages, adjust venue rental rate cards, and manage the current event catalogue.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Creation form */}
        <div className="xl:col-span-1">
          <EventCatalogForm />
        </div>

        {/* Dynamic lists */}
        <div className="xl:col-span-2">
          <EventCatalogList items={mappedEvents} />
        </div>
      </div>
    </div>
  );
}
