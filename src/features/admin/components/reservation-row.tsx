"use client";

import React, { useTransition } from "react";
import { Check, X, Trash2, Loader2, Edit2 } from "lucide-react";
import { updateReservationStatus, deleteReservation } from "../actions/reservations";

interface ReservationRowProps {
  reservation: {
    id: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string | null;
    guests: number;
    status: string;
    roomId: string | null;
  };
  onEdit: (reservation: any) => void;
}

export function ReservationRow({ reservation, onEdit }: ReservationRowProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status: string) => {
    startTransition(async () => {
      await updateReservationStatus(reservation.id, status);
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this reservation?")) {
      startTransition(async () => {
        await deleteReservation(reservation.id);
      });
    }
  };

  return (
    <tr className="border-b border-gold/5 hover:bg-gold/2 text-xs font-sans text-zinc-300 font-light">
      <td className="p-4 font-medium text-zinc-200">{reservation.name}</td>
      <td className="p-4">{reservation.email}</td>
      <td className="p-4 font-mono">{reservation.phone}</td>
      <td className="p-4">
        {new Date(reservation.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td className="p-4 font-medium">
        {reservation.roomId ? `Suite: ${reservation.roomId.slice(0, 8).toUpperCase()}` : reservation.time || "Full Day"}
      </td>
      <td className="p-4 text-center">{reservation.guests}</td>
      <td className="p-4">
        <span
          className={`inline-block px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-semibold rounded-none ${
            reservation.status === "confirmed"
              ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20"
              : reservation.status === "cancelled"
              ? "bg-red-950/40 text-red-400 border border-red-500/20"
              : "bg-amber-950/40 text-amber-400 border border-amber-500/20"
          }`}
        >
          {reservation.status}
        </span>
      </td>
      <td className="p-4 text-right font-sans">
        {isPending ? (
          <div className="flex justify-end pr-4">
            <Loader2 size={14} className="animate-spin text-gold" />
          </div>
        ) : (
          <div className="flex justify-end gap-2">
            <button
              onClick={() => onEdit(reservation)}
              className="p-1 border border-gold/20 bg-gold/5 text-gold hover:bg-gold/20 transition-colors outline-none cursor-pointer"
              title="Reschedule / Edit Booking"
            >
              <Edit2 size={12} />
            </button>
            {reservation.status !== "confirmed" && (
              <button
                onClick={() => handleStatusChange("confirmed")}
                className="p-1 border border-emerald-500/20 bg-emerald-950/10 text-emerald-400 hover:bg-emerald-950/30 transition-colors outline-none cursor-pointer"
                title="Confirm Reservation"
              >
                <Check size={12} />
              </button>
            )}
            {reservation.status !== "cancelled" && (
              <button
                onClick={() => handleStatusChange("cancelled")}
                className="p-1 border border-amber-500/20 bg-amber-950/10 text-amber-400 hover:bg-amber-950/30 transition-colors outline-none cursor-pointer"
                title="Cancel Reservation"
              >
                <X size={12} />
              </button>
            )}
            <button
              onClick={handleDelete}
              className="p-1 border border-red-500/20 bg-red-950/10 text-red-400 hover:bg-red-950/30 transition-colors outline-none cursor-pointer"
              title="Delete Reservation"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
