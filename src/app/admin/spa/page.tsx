import React from "react";
import type { Metadata } from "next";
import { Heading } from "@/components/ui/heading";
import { db } from "@/lib/db";
import { SpaCatalogForm } from "@/features/admin/components/spa-catalog-form";
import { SpaCatalogList } from "@/features/admin/components/spa-catalog-list";

export const metadata: Metadata = {
  title: "Manage Spa | AURELIA Console",
  description: "Create, inspect, and delete spa therapies in your active inventory.",
};

export default async function AdminSpaPage() {
  const therapies = await db.spa.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const mappedTherapies = therapies.map((tp) => ({
    id: tp.id,
    name: tp.name,
    duration: tp.duration,
    price: tp.price.toFixed(2),
  }));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <Heading subtitle>Wellness Management</Heading>
        <Heading as="h1" accent className="tracking-wide">
          Spa Catalog Manager
        </Heading>
        <p className="text-xs text-zinc-500 font-sans mt-1">
          Deploy new wellness therapies, adjust session rate cards, and manage the current wellness catalogue.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Creation form */}
        <div className="xl:col-span-1">
          <SpaCatalogForm />
        </div>

        {/* Dynamic lists */}
        <div className="xl:col-span-2">
          <SpaCatalogList items={mappedTherapies} />
        </div>
      </div>
    </div>
  );
}
