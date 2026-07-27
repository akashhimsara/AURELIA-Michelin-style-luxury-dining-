"use client";

import React, { useTransition, useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteMenuItem } from "../actions/menu";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: string;
}

interface MenuListProps {
  items: MenuItem[];
}

export function MenuList({ items }: MenuListProps) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      setDeletingId(id);
      startTransition(async () => {
        await deleteMenuItem(id);
        setDeletingId(null);
      });
    }
  };

  return (
    <div className="border border-gold/15 bg-charcoal/20 rounded-sm overflow-hidden luxury-glass">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-gold/15 bg-black/60 text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
            <th className="p-4">Dish</th>
            <th className="p-4">Category</th>
            <th className="p-4">Price</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-gold/5 hover:bg-gold/2 text-xs font-sans text-zinc-300 font-light">
              <td className="p-4 font-medium text-zinc-200">{item.name}</td>
              <td className="p-4">{item.category}</td>
              <td className="p-4 font-mono">&pound;{item.price}</td>
              <td className="p-4 text-right">
                {isPending && deletingId === item.id ? (
                  <div className="flex justify-end pr-4">
                    <Loader2 size={12} className="animate-spin text-gold" />
                  </div>
                ) : (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 border border-red-500/20 bg-red-950/10 text-red-400 hover:bg-red-950/30 transition-colors outline-none cursor-pointer"
                    title="Delete Menu Item"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
