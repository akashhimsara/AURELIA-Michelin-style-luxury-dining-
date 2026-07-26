"use client";

import React, { useState, useTransition } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createMenuItem } from "../actions/menu";

export function MenuForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const category = formData.get("category") as string;
    const image = formData.get("image") as string;
    const tagsStr = formData.get("tags") as string;

    if (!name || !description || !priceStr || !category || !image) {
      setError("Please fill out all required fields.");
      return;
    }

    const price = parseFloat(priceStr);
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    const tags = tagsStr ? tagsStr.split(",").map((t) => t.trim()).filter(Boolean) : [];

    startTransition(async () => {
      const result = await createMenuItem({
        name,
        description,
        price,
        category,
        image,
        tags,
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
        Add New Culinary Creation
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
            Dish Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2 text-xs text-zinc-200 font-sans font-light rounded-sm"
            placeholder="E.g., Smoked Venison Tartare"
          />
        </div>

        {/* Price */}
        <div className="space-y-1.5">
          <label htmlFor="price" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
            Price (&pound;) *
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            required
            className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2 text-xs text-zinc-200 font-sans font-light rounded-sm"
            placeholder="34.00"
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label htmlFor="category" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
            Category *
          </label>
          <select
            id="category"
            name="category"
            required
            className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2 text-xs text-zinc-200 font-sans font-light rounded-sm appearance-none cursor-pointer"
          >
            <option value="Appetizer">Appetizer</option>
            <option value="Main Course">Main Course</option>
            <option value="Dessert">Dessert</option>
            <option value="Cocktail">Cocktail</option>
          </select>
        </div>

        {/* Image URL */}
        <div className="space-y-1.5 col-span-1 sm:col-span-2">
          <label htmlFor="image" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
            Image Asset URL *
          </label>
          <input
            id="image"
            name="image"
            type="text"
            required
            defaultValue="/menu-halibut.png"
            className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2 text-xs text-zinc-200 font-sans font-light rounded-sm"
          />
        </div>

        {/* Tags */}
        <div className="space-y-1.5 col-span-1 sm:col-span-2">
          <label htmlFor="tags" className="block text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
            Tags (Comma Separated)
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2 text-xs text-zinc-200 font-sans font-light rounded-sm"
            placeholder="Signature, Foraged, Organic"
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
            className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2 text-xs text-zinc-200 font-sans font-light rounded-sm resize-none"
            placeholder="A description of the sensory flavors, cooking parameters, and culinary heritage..."
          />
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          className="w-full flex items-center justify-center gap-1.5 text-xs py-2"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <RefreshCw size={12} className="animate-spin" /> Adding...
            </>
          ) : (
            <>
              <Plus size={12} /> Add to Catalog
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
