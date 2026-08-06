"use client";

import React, { useTransition } from "react";
import { Edit3, Trash2, Sparkles, Wine, Utensils } from "lucide-react";
import { deleteMenuItem, type SerializedMenuItem } from "@/features/admin/actions/restaurant";
import { useRouter } from "next/navigation";

interface MenuGridProps {
  items: SerializedMenuItem[];
  onEdit: (item: SerializedMenuItem) => void;
}

export function MenuGrid({ items, onEdit }: MenuGridProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    startTransition(async () => {
      await deleteMenuItem(id);
      router.refresh();
    });
  };

  if (items.length === 0) {
    return (
      <div className="admin-card rounded-sm border p-12 text-center text-xs opacity-40">
        No culinary items match the selected category.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => {
        const isChefSpecial = item.tags.includes("Chef Special");
        const isWine = item.category === "Wine List" || item.tags.includes("Wine List");

        return (
          <div
            key={item.id}
            className="admin-card rounded-sm border overflow-hidden flex flex-col group hover:shadow-md transition-all duration-200"
          >
            {/* Header Image / Badge */}
            <div className="relative h-40 bg-zinc-950 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Tags Overlay */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                {isChefSpecial && (
                  <span className="bg-purple-500/90 text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm flex items-center gap-1">
                    <Sparkles size={10} /> Chef Special
                  </span>
                )}
                {isWine && (
                  <span className="bg-amber-500/90 text-zinc-950 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm flex items-center gap-1">
                    <Wine size={10} /> Wine List
                  </span>
                )}
              </div>

              {/* Price Tag Overlay */}
              <div className="absolute top-3 right-3">
                <span className="bg-zinc-950/80 backdrop-blur-xs text-amber-400 border border-amber-500/30 font-mono text-xs font-semibold px-2 py-0.5 rounded-sm">
                  £{item.price.toFixed(2)}
                </span>
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white font-semibold text-sm truncate drop-shadow-sm">{item.name}</p>
                <p className="text-amber-400/90 text-[10px] uppercase tracking-widest font-medium">
                  {item.category}
                </p>
              </div>
            </div>

            {/* Description Body */}
            <div className="p-4 flex-1 space-y-3 text-[11px]">
              <p className="opacity-60 leading-relaxed line-clamp-3">{item.description}</p>

              {/* Tag Pill Badges */}
              <div className="flex flex-wrap gap-1 pt-1">
                {item.tags.map((t) => (
                  <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-xs bg-current/5 opacity-70">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Footer */}
            <div className="px-4 py-3 border-t border-current/5 flex items-center justify-between bg-current/2">
              <span className="text-[10px] opacity-40">AUR-MENU</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(item)}
                  className="p-1.5 rounded-sm border border-current/10 hover:border-amber-500/40 hover:text-amber-500 transition-colors"
                  title="Edit Item"
                >
                  <Edit3 size={13} />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  disabled={isPending}
                  className="p-1.5 rounded-sm border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete Item"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
