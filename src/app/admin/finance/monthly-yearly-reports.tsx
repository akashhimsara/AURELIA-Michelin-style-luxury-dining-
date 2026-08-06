"use client";

import React from "react";
import { Download, Calendar, TrendingUp, DollarSign, Percent } from "lucide-react";
import type { MonthlyReportRow } from "@/features/admin/actions/finance";
import { exportMonthlyReportToCSV } from "./finance-export-utils";

interface MonthlyYearlyReportsProps {
  monthlyReports: MonthlyReportRow[];
  yearlySummary: {
    year: number;
    targetRevenue: number;
    actualRevenue: number;
    totalVat: number;
    totalExpenses: number;
    netProfit: number;
  };
}

export function MonthlyYearlyReports({
  monthlyReports,
  yearlySummary,
}: MonthlyYearlyReportsProps) {
  const targetPct = Math.round((yearlySummary.actualRevenue / yearlySummary.targetRevenue) * 100);

  return (
    <div className="space-y-6 font-sans">
      {/* Yearly Summary Performance Card */}
      <div className="admin-card rounded-sm border p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-current/5 pb-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-50 font-semibold">Annual Performance</p>
            <h2 className="text-base font-semibold">{yearlySummary.year} Financial Summary & Target Tracking</h2>
          </div>
          <button
            onClick={() => exportMonthlyReportToCSV(monthlyReports)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-sm border border-current/10 hover:border-current/30 opacity-80 hover:opacity-100 transition-colors self-start sm:self-auto"
          >
            <Download size={12} /> Export Monthly CSV
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest opacity-40">Annual Target</p>
            <p className="text-xl font-bold font-mono">£{yearlySummary.targetRevenue.toLocaleString("en-GB")}</p>
            <p className="text-[10px] text-amber-500 font-medium">{targetPct}% achieved</p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest opacity-40">YTD Gross Revenue</p>
            <p className="text-xl font-bold font-mono text-amber-500">
              £{yearlySummary.actualRevenue.toLocaleString("en-GB")}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest opacity-40">YTD VAT Collected</p>
            <p className="text-xl font-bold font-mono text-purple-400">
              £{yearlySummary.totalVat.toLocaleString("en-GB")}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest opacity-40">YTD Net Operating Profit</p>
            <p className="text-xl font-bold font-mono text-emerald-500">
              £{yearlySummary.netProfit.toLocaleString("en-GB")}
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Report Table */}
      <div className="admin-card rounded-sm border overflow-hidden">
        <div className="px-5 py-4 border-b border-current/5">
          <h3 className="text-xs uppercase tracking-widest font-semibold opacity-60">
            2026 Month-by-Month Financial Ledger
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px] font-sans">
            <thead className="border-b border-current/5">
              <tr>
                <th className="px-5 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Month</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-right">Gross Revenue (£)</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-right">Net Revenue (£)</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-right">20% UK VAT (£)</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-right">Expenses (£)</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-right">Net Profit (£)</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-right">Margin (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-current/5">
              {monthlyReports.map((r) => (
                <tr key={r.month} className="hover:bg-current/3 transition-colors">
                  <td className="px-5 py-3.5 font-semibold">{r.month}</td>
                  <td className="px-5 py-3.5 text-right font-mono font-semibold text-amber-500">
                    £{r.grossRevenue.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono opacity-80">
                    £{r.netRevenue.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono opacity-80 text-purple-400">
                    £{r.vatCollected.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-red-400">
                    £{r.expenses.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                  </td>
                  <td className={`px-5 py-3.5 text-right font-mono font-bold ${r.netProfit >= 0 ? "text-emerald-500" : "text-red-400"}`}>
                    £{r.netProfit.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-medium opacity-80">
                    {r.marginPct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
