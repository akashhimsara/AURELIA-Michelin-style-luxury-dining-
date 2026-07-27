"use client";

import React, { useState, useTransition } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createRoom } from "../actions/rooms";

export function RoomForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const capacityStr = formData.get("capacity") as string;
    const imageUrl = formData.get("imageUrl") as string;

    if (!name || !description || !priceStr || !capacityStr || !imageUrl) {
      setError("Please fill out all required fields.");
      return;
    }

    const pricePerNight = parseFloat(priceStr);
    const capacity = parseInt(capacityStr);

    if (isNaN(pricePerNight) || pricePerNight <= 0) {
      setError("Please enter a valid rate per night.");
      return;
    }

    if (isNaN(capacity) || capacity <= 0) {
      setError("Please enter a valid guest capacity.");
      return;
    }

    startTransition(async () => {
      const result = await createRoom({
        name,
        description,
        pricePerNight,
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
        Deploy New Luxury Suite
      </h3>

      {error && (
        <div className="p-2 border border-red-500/20 bg-red-950/20 text-red-400 text-[10px] font-sans text-center rounded-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-1.5 col-span-1 sm:col-span-2">
          <label htmlFor="name" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
            Suite Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm"
            placeholder="E.g., Imperial Penthouse Suite"
          />
        </div>

        {/* Rate per Night */}
        <div className="space-y-1.5">
          <label htmlFor="price" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
            Rate Per Night (&pound;) *
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            required
            className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm"
            placeholder="950.00"
          />
        </div>

        {/* Capacity */}
        <div className="space-y-1.5">
          <label htmlFor="capacity" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
            Max Guests Capacity *
          </label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            required
            className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm"
            placeholder="4"
          />
        </div>

        {/* Image URL */}
        <div className="space-y-1.5 col-span-1 sm:col-span-2">
          <label htmlFor="imageUrl" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
            Image Asset URL *
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            required
            defaultValue="/room-ocean.png"
            className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5 col-span-1 sm:col-span-2">
          <label htmlFor="description" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            required
            className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm resize-none"
            placeholder="A description of the layout configurations, panoramic views, and bespoke styling..."
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
              <RefreshCw size={12} className="animate-spin" /> Adding Suite...
            </>
          ) : (
            <>
              <Plus size={12} /> Add Suite to Inventory
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
