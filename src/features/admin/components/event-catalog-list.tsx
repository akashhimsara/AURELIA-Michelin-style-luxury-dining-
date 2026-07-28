"use client";

import React, { useTransition, useState } from "react";
import { Trash2, Loader2, Calendar, Users } from "lucide-react";
import { deleteEvent } from "../actions/events";

interface EventPackageItem {
  id: string;
  title: string;
  date: string;
  capacity: string;
  price: string;
}

interface EventCatalogListProps {
  items: EventPackageItem[];
}

export function EventCatalogList({ items }: EventCatalogListProps) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this event package from active catalog?")) {
      return;
    }
    setDeletingId(id);
    startTransition(async () => {
      await deleteEvent(id);
      setDeletingId(null);
    });
  };

  return (
    <div className="border border-gold/15 bg-charcoal/20 rounded-sm overflow-hidden luxury-glass">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-gold/15 bg-black/60 text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
            <th className="p-4">Event Package</th>
            <th className="p-4">Launch Date</th>
            <th className="p-4">Capacity</th>
            <th className="p-4">Rate Price</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-8 text-center text-xs text-zinc-500 font-sans">
                No active event packages in catalog
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="border-b border-gold/5 hover:bg-gold/2 text-xs font-sans text-zinc-300 font-light transition-colors">
                <td className="p-4 font-medium text-zinc-200">{item.title}</td>
                <td className="p-4 font-mono text-[11px]">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <Calendar size={12} className="text-gold/60" /> {item.date}
                  </span>
                </td>
                <td className="p-4 font-mono text-[11px]">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <Users size={12} className="text-gold/60" /> {item.capacity} Guests
                  </span>
                </td>
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
                      title="Delete Event Package"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
