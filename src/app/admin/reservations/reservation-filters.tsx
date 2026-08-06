"use client";

import React from "react";
import { SlidersHorizontal, X } from "lucide-react";

interface FiltersState {
  status: string;
  paymentStatus: string;
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
  sortBy: string;
  sortDir: string;
}

interface ReservationFiltersProps {
  filters: FiltersState;
  onFiltersChange: (f: FiltersState) => void;
  open: boolean;
  onToggle: () => void;
}

export function ReservationFilters({ filters, onFiltersChange, open, onToggle }: ReservationFiltersProps) {
  const set = (key: keyof FiltersState, val: string) =>
    onFiltersChange({ ...filters, [key]: val });

  const hasActive =
    filters.status !== "all" ||
    filters.paymentStatus !== "all" ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.amountMin ||
    filters.amountMax ||
    filters.sortBy !== "createdAt";

  const reset = () =>
    onFiltersChange({
      status: "all",
      paymentStatus: "all",
      dateFrom: "",
      dateTo: "",
      amountMin: "",
      amountMax: "",
      sortBy: "createdAt",
      sortDir: "desc",
    });

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-sm border transition-colors ${
          open || hasActive
            ? "border-amber-500/50 bg-amber-500/10 text-amber-500"
            : "border-current/10 hover:border-current/20 opacity-70 hover:opacity-100"
        }`}
      >
        <SlidersHorizontal size={12} />
        Filters
        {hasActive && (
          <span className="ml-1 w-4 h-4 rounded-full bg-amber-500 text-zinc-950 text-[9px] font-bold flex items-center justify-center">
            !
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-50 admin-card border rounded-sm shadow-xl p-4 w-72 space-y-3 text-[12px]">
          <div className="flex items-center justify-between mb-1">
            <p className="font-semibold text-sm">Advanced Filters</p>
            <button onClick={onToggle} className="opacity-50 hover:opacity-100">
              <X size={14} />
            </button>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest opacity-50">Status</label>
            <select
              value={filters.status}
              onChange={(e) => set("status", e.target.value)}
              className="w-full rounded-sm border border-current/10 bg-transparent px-2 py-1.5 text-[12px] outline-none focus:border-amber-500/40"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Status */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest opacity-50">Payment</label>
            <select
              value={filters.paymentStatus}
              onChange={(e) => set("paymentStatus", e.target.value)}
              className="w-full rounded-sm border border-current/10 bg-transparent px-2 py-1.5 text-[12px] outline-none focus:border-amber-500/40"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest opacity-50">Date Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => set("dateFrom", e.target.value)}
                className="flex-1 rounded-sm border border-current/10 bg-transparent px-2 py-1.5 text-[11px] outline-none focus:border-amber-500/40"
              />
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => set("dateTo", e.target.value)}
                className="flex-1 rounded-sm border border-current/10 bg-transparent px-2 py-1.5 text-[11px] outline-none focus:border-amber-500/40"
              />
            </div>
          </div>

          {/* Amount Range */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest opacity-50">Amount Range (£)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.amountMin}
                onChange={(e) => set("amountMin", e.target.value)}
                className="flex-1 rounded-sm border border-current/10 bg-transparent px-2 py-1.5 text-[11px] outline-none focus:border-amber-500/40"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.amountMax}
                onChange={(e) => set("amountMax", e.target.value)}
                className="flex-1 rounded-sm border border-current/10 bg-transparent px-2 py-1.5 text-[11px] outline-none focus:border-amber-500/40"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest opacity-50">Sort By</label>
            <div className="flex gap-2">
              <select
                value={filters.sortBy}
                onChange={(e) => set("sortBy", e.target.value)}
                className="flex-1 rounded-sm border border-current/10 bg-transparent px-2 py-1.5 text-[12px] outline-none focus:border-amber-500/40"
              >
                <option value="createdAt">Created</option>
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="name">Name</option>
              </select>
              <select
                value={filters.sortDir}
                onChange={(e) => set("sortDir", e.target.value)}
                className="w-24 rounded-sm border border-current/10 bg-transparent px-2 py-1.5 text-[12px] outline-none focus:border-amber-500/40"
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between pt-1">
            <button
              onClick={reset}
              className="text-[11px] opacity-50 hover:opacity-100 transition-opacity"
            >
              Reset all
            </button>
            <button
              onClick={onToggle}
              className="text-[11px] bg-amber-500 text-zinc-950 px-3 py-1 rounded-sm font-medium"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
