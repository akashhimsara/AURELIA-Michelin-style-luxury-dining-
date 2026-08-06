"use client";

import React, { useState, useTransition, useEffect } from "react";
import { X, Save, Loader2, Utensils, Image as ImageIcon } from "lucide-react";
import { createMenuItem, updateMenuItem, type SerializedMenuItem } from "@/features/admin/actions/restaurant";
import { useRouter } from "next/navigation";

interface MenuFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: SerializedMenuItem | null;
  restaurantId: string;
}

const CATEGORIES = ["Appetizer", "Main Course", "Dessert", "Cocktail", "Wine List"];

const TAG_OPTIONS = [
  "Chef Special",
  "Wine List",
  "Sommelier Reserve",
  "Signature",
  "Gluten-Free",
  "Vegan",
];

const PRESET_IMAGES = [
  { label: "Culinary Dish", url: "/hero-bg.png" },
  { label: "Wine Bottle", url: "/hero-bg.png" },
];

export function MenuFormModal({
  isOpen,
  onClose,
  itemToEdit,
  restaurantId,
}: MenuFormModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Appetizer");
  const [price, setPrice] = useState<number>(32);
  const [image, setImage] = useState("/hero-bg.png");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setCategory(itemToEdit.category);
      setPrice(itemToEdit.price);
      setImage(itemToEdit.image);
      setDescription(itemToEdit.description);
      setSelectedTags(itemToEdit.tags ?? []);
    } else {
      setName("");
      setCategory("Appetizer");
      setPrice(35);
      setImage("/hero-bg.png");
      setDescription("");
      setSelectedTags([]);
    }
    setFeedback(null);
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || price <= 0) return;

    setFeedback(null);
    startTransition(async () => {
      let res;
      if (itemToEdit) {
        res = await updateMenuItem(itemToEdit.id, {
          name,
          category,
          price,
          image,
          description,
          tags: selectedTags,
        });
      } else {
        res = await createMenuItem({
          restaurantId,
          name,
          category,
          price,
          image,
          description,
          tags: selectedTags,
        });
      }

      if (res.success) {
        router.refresh();
        onClose();
      } else {
        setFeedback(res.message || "Failed to save culinary item.");
      }
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="admin-card border rounded-sm w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-current/5">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Utensils size={16} className="text-amber-500" />
              {itemToEdit ? "Edit Culinary & Wine Item" : "New Menu Entry"}
            </h2>
            <button onClick={onClose} className="p-1 opacity-50 hover:opacity-100 transition-opacity">
              <X size={16} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-[12px]">
            {feedback && (
              <div className="p-2.5 rounded-sm bg-red-500/10 border border-red-500/20 text-red-400">
                {feedback}
              </div>
            )}

            {/* Item Name */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">
                Item Title
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Wagyu A5 Fillet / Château Margaux 2015"
                className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none focus:border-amber-500/40"
              />
            </div>

            {/* Category & Price Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-sm border border-current/10 bg-transparent px-2 py-2 outline-none focus:border-amber-500/40"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">
                  Price (£)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  step={0.5}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none focus:border-amber-500/40 font-mono font-medium"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">
                Ingredients & Sommelier Tasting Notes
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail ingredients, culinary preparation, region, or vintage notes..."
                className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none focus:border-amber-500/40 resize-none"
              />
            </div>

            {/* Image Selection */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium flex items-center gap-1">
                <ImageIcon size={12} /> Image URL
              </label>
              <input
                type="text"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/hero-bg.png"
                className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none focus:border-amber-500/40 font-mono text-[11px]"
              />
            </div>

            {/* Tag Badges */}
            <div className="space-y-2 pt-2 border-t border-current/5">
              <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">
                Tags & Classifications
              </label>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map((tag) => {
                  const isChecked = selectedTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-sm border text-[11px] transition-colors ${
                        isChecked
                          ? "bg-amber-500/20 border-amber-500/40 text-amber-500 font-medium"
                          : "border-current/10 opacity-50 hover:opacity-100"
                      }`}
                    >
                      {isChecked ? "✓ " : ""}{tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-sm border border-current/10 text-xs opacity-70 hover:opacity-100 transition-opacity"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 py-2 rounded-sm bg-amber-500 text-zinc-950 font-semibold text-xs hover:bg-amber-400 disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
              >
                {isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {itemToEdit ? "Update Item" : "Create Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
