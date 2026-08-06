"use client";

import React from "react";
import { Eye, Receipt, ChevronUp, ChevronDown, ChevronsUpDown, RotateCcw } from "lucide-react";
import type { SerializedTransaction } from "@/features/admin/actions/finance";

interface PaymentsTableProps {
  transactions: SerializedTransaction[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onSort: (field: string) => void;
  sortBy: string;
  sortDir: string;
  onSelectTransaction: (txn: SerializedTransaction) => void;
  onOpenRefund: (txn: SerializedTransaction) => void;
}

function StatusBadge({ status }: { status: SerializedTransaction["paymentStatus"] }) {
  const cls =
    status === "paid"
      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      : status === "refunded"
      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
      : "bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse";
  return (
    <span className={`text-[9px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded-sm border ${cls}`}>
      {status}
    </span>
  );
}

function SortIcon({ field, sortBy, sortDir }: { field: string; sortBy: string; sortDir: string }) {
  if (sortBy !== field) return <ChevronsUpDown size={10} className="opacity-30" />;
  return sortDir === "asc" ? <ChevronUp size={10} className="text-amber-500" /> : <ChevronDown size={10} className="text-amber-500" />;
}

export function PaymentsTable({
  transactions,
  total,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onSort,
  sortBy,
  sortDir,
  onSelectTransaction,
  onOpenRefund,
}: PaymentsTableProps) {
  const SortTh = ({ field, label }: { field: string; label: string }) => (
    <th
      className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 cursor-pointer hover:opacity-80 select-none text-left"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label} <SortIcon field={field} sortBy={sortBy} sortDir={sortDir} />
      </div>
    </th>
  );

  return (
    <div className="admin-card rounded-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] font-sans min-w-[950px]">
          <thead className="border-b border-current/5">
            <tr>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Txn Ref</th>
              <SortTh field="name" label="Guest" />
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Category & Description</th>
              <SortTh field="date" label="Date" />
              <SortTh field="gross" label="Gross (£)" />
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Net / 20% VAT</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Status</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-right">Invoice / Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-current/5">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[12px] opacity-40">
                  No payment transactions match criteria.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => onSelectTransaction(t)}
                  className="transition-colors hover:bg-current/3 cursor-pointer"
                >
                  {/* Transaction Ref */}
                  <td className="px-4 py-3.5 font-mono text-amber-500 font-medium whitespace-nowrap">
                    {t.transactionRef}
                  </td>

                  {/* Guest */}
                  <td className="px-4 py-3.5 min-w-[150px]">
                    <p className="font-semibold truncate max-w-[150px]">{t.guestName}</p>
                    <p className="opacity-40 text-[10px] truncate max-w-[150px]">{t.guestEmail}</p>
                  </td>

                  {/* Description & Type */}
                  <td className="px-4 py-3.5 min-w-[160px]">
                    <p className="font-medium truncate max-w-[160px]">{t.description}</p>
                    <p className="opacity-40 text-[10px] uppercase tracking-wider capitalize">{t.type}</p>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3.5 whitespace-nowrap opacity-80">
                    {new Date(t.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })}
                  </td>

                  {/* Gross Amount */}
                  <td className="px-4 py-3.5 font-mono font-bold text-amber-500 whitespace-nowrap">
                    £{t.grossAmount.toFixed(2)}
                  </td>

                  {/* Net / VAT */}
                  <td className="px-4 py-3.5 font-mono text-[10px] opacity-70 whitespace-nowrap">
                    £{t.netAmount.toFixed(2)} / £{t.vatAmount.toFixed(2)}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <StatusBadge status={t.paymentStatus} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => onSelectTransaction(t)}
                        className="flex items-center gap-1 px-2 py-1 rounded-sm border border-amber-500/30 text-amber-500 text-[10px] font-medium hover:bg-amber-500 hover:text-zinc-950 transition-colors"
                        title="View VAT Invoice"
                      >
                        <Receipt size={12} /> VAT Invoice
                      </button>
                      {t.paymentStatus === "paid" && (
                        <button
                          onClick={() => onOpenRefund(t)}
                          className="p-1 rounded-sm border border-purple-500/20 text-purple-400 hover:bg-purple-500/10 transition-colors"
                          title="Process Refund"
                        >
                          <RotateCcw size={12} />
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

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-current/5">
        <p className="text-[11px] opacity-50">
          Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, total)} of {total} transactions
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-2 py-1 text-[11px] rounded-sm border border-current/10 disabled:opacity-30 hover:border-current/30 transition-colors"
          >
            ← Prev
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const p = i + 1;
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
  );
}
