"use client";

import React, { useState, useTransition } from "react";
import { RotateCcw, AlertCircle, Loader2 } from "lucide-react";
import { processRefund, type SerializedTransaction } from "@/features/admin/actions/finance";
import { useRouter } from "next/navigation";

interface RefundsTableProps {
  transactions: SerializedTransaction[];
}

export function RefundsTable({ transactions }: RefundsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedTxn, setSelectedTxn] = useState<SerializedTransaction | null>(null);
  const [refundReason, setRefundReason] = useState("Guest requested cancellation per policy");
  const [feedback, setFeedback] = useState<string | null>(null);

  const refundedTxns = transactions.filter((t) => t.paymentStatus === "refunded");
  const refundableTxns = transactions.filter((t) => t.paymentStatus === "paid");

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxn) return;

    setFeedback(null);
    startTransition(async () => {
      const res = await processRefund(selectedTxn.id, selectedTxn.grossAmount, refundReason);
      if (res.success) {
        setSelectedTxn(null);
        router.refresh();
      } else {
        setFeedback(res.message || "Failed to process refund.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 admin-card rounded-sm border p-5">
        <div>
          <p className="text-[10px] uppercase tracking-widest opacity-50 font-semibold font-sans">Total Refunded</p>
          <p className="text-xl font-bold font-mono text-purple-400 mt-0.5">
            £{refundedTxns.reduce((sum, t) => sum + t.grossAmount, 0).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <p className="text-xs opacity-60 max-w-sm">
          Processed refunds automatically revert booking status to cancelled and update guest lifetime metrics.
        </p>
      </div>

      {/* Refunds Log */}
      <div className="admin-card rounded-sm border overflow-hidden">
        <div className="px-5 py-4 border-b border-current/5">
          <h3 className="text-xs uppercase tracking-widest font-semibold opacity-60">
            Processed Refund & Reversal Audit Log
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px] font-sans min-w-[750px]">
            <thead className="border-b border-current/5">
              <tr>
                <th className="px-5 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Txn Ref</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Guest</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Description</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Date</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-right">Refunded Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-current/5">
              {refundedTxns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[12px] opacity-40">
                    No refunds processed yet.
                  </td>
                </tr>
              ) : (
                refundedTxns.map((t) => (
                  <tr key={t.id} className="hover:bg-current/3 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-purple-400 font-semibold">{t.transactionRef}</td>
                    <td className="px-5 py-3.5 font-semibold">{t.guestName}</td>
                    <td className="px-5 py-3.5 opacity-80">{t.description}</td>
                    <td className="px-5 py-3.5 opacity-60">
                      {new Date(t.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-purple-400">
                      £{t.grossAmount.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Refund Modal */}
      {selectedTxn && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs" onClick={() => setSelectedTxn(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="admin-card border rounded-sm w-full max-w-md shadow-2xl p-5 space-y-4 text-[12px]">
              <div className="flex items-center justify-between border-b border-current/5 pb-3">
                <p className="font-semibold text-sm flex items-center gap-1.5 text-purple-400">
                  <RotateCcw size={16} /> Process Guest Refund
                </p>
                <button onClick={() => setSelectedTxn(null)} className="opacity-50 hover:opacity-100">✕</button>
              </div>

              {feedback && (
                <div className="p-2 rounded-sm bg-red-500/10 text-red-400 text-[11px]">{feedback}</div>
              )}

              <div className="space-y-1">
                <p className="opacity-60 text-[11px]">Ref: <strong className="font-mono text-amber-500">{selectedTxn.transactionRef}</strong></p>
                <p className="opacity-60 text-[11px]">Guest: <strong>{selectedTxn.guestName}</strong></p>
                <p className="opacity-60 text-[11px]">Amount: <strong className="font-mono text-purple-400">£{selectedTxn.grossAmount.toFixed(2)}</strong></p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Refund Reason</label>
                <textarea
                  rows={3}
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full rounded-sm border border-current/10 bg-transparent p-2 outline-none focus:border-amber-500/40 resize-none text-[11px]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTxn(null)}
                  className="flex-1 py-1.5 rounded-sm border border-current/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRefundSubmit}
                  disabled={isPending}
                  className="flex-1 py-1.5 rounded-sm bg-purple-500 text-white font-semibold flex items-center justify-center gap-1"
                >
                  {isPending ? <Loader2 size={12} className="animate-spin" /> : "Confirm Refund"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
