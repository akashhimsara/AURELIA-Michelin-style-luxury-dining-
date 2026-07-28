"use client";

import React, { useState, useTransition } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createEvent } from "../actions/events";

export function EventCatalogForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    const title = formData.get("title") as string;
    const dateStr = formData.get("dateStr") as string;
    const priceStr = formData.get("price") as string;
    const capacityStr = formData.get("capacity") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const description = formData.get("description") as string;

    if (!title || !dateStr || !priceStr || !capacityStr || !imageUrl || !description) {
      setError("Please fill out all required fields.");
      return;
    }

    const price = parseFloat(priceStr);
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid rate price.");
      return;
    }

    const capacity = parseInt(capacityStr, 10);
    if (isNaN(capacity) || capacity <= 0) {
      setError("Please enter a valid guest capacity.");
      return;
    }

    startTransition(async () => {
      const result = await createEvent({
        title,
        description,
        dateStr,
        price,
        capacity,
        imageUrl,
      });

      if (result.error) {
        setError(result.error);
      } else {
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border border-gold/15 bg-charcoal/40 rounded-sm luxury-glass space-y-4">
      <h3 className="text-xs uppercase tracking-widest text-gold font-sans font-medium mb-2">
        Deploy Event Package
      </h3>

      {error && (
        <div className="p-2 border border-red-500/20 bg-red-950/20 text-red-400 text-[10px] font-sans text-center rounded-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Title */}
        <div className="space-y-1.5 col-span-1 sm:col-span-2">
          <label htmlFor="title" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
            Event Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm"
            placeholder="e.g. Imperial Pavilion Ceremony"
          />
        </div>

        {/* Date */}
        <div className="space-y-1.5">
          <label htmlFor="dateStr" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
            Launch/Target Date *
          </label>
          <input
            id="dateStr"
            name="dateStr"
            type="date"
            required
            defaultValue={new Date().toISOString().split("T")[0]}
            className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm scheme-dark"
          />
        </div>

        {/* Guest Capacity */}
        <div className="space-y-1.5">
          <label htmlFor="capacity" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
            Max Guest Capacity *
          </label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            required
            className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm"
            placeholder="300"
          />
        </div>

        {/* Rate Price */}
        <div className="space-y-1.5">
          <label htmlFor="price" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
            Rate Price (&pound;) *
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            required
            className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm"
            placeholder="12000.00"
          />
        </div>

        {/* Image URL */}
        <div className="space-y-1.5">
          <label htmlFor="imageUrl" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
            Image Asset URL *
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            required
            defaultValue="/event-wedding.png"
            className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5 col-span-1 sm:col-span-2">
          <label htmlFor="description" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
            Event Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            required
            className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm resize-none"
            placeholder="An open-air garden sanctuary featuring manicured flower borders, white drapes, and customized floral arches..."
          />
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          className="w-full flex items-center justify-center gap-1.5 text-xs py-2.5"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <RefreshCw size={12} className="animate-spin" /> Adding Event...
            </>
          ) : (
            <>
              <Plus size={12} /> Add Event to Catalog
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
