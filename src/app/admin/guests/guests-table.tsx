"use client";

import React from "react";
import {
  Eye, ShieldAlert, Crown, ChevronUp, ChevronDown, ChevronsUpDown,
} from "lucide-react";
import type { SerializedGuest, GuestStatus } from "@/features/admin/actions/guests";

interface GuestsTableProps {
  guests: SerializedGuest[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onPageChange: (p: number) => void;
  onSort: (field: string) => void;
  sortBy: string;
  sortDir: string;
  onOpenDetail: (id: string) => void;
}

function StatusBadge({ status }: { status: GuestStatus }) {
  const map: Record<GuestStatus, string> = {
    vip: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    loyal: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    regular: "bg-sky-500/10 text-sky-500 border-sky-500/20",
    new: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    blacklisted: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={`text-[9px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded-sm border ${map[status]}`}>
      {status}
    </span>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function SortIcon({ field, sortBy, sortDir }: { field: string; sortBy: string; sortDir: string }) {
  if (sortBy !== field) return <ChevronsUpDown size={10} className="opacity-30" />;
  return sortDir === "asc" ? <ChevronUp size={10} className="text-amber-500" /> : <ChevronDown size={10} className="text-amber-500" />;
}

function formatDate(iso: string | null) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" });
}

export function GuestsTable({
  guests,
  total,
  page,
  pageSize,
  totalPages,
  selectedIds,
  onSelectToggle,
  onSelectAll,
  onClearAll,
  onPageChange,
  onSort,
  sortBy,
  sortDir,
  onOpenDetail,
}: GuestsTableProps) {
  const allOnPageSelected = guests.every((g) => selectedIds.includes(g.id));

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
        <table className="w-full text-[11px] font-sans min-w-[900px]">
          <thead className="border-b border-current/5">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allOnPageSelected && guests.length > 0}
                  onChange={allOnPageSelected ? onClearAll : onSelectAll}
                  className="rounded-sm accent-amber-500 cursor-pointer"
                  aria-label="Select all on page"
                />
              </th>
              <SortTh field="name" label="Guest" />
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Status</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">VIP Tier</th>
              <SortTh field="stays" label="Stays / Dining" />
              <SortTh field="ltv" label="Lifetime Value" />
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Favorite Suite</th>
              <SortTh field="lastStay" label="Last Stay" />
              <SortTh field="createdAt" label="Joined" />
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-current/5">
            {guests.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-[12px] opacity-40">
                  No guests found matching criteria.
                </td>
              </tr>
            ) : (
              guests.map((g) => (
                <tr
                  key={g.id}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("button, input")) return;
                    onOpenDetail(g.id);
                  }}
                  className={`transition-colors hover:bg-current/3 cursor-pointer ${
                    selectedIds.includes(g.id) ? "bg-amber-500/3" : ""
                  }`}
                >
                  <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(g.id)}
                      onChange={() => onSelectToggle(g.id)}
                      className="rounded-sm accent-amber-500 cursor-pointer"
                      aria-label={`Select ${g.name}`}
                    />
                  </td>

                  {/* Guest Avatar & Details */}
                  <td className="px-4 py-3.5 min-w-[180px]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {initials(g.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{g.name}</p>
                        <p className="opacity-40 text-[10px] truncate">{g.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <StatusBadge status={g.status} />
                  </td>

                  {/* VIP Tier */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="flex items-center gap-1 text-[10px] font-medium opacity-80">
                      {g.vipTier.includes("VIP") && <Crown size={11} className="text-amber-500" />}
                      {g.vipTier}
                    </span>
                  </td>

                  {/* Stays & Dining */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <p className="font-medium">{g.roomStays} stays</p>
                    <p className="opacity-40 text-[10px]">{g.diningVisits} dining</p>
                  </td>

                  {/* Lifetime Value */}
                  <td className="px-4 py-3.5 font-mono font-semibold text-amber-500 whitespace-nowrap">
                    £{g.lifetimeValue.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>

                  {/* Favorite Suite */}
                  <td className="px-4 py-3.5 min-w-[120px]">
                    <p className="truncate max-w-[130px] opacity-80">{g.favoriteRoom ?? "—"}</p>
                  </td>

                  {/* Last Stay */}
                  <td className="px-4 py-3.5 opacity-60 whitespace-nowrap">
                    {formatDate(g.lastStay)}
                  </td>

                  {/* Joined */}
                  <td className="px-4 py-3.5 opacity-60 whitespace-nowrap">
                    {formatDate(g.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => onOpenDetail(g.id)}
                        title="View Full Profile"
                        className="p-1.5 rounded-sm border border-current/10 hover:border-amber-500/40 hover:text-amber-500 transition-colors"
                      >
                        <Eye size={12} />
                      </button>
                      {g.status === "blacklisted" && (
                        <span className="text-red-400 p-1.5" title="Blacklisted">
                          <ShieldAlert size={12} />
                        </span>
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
          Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, total)} of {total} guests
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
