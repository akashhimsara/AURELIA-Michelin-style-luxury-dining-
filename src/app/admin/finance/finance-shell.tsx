"use client";

import React, { useState, useCallback } from "react";
import {
  DollarSign, Receipt, TrendingUp, Download, Printer, Search,
  RefreshCw, FileText, RotateCcw
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { FinanceData, SerializedTransaction } from "@/features/admin/actions/finance";
import { FinanceStatsSection } from "./finance-stats-section";
import { PaymentsTable } from "./payments-table";
import { InvoicesTable } from "./invoices-table";
import { MonthlyYearlyReports } from "./monthly-yearly-reports";
import { ExpensesSection } from "./expenses-section";
import { RefundsTable } from "./refunds-table";
import { InvoiceModalDrawer } from "./invoice-modal-drawer";
import { exportTransactionsToCSV, triggerPrintPDF } from "./finance-export-utils";

type MainTab = "payments" | "invoices" | "reports" | "expenses" | "refunds";

interface FinanceShellProps {
  data: FinanceData;
}

const TABS: { key: MainTab; label: string; icon: React.ElementType }[] = [
  { key: "payments", label: "Payments Ledger", icon: DollarSign },
  { key: "invoices", label: "VAT Invoices", icon: Receipt },
  { key: "reports", label: "Monthly & Yearly Reports", icon: TrendingUp },
  { key: "expenses", label: "Expenses & Net Profit", icon: FileText },
  { key: "refunds", label: "Refund Audit Log", icon: RotateCcw },
];

export function FinanceShell({ data }: FinanceShellProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<MainTab>("payments");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  // Invoice Modal Drawer State
  const [selectedInvoiceTxn, setSelectedInvoiceTxn] = useState<SerializedTransaction | null>(null);

  // Refund Modal State
  const [selectedRefundTxn, setSelectedRefundTxn] = useState<SerializedTransaction | null>(null);

  // Client-side filtering
  const filteredTxns = data.transactions.filter((t) => {
    if (statusFilter !== "all" && t.paymentStatus !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !t.transactionRef.toLowerCase().includes(q) &&
        !t.invoiceRef.toLowerCase().includes(q) &&
        !t.guestName.toLowerCase().includes(q) &&
        !t.guestEmail.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  // Client-side sorting
  const sortedTxns = [...filteredTxns].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortBy === "name") return a.guestName.localeCompare(b.guestName) * dir;
    if (sortBy === "gross") return (a.grossAmount - b.grossAmount) * dir;
    return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir;
  });

  const pageSize = 15;
  const totalPages = Math.max(1, Math.ceil(sortedTxns.length / pageSize));
  const paginatedTxns = sortedTxns.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = useCallback((field: string) => {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
    setPage(1);
  }, [sortBy]);

  return (
    <div className="space-y-6">
      {/* KPI Stats Section */}
      <FinanceStatsSection summary={data.summary} />

      {/* Main Module Tabs */}
      <div className="flex border-b border-current/10 gap-1 overflow-x-auto print:hidden">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => {
              setActiveTab(key);
              setSearch("");
              setPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider font-sans border-b-2 transition-colors whitespace-nowrap ${
              activeTab === key
                ? "border-amber-500 text-amber-500"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Control Bar (when on Payments or Invoices) */}
      {(activeTab === "payments" || activeTab === "invoices") && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
          {/* Search */}
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40" />
            <input
              type="text"
              placeholder="Search transaction, invoice ref, guest…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-64 pl-8 pr-3 py-1.5 text-[11px] rounded-sm border border-current/10 bg-transparent outline-none focus:border-amber-500/40 placeholder:opacity-40"
            />
          </div>

          {/* Status Filter & Export Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {activeTab === "payments" && (
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="rounded-sm border border-current/10 bg-transparent px-2 py-1.5 text-[11px] outline-none"
              >
                <option value="all">All Payment Statuses</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="refunded">Refunded</option>
              </select>
            )}

            <button
              onClick={() => router.refresh()}
              title="Refresh"
              className="p-1.5 rounded-sm border border-current/10 hover:border-current/30 opacity-60 hover:opacity-100 transition-colors"
            >
              <RefreshCw size={13} />
            </button>

            <button
              onClick={() => exportTransactionsToCSV(sortedTxns)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-sm border border-current/10 hover:border-current/30 opacity-70 hover:opacity-100 transition-colors"
            >
              <Download size={12} /> CSV
            </button>

            <button
              onClick={triggerPrintPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-sm border border-current/10 hover:border-current/30 opacity-70 hover:opacity-100 transition-colors"
            >
              <Printer size={12} /> Print PDF
            </button>
          </div>
        </div>
      )}

      {/* Tab Contents */}
      {activeTab === "payments" && (
        <PaymentsTable
          transactions={paginatedTxns}
          total={sortedTxns.length}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={setPage}
          onSort={handleSort}
          sortBy={sortBy}
          sortDir={sortDir}
          onSelectTransaction={setSelectedInvoiceTxn}
          onOpenRefund={setSelectedRefundTxn}
        />
      )}

      {activeTab === "invoices" && (
        <InvoicesTable
          transactions={sortedTxns}
          onSelectTransaction={setSelectedInvoiceTxn}
        />
      )}

      {activeTab === "reports" && (
        <MonthlyYearlyReports
          monthlyReports={data.monthlyReports}
          yearlySummary={data.yearlySummary}
        />
      )}

      {activeTab === "expenses" && (
        <ExpensesSection expenses={data.expenses} />
      )}

      {activeTab === "refunds" && (
        <RefundsTable transactions={data.transactions} />
      )}

      {/* Invoice Modal Drawer */}
      <InvoiceModalDrawer
        transaction={selectedInvoiceTxn}
        onClose={() => setSelectedInvoiceTxn(null)}
      />
    </div>
  );
}
