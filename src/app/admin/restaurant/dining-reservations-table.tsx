"use client";

import React, { useState, useTransition } from "react";
import { Check, X, UtensilsCrossed, Sparkles, RefreshCw } from "lucide-react";
import { assignTableToReservation, updateDiningReservationStatus, type SerializedDiningReservation } from "@/features/admin/actions/restaurant";
import { useRouter } from "next/navigation";

interface DiningReservationsTableProps {
  reservations: SerializedDiningReservation[];
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "confirmed"
      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      : status === "cancelled"
      ? "bg-red-500/10 text-red-400 border-red-500/20"
      : "bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse";
  return (
    <span className={`text-[9px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded-sm border ${cls}`}>
      {status}
    </span>
  );
}

export function DiningReservationsTable({ reservations }: DiningReservationsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAssignTable = (resId: string, tableNum: number) => {
    startTransition(async () => {
      await assignTableToReservation(resId, tableNum);
      router.refresh();
    });
  };

  const handleStatusChange = (resId: string, status: "confirmed" | "cancelled") => {
    startTransition(async () => {
      await updateDiningReservationStatus(resId, status);
      router.refresh();
    });
  };

  return (
    <div className="admin-card rounded-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] font-sans min-w-[900px]">
          <thead className="border-b border-current/5">
            <tr>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Ref ID</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Guest Details</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Seating Time & Date</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Covers</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Special Requests</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Assign Table</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Status</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-current/5">
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[12px] opacity-40">
                  No dining table reservations recorded.
                </td>
              </tr>
            ) : (
              reservations.map((r) => (
                <tr key={r.id} className="hover:bg-current/3 transition-colors">
                  {/* Ref ID */}
                  <td className="px-4 py-3.5 font-mono text-amber-500 font-medium whitespace-nowrap">
                    AUR-{r.id.slice(0, 8).toUpperCase()}
                  </td>

                  {/* Guest */}
                  <td className="px-4 py-3.5 min-w-[150px]">
                    <p className="font-semibold truncate max-w-[150px]">{r.name}</p>
                    <p className="opacity-40 text-[10px] truncate max-w-[150px]">{r.email}</p>
                  </td>

                  {/* Date & Time */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <p className="font-medium">
                      {new Date(r.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                    <p className="text-[10px] text-amber-500 font-semibold">{r.time ?? "18:30"}</p>
                  </td>

                  {/* Guests */}
                  <td className="px-4 py-3.5 font-mono font-medium">
                    {r.guests} Guests
                  </td>

                  {/* Special Requests */}
                  <td className="px-4 py-3.5 min-w-[160px]">
                    {r.specialRequests ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-sm bg-purple-500/10 border border-purple-500/20 text-purple-400 font-medium">
                        {r.specialRequests}
                      </span>
                    ) : (
                      <span className="opacity-30 text-[10px]">None</span>
                    )}
                  </td>

                  {/* Table Assign */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <select
                      value={r.tableNumber ?? 1}
                      onChange={(e) => handleAssignTable(r.id, Number(e.target.value))}
                      disabled={isPending}
                      className="rounded-sm border border-current/10 bg-transparent px-2 py-1 text-[10px] font-mono outline-none"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          Table #{n}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <StatusBadge status={r.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      {r.status === "pending" && (
                        <button
                          onClick={() => handleStatusChange(r.id, "confirmed")}
                          disabled={isPending}
                          title="Confirm Booking"
                          className="p-1.5 rounded-sm border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-zinc-950 transition-colors"
                        >
                          <Check size={12} />
                        </button>
                      )}
                      {r.status !== "cancelled" && (
                        <button
                          onClick={() => handleStatusChange(r.id, "cancelled")}
                          disabled={isPending}
                          title="Cancel Booking"
                          className="p-1.5 rounded-sm border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
