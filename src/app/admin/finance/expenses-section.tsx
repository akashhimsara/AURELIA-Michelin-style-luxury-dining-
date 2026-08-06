"use client";

import React, { useState } from "react";
import { Plus, DollarSign, Tag, Calendar, Building } from "lucide-react";
import type { SerializedExpense } from "@/features/admin/actions/finance";
import { ExpenseFormModal } from "./expense-form-modal";

interface ExpensesSectionProps {
  expenses: SerializedExpense[];
}

export function ExpensesSection({ expenses }: ExpensesSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 admin-card rounded-sm border p-5">
        <div>
          <p className="text-[10px] uppercase tracking-widest opacity-50 font-semibold font-sans">Operating Expenses</p>
          <p className="text-xl font-bold font-mono text-red-400 mt-0.5">
            £{totalExpenses.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-sm bg-amber-500 text-zinc-950 font-semibold text-xs hover:bg-amber-400 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus size={14} /> Log New Expense
        </button>
      </div>

      {/* Expense Log Table */}
      <div className="admin-card rounded-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] font-sans min-w-[700px]">
            <thead className="border-b border-current/5">
              <tr>
                <th className="px-5 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Expense Entry</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Category</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Vendor / Supplier</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Date</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-current/5">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[12px] opacity-40">
                    No operating expenses logged yet.
                  </td>
                </tr>
              ) : (
                expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-current/3 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-zinc-900 dark:text-zinc-100">{e.title}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-sm bg-current/5 border border-current/10 text-[10px]">
                        {e.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 opacity-80">{e.vendor}</td>
                    <td className="px-5 py-3.5 opacity-60">
                      {new Date(e.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-red-400">
                      £{e.amount.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <ExpenseFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
