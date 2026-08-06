"use client";

import React from "react";
import { Receipt, FileText, Printer } from "lucide-react";
import type { SerializedTransaction } from "@/features/admin/actions/finance";

interface InvoicesTableProps {
  transactions: SerializedTransaction[];
  onSelectTransaction: (txn: SerializedTransaction) => void;
}

export function InvoicesTable({ transactions, onSelectTransaction }: InvoicesTableProps) {
  return (
    <div className="admin-card rounded-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] font-sans min-w-[850px]">
          <thead className="border-b border-current/5">
            <tr>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Invoice Ref</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Issue Date</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Billed Guest</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Item Description</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-right">Net Subtotal</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-right">UK VAT (20%)</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-right">Total Amount</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-current/5">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[12px] opacity-40">
                  No invoices generated.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="hover:bg-current/3 transition-colors">
                  <td className="px-4 py-3.5 font-mono text-amber-500 font-semibold">
                    {t.invoiceRef}
                  </td>
                  <td className="px-4 py-3.5 opacity-80 whitespace-nowrap">
                    {new Date(t.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold truncate max-w-[140px]">{t.guestName}</p>
                    <p className="opacity-40 text-[10px] truncate max-w-[140px]">{t.guestEmail}</p>
                  </td>
                  <td className="px-4 py-3.5 opacity-80 truncate max-w-[160px]">{t.description}</td>
                  <td className="px-4 py-3.5 text-right font-mono opacity-80">£{t.netAmount.toFixed(2)}</td>
                  <td className="px-4 py-3.5 text-right font-mono opacity-80">£{t.vatAmount.toFixed(2)}</td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-amber-500">£{t.grossAmount.toFixed(2)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => onSelectTransaction(t)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-amber-500 text-zinc-950 font-semibold text-[10px] hover:bg-amber-400 transition-colors shadow-xs"
                    >
                      <Printer size={11} /> View / Print PDF
                    </button>
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
