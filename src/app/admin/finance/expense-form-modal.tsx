"use client";

import React, { useState, useTransition } from "react";
import { X, Save, Loader2, DollarSign } from "lucide-react";
import { addExpense, type SerializedExpense } from "@/features/admin/actions/finance";
import { useRouter } from "next/navigation";

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: SerializedExpense["category"][] = [
  "Culinary & Fine Wine Imports",
  "Housekeeping & Linens",
  "Staff Payroll & Concierge",
  "Utilities & Property Energy",
  "Marketing & PR",
];

export function ExpenseFormModal({ isOpen, onClose }: ExpenseFormModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [category, setCategory] = useState<SerializedExpense["category"]>("Culinary & Fine Wine Imports");
  const [title, setTitle] = useState("");
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState<number>(1500);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) return;

    setFeedback(null);
    startTransition(async () => {
      const res = await addExpense({
        category,
        title,
        vendor,
        amount,
        date,
      });

      if (res.success) {
        router.refresh();
        onClose();
      } else {
        setFeedback(res.message || "Failed to log expense.");
      }
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="admin-card border rounded-sm w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-current/5">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <DollarSign size={16} className="text-amber-500" /> Log Operational Expense
            </h2>
            <button onClick={onClose} className="p-1 opacity-50 hover:opacity-100 transition-opacity">
              <X size={16} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-[12px]">
            {feedback && (
              <div className="p-2.5 rounded-sm bg-red-500/10 border border-red-500/20 text-red-400">
                {feedback}
              </div>
            )}

            {/* Title */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">
                Expense Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Domaine de la Romanée-Conti Consignment"
                className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none focus:border-amber-500/40"
              />
            </div>

            {/* Category & Vendor Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SerializedExpense["category"])}
                  className="w-full rounded-sm border border-current/10 bg-transparent px-2 py-2 outline-none focus:border-amber-500/40 text-[11px]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">
                  Vendor / Supplier
                </label>
                <input
                  type="text"
                  required
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="e.g. Mayfair Wine Merchants"
                  className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none focus:border-amber-500/40"
                />
              </div>
            </div>

            {/* Amount & Date Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">
                  Amount (£)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  step={10}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none focus:border-amber-500/40 font-mono font-semibold text-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none focus:border-amber-500/40 font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-sm border border-current/10 text-xs opacity-70 hover:opacity-100 transition-opacity"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 py-2 rounded-sm bg-amber-500 text-zinc-950 font-semibold text-xs hover:bg-amber-400 disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
              >
                {isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                Log Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
