"use client";

import React, { useState, useTransition } from "react";
import {
  Check, X, Eye, ChevronUp, ChevronDown, ChevronsUpDown,
  BedDouble, UtensilsCrossed, Sparkles, Heart,
  RefreshCw, CheckCircle2, AlertCircle,
} from "lucide-react";
import { approveReservation, cancelReservation } from "@/features/admin/actions/reservations";
import type { SerializedReservation } from "@/features/admin/actions/reservations";
import { useRouter } from "next/navigation";

interface ReservationsTableProps {
  reservations: SerializedReservation[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onPageChange: (p: number) => void;
  onSort: (field: string) => void;
  sortBy: string;
  sortDir: string;
  onOpenDetail: (id: string) => void;
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  room:    <BedDouble size={11} />,
  dining:  <UtensilsCrossed size={11} />,
  spa:     <Sparkles size={11} />,
  wedding: <Heart size={11} />,
};
const TYPE_STYLE: Record<string, string> = {
  room:    "bg-sky-500/10 text-sky-500 border-sky-500/20",
  dining:  "bg-amber-500/10 text-amber-500 border-amber-500/20",
  spa:     "bg-pink-500/10 text-pink-500 border-pink-500/20",
  wedding: "bg-violet-500/10 text-violet-500 border-violet-500/20",
};

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

function PaymentBadge({ status }: { status: string }) {
  const cls =
    status === "paid"
      ? "text-emerald-500"
      : status === "refunded"
      ? "text-violet-500"
      : "text-amber-500";
  return <span className={`text-[10px] font-medium ${cls}`}>{status}</span>;
}

function SortIcon({ field, sortBy, sortDir }: { field: string; sortBy: string; sortDir: string }) {
  if (sortBy !== field) return <ChevronsUpDown size={10} className="opacity-30" />;
  return sortDir === "asc" ? <ChevronUp size={10} className="text-amber-500" /> : <ChevronDown size={10} className="text-amber-500" />;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" });
}

function calcNights(checkIn: string, checkOut: string | null) {
  if (!checkOut) return null;
  const n = Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
  return n > 0 ? n : null;
}

export function ReservationsTable({
  reservations, total, page, pageSize, totalPages,
  selectedIds, onSelectToggle, onSelectAll, onClearAll,
  onPageChange, onSort, sortBy, sortDir, onOpenDetail,
}: ReservationsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const allOnPageSelected = reservations.every((r) => selectedIds.includes(r.id));

  const handleAction = (id: string, fn: (id: string) => Promise<{ success: boolean; message?: string }>) => {
    setActionError(null);
    setLoadingId(id);
    startTransition(async () => {
      const res = await fn(id);
      setLoadingId(null);
      if (res.success) {
        router.refresh();
      } else {
        setActionError(res.message ?? "Action failed.");
      }
    });
  };

  const SortTh = ({ field, label, className = "" }: { field: string; label: string; className?: string }) => (
    <th
      className={`px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 cursor-pointer hover:opacity-80 select-none ${className}`}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label} <SortIcon field={field} sortBy={sortBy} sortDir={sortDir} />
      </div>
    </th>
  );

