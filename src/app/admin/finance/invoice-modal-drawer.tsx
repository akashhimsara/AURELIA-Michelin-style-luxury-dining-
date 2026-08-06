"use client";

import React from "react";
import { X, Printer, Download, CheckCircle2, Building2, Receipt } from "lucide-react";
import type { SerializedTransaction } from "@/features/admin/actions/finance";

interface InvoiceModalDrawerProps {
  transaction: SerializedTransaction | null;
  onClose: () => void;
}

export function InvoiceModalDrawer({ transaction, onClose }: InvoiceModalDrawerProps) {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="admin-card border rounded-sm w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col bg-zinc-950 text-zinc-100 my-auto">
          {/* Top Bar Actions (hidden when printing) */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-current/10 bg-current/5 print:hidden">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500 font-sans">
              <Receipt size={16} /> Official UK VAT Invoice
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-sm bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors"
              >
                <Printer size={13} /> Print / Save PDF
              </button>
              <button onClick={onClose} className="p-1.5 opacity-50 hover:opacity-100 transition-opacity">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Printable Invoice Document Body */}
          <div className="p-8 space-y-8 text-xs font-sans bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 print:p-0 print:text-black">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6">
              <div>
                <h1 className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-500 tracking-wider">
                  AURELIA
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1 font-mono">
                  Luxury Fine Dining & Bespoke Suites
                </p>
                <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">
                  14 Mayfair Square, London W1J 8AJ<br />
                  United Kingdom · +44 20 7946 0912<br />
                  VAT Reg No: <strong className="font-mono">GB 948 201 44</strong>
                </p>
              </div>

              <div className="text-right">
                <p className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100">
                  {transaction.invoiceRef}
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Issue Date: {new Date(transaction.date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
                </p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px] border border-emerald-500/20 uppercase tracking-widest">
                  {transaction.paymentStatus}
                </span>
              </div>
            </div>

            {/* Billed To & Payment Method */}
            <div className="grid grid-cols-2 gap-6 py-2">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400 mb-1">
                  Billed To Guest
                </p>
                <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{transaction.guestName}</p>
                <p className="text-zinc-500">{transaction.guestEmail}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400 mb-1">
                  Payment Reference
                </p>
                <p className="font-mono font-medium">{transaction.transactionRef}</p>
                <p className="text-zinc-500">{transaction.paymentMethod}</p>
                {transaction.stripeSessionId && (
                  <p className="font-mono text-[9px] text-zinc-400 mt-0.5 truncate">
                    {transaction.stripeSessionId}
                  </p>
                )}
              </div>
            </div>

            {/* Itemized Line Items Table */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-100 dark:bg-zinc-900 text-zinc-500 text-[10px] uppercase font-semibold tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3 text-right">Net Subtotal</th>
                    <th className="px-4 py-3 text-right">UK VAT (20%)</th>
                    <th className="px-4 py-3 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  <tr>
                    <td className="px-4 py-3.5 font-medium">{transaction.description}</td>
                    <td className="px-4 py-3.5 capitalize opacity-70">{transaction.type} Arrangement</td>
                    <td className="px-4 py-3.5 text-right font-mono">£{transaction.netAmount.toFixed(2)}</td>
                    <td className="px-4 py-3.5 text-right font-mono">£{transaction.vatAmount.toFixed(2)}</td>
                    <td className="px-4 py-3.5 text-right font-mono font-semibold text-amber-600 dark:text-amber-500">
                      £{transaction.grossAmount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Subtotal & VAT Breakdown */}
            <div className="flex justify-end pt-2">
              <div className="w-64 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
                  <span>Net Amount (Excl. VAT)</span>
                  <span className="font-mono text-zinc-900 dark:text-zinc-100">£{transaction.netAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
                  <span>UK VAT @ 20.0%</span>
                  <span className="font-mono text-zinc-900 dark:text-zinc-100">£{transaction.vatAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 text-sm font-bold text-zinc-900 dark:text-zinc-100 border-t border-zinc-300 dark:border-zinc-700">
                  <span>Total Amount Paid</span>
                  <span className="font-mono text-amber-600 dark:text-amber-500">£{transaction.grossAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 text-[10px] text-zinc-500 text-center space-y-1">
              <p>Thank you for choosing AURELIA Mayfair. This document constitutes an official UK VAT receipt.</p>
              <p className="font-mono opacity-60">AURELIA Luxury Property Ltd · Company No. 09482014 · Registered in England & Wales</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
