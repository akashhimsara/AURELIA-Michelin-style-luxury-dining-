"use client";

import React, { useTransition } from "react";
import { CheckCircle2, XCircle, Download, X, Loader2 } from "lucide-react";
import { bulkUpdateStatus } from "@/features/admin/actions/reservations";
import { useRouter } from "next/navigation";
import type { SerializedReservation } from "@/features/admin/actions/reservations";
import { exportToCSV } from "./export-utils";

interface BulkActionsBarProps {
  selectedIds: string[];
  reservations: SerializedReservation[];
  onDeselect: () => void;
}

export function BulkActionsBar({ selectedIds, reservations, onDeselect }: BulkActionsBarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (selectedIds.length === 0) return null;

  const selectedItems = reservations.filter((r) => selectedIds.includes(r.id));

  const handleBulkApprove = () => {
    startTransition(async () => {
      await bulkUpdateStatus(selectedIds, "confirmed");
      onDeselect();
      router.refresh();
    });
  };

  const handleBulkCancel = () => {
    startTransition(async () => {
      await bulkUpdateStatus(selectedIds, "cancelled");
      onDeselect();
      router.refresh();
    });
  };

  const handleExport = () => {
    exportToCSV(selectedItems, `aurelia-selected-${Date.now()}`);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 admin-card border rounded-sm shadow-2xl px-4 py-2.5 text-[12px]">
      {isPending ? (
        <Loader2 size={14} className="animate-spin text-amber-500" />
      ) : (
        <span className="font-semibold text-amber-500">{selectedIds.length} selected</span>
      )}

      <div className="w-px h-4 bg-current/10" />

      <button
        onClick={handleBulkApprove}
        disabled={isPending}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
      >
        <CheckCircle2 size={12} /> Approve All
      </button>

      <button
        onClick={handleBulkCancel}
        disabled={isPending}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
      >
        <XCircle size={12} /> Cancel All
      </button>

      <button
        onClick={handleExport}
        disabled={isPending}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-sky-500/10 text-sky-500 border border-sky-500/20 hover:bg-sky-500/20 transition-colors"
      >
        <Download size={12} /> Export CSV
      </button>

      <div className="w-px h-4 bg-current/10" />

      <button
        onClick={onDeselect}
        className="opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Deselect all"
      >
        <X size={14} />
      </button>
    </div>
  );
}