  return (
    <div className="space-y-3">
      {actionError && (
        <div className="flex items-center gap-2 px-4 py-2.5 text-[11px] bg-red-500/10 border border-red-500/20 text-red-400 rounded-sm">
          <AlertCircle size={13} /> {actionError}
        </div>
      )}

      {/* Hidden print table for PDF export */}
      <div id="reservations-print-table" className="hidden print:block">
        <h1 className="text-xl font-bold mb-2">AURELIA — Reservation Report</h1>
        <p className="text-xs mb-4">{new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</p>
        <table>
          <thead>
            <tr>
              <th>Ref ID</th><th>Guest</th><th>Type</th><th>Arrangement</th>
              <th>Date</th><th>Amount</th><th>Payment</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id}>
                <td>AUR-{r.id.slice(0, 8).toUpperCase()}</td>
                <td>{r.name}</td>
                <td>{r.type}</td>
                <td>{r.bookedRoomName ?? "Dining"}</td>
                <td>{formatDate(r.date)}</td>
                <td>{r.finalAmount ? `£${r.finalAmount.toFixed(2)}` : "—"}</td>
                <td>{r.paymentStatus}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card rounded-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] font-sans min-w-[900px]">
            <thead className="border-b border-current/5">
              <tr>
                {/* Checkbox */}
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected && reservations.length > 0}
                    onChange={allOnPageSelected ? onClearAll : onSelectAll}
                    className="rounded-sm accent-amber-500 cursor-pointer"
                    aria-label="Select all on page"
                  />
                </th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Ref ID</th>
                <SortTh field="name" label="Guest" />
                <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Type</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Arrangement</th>
                <SortTh field="date" label="Schedule" />
                <SortTh field="amount" label="Amount" />
                <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Payment</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Status</th>
                <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-current/5">
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-[12px] opacity-40">
                    {isPending ? (
                      <RefreshCw size={18} className="animate-spin mx-auto" />
                    ) : (
                      "No reservations match your filters."
                    )}
                  </td>
                </tr>
              ) : (
                reservations.map((r) => {
                  const nights = calcNights(r.date, r.checkOutDate);
                  const isLoading = loadingId === r.id;

                  return (
                    <tr
                      key={r.id}
                      className={`transition-colors hover:bg-current/3 cursor-pointer ${
                        selectedIds.includes(r.id) ? "bg-amber-500/3" : ""
                      }`}
                      onClick={(e) => {
                        // Don't open drawer if clicking checkbox or action buttons
                        if ((e.target as HTMLElement).closest("button, input")) return;
                        onOpenDetail(r.id);
                      }}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(r.id)}
                          onChange={() => onSelectToggle(r.id)}
                          className="rounded-sm accent-amber-500 cursor-pointer"
                          aria-label={`Select reservation ${r.name}`}
                        />
                      </td>

                      {/* Ref ID */}
                      <td className="px-4 py-3.5 font-mono text-amber-500 font-medium whitespace-nowrap">
                        AUR-{r.id.slice(0, 8).toUpperCase()}
                      </td>

                      {/* Guest */}
                      <td className="px-4 py-3.5 min-w-[140px]">
                        <p className="font-semibold truncate max-w-[140px]">{r.name}</p>
                        <p className="opacity-40 truncate max-w-[140px]">{r.email}</p>
                        {r.phone && <p className="opacity-30 text-[10px]">{r.phone}</p>}
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm border capitalize ${TYPE_STYLE[r.type] ?? "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
                          {TYPE_ICON[r.type]}
                          {r.type}
                        </span>
                      </td>

                      {/* Arrangement */}
                      <td className="px-4 py-3.5 min-w-[140px]">
                        <p className="font-medium truncate max-w-[140px]">{r.bookedRoomName ?? (r.type === "dining" ? "Fine Dining Table" : "—")}</p>
                        <p className="opacity-40 text-[10px]">{r.guests} adults{r.children > 0 ? `, ${r.children} ch.` : ""}</p>
                      </td>

                      {/* Schedule */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <p className="font-medium">{formatDate(r.date)}</p>
                        {r.checkOutDate && (
                          <p className="opacity-40 text-[10px]">
                            Out: {formatDate(r.checkOutDate)}{nights ? ` · ${nights}N` : ""}
                          </p>
                        )}
                        {r.time && <p className="opacity-40 text-[10px]">{r.time}</p>}
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3.5 font-mono font-semibold whitespace-nowrap">
                        {r.finalAmount ? `£${r.finalAmount.toLocaleString("en-GB", { minimumFractionDigits: 2 })}` : "—"}
                      </td>

                      {/* Payment */}
                      <td className="px-4 py-3.5">
                        <PaymentBadge status={r.paymentStatus} />
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={r.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1 justify-end">
                          {/* View detail */}
                          <button
                            id={`view-btn-${r.id.slice(0, 8)}`}
                            onClick={() => onOpenDetail(r.id)}
                            title="View Details"
                            className="p-1.5 rounded-sm border border-current/10 hover:border-amber-500/40 hover:text-amber-500 transition-colors"
                          >
                            <Eye size={12} />
                          </button>

                          {/* Approve (only pending) */}
                          {r.status === "pending" && (
                            <button
                              id={`approve-btn-${r.id.slice(0, 8)}`}
                              onClick={() => handleAction(r.id, approveReservation)}
                              disabled={isLoading || isPending}
                              title="Approve"
                              className="p-1.5 rounded-sm border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-zinc-950 transition-colors disabled:opacity-40"
                            >
                              {isLoading ? <RefreshCw size={12} className="animate-spin" /> : <Check size={12} />}
                            </button>
                          )}
                          {/* Confirmed check */}
                          {r.status === "confirmed" && (
                            <span className="p-1.5 text-emerald-500 opacity-60" title="Confirmed">
                              <CheckCircle2 size={12} />
                            </span>
                          )}

                          {/* Cancel (pending or confirmed) */}
                          {r.status !== "cancelled" && (
                            <button
                              id={`cancel-btn-${r.id.slice(0, 8)}`}
                              onClick={() => handleAction(r.id, cancelReservation)}
                              disabled={isLoading || isPending}
                              title="Cancel"
                              className="p-1.5 rounded-sm border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-40"
                            >
                              {isLoading ? <RefreshCw size={12} className="animate-spin" /> : <X size={12} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-current/5">
          <p className="text-[11px] opacity-50">
            Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, total)} of {total} reservations
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-2 py-1 text-[11px] rounded-sm border border-current/10 disabled:opacity-30 hover:border-current/30 transition-colors"
            >
              ← Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`w-7 h-7 text-[11px] rounded-sm border transition-colors ${
                    p === page
                      ? "bg-amber-500 border-amber-500 text-zinc-950 font-semibold"
                      : "border-current/10 hover:border-current/30"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-2 py-1 text-[11px] rounded-sm border border-current/10 disabled:opacity-30 hover:border-current/30 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
