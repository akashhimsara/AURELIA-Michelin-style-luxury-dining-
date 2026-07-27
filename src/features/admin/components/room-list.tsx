"use client";

import React, { useTransition, useState } from "react";
import { Trash2, Loader2, Users } from "lucide-react";
import { deleteRoom } from "../actions/rooms";

interface RoomItem {
  id: string;
  name: string;
  pricePerNight: string;
  capacity: number;
}

interface RoomListProps {
  items: RoomItem[];
}

export function RoomList({ items }: RoomListProps) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this suite from active inventory?")) {
      return;
    }
    setDeletingId(id);
    startTransition(async () => {
      await deleteRoom(id);
      setDeletingId(null);
    });
  };

  return (
    <div className="border border-gold/15 bg-charcoal/20 rounded-sm overflow-hidden luxury-glass">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-gold/15 bg-black/60 text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
            <th className="p-4">Suite</th>
            <th className="p-4">Max Guests</th>
            <th className="p-4">Rate Per Night</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-8 text-center text-xs text-zinc-500 font-sans">
                No active suites in inventory
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="border-b border-gold/5 hover:bg-gold/2 text-xs font-sans text-zinc-300 font-light">
                <td className="p-4 font-medium text-zinc-200">{item.name}</td>
                <td className="p-4 font-mono">
                  <span className="flex items-center gap-1">
                    <Users size={12} className="text-gold/60" /> {item.capacity} guests
                  </span>
                </td>
                <td className="p-4 font-mono">&pound;{item.pricePerNight}</td>
                <td className="p-4 text-right">
                  {isPending && deletingId === item.id ? (
                    <div className="flex justify-end pr-4">
                      <Loader2 size={12} className="animate-spin text-gold" />
                    </div>
                  ) : (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 border border-red-500/20 bg-red-950/10 text-red-400 hover:bg-red-950/30 transition-colors outline-none cursor-pointer"
                      title="Delete Suite Profile"
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
