"use client";

import React from "react";
import { Eye, Edit3, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import type { SerializedRoom } from "@/features/admin/actions/rooms";

interface RoomsTableProps {
  rooms: SerializedRoom[];
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
  onEdit: (room: SerializedRoom) => void;
}

function SortIcon({ field, sortBy, sortDir }: { field: string; sortBy: string; sortDir: string }) {
  if (sortBy !== field) return <ChevronsUpDown size={10} className="opacity-30" />;
  return sortDir === "asc" ? <ChevronUp size={10} className="text-amber-500" /> : <ChevronDown size={10} className="text-amber-500" />;
}

export function RoomsTable({
  rooms,
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
  onEdit,
}: RoomsTableProps) {
  const allOnPageSelected = rooms.every((r) => selectedIds.includes(r.id));

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
                  checked={allOnPageSelected && rooms.length > 0}
                  onChange={allOnPageSelected ? onClearAll : onSelectAll}
                  className="rounded-sm accent-amber-500 cursor-pointer"
                  aria-label="Select all on page"
                />
              </th>
              <SortTh field="name" label="Suite Name" />
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Category</th>
              <SortTh field="price" label="Base Rate" />
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Weekend / High Season</th>
              <SortTh field="capacity" label="Capacity" />
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Cleaning</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-left">Housekeeper</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold opacity-50 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-current/5">
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-[12px] opacity-40">
                  No rooms catalog items match the query criteria.
                </td>
              </tr>
            ) : (
              rooms.map((r) => (
                <tr
                  key={r.id}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("button, input")) return;
                    onOpenDetail(r.id);
                  }}
                  className={`transition-colors hover:bg-current/3 cursor-pointer ${
                    selectedIds.includes(r.id) ? "bg-amber-500/3" : ""
                  }`}
                >
                  <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(r.id)}
                      onChange={() => onSelectToggle(r.id)}
                      className="rounded-sm accent-amber-500 cursor-pointer"
                      aria-label={`Select ${r.name}`}
                    />
                  </td>

                  {/* Name & Thumbnail */}
                  <td className="px-4 py-3.5 min-w-[200px]">
                    <div className="flex items-center gap-3">
                      <img src={r.imageUrl} alt={r.name} className="w-10 h-8 rounded-xs object-cover border shrink-0" />
                      <div>
                        <p className="font-semibold truncate max-w-[160px]">{r.name}</p>
                        <p className="opacity-40 text-[10px] truncate max-w-[160px]">{r.roomType}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3.5 opacity-80 whitespace-nowrap">{r.category}</td>

                  {/* Base Rate */}
                  <td className="px-4 py-3.5 font-mono font-semibold text-amber-500 whitespace-nowrap">
                    £{r.pricePerNight}
                  </td>

                  {/* Rates */}
                  <td className="px-4 py-3.5 font-mono text-[10px] opacity-70 whitespace-nowrap">
                    £{r.weekendPrice} / £{r.seasonalPrice}
                  </td>

                  {/* Capacity */}
                  <td className="px-4 py-3.5 font-mono">{r.capacity} Guests</td>

                  {/* Cleaning */}
                  <td className="px-4 py-3.5">
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-sm border ${
                      r.outOfService ? "bg-red-500/10 border-red-500/20 text-red-400" :
                      r.cleaningStatus === "clean" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                      "bg-amber-500/10 border-amber-500/20 text-amber-500"
                    }`}>
                      {r.outOfService ? "OOS" : r.cleaningStatus}
                    </span>
                  </td>

                  {/* Staff */}
                  <td className="px-4 py-3.5 opacity-70 whitespace-nowrap">
                    {r.assignedHousekeeper ?? "Unassigned"}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => onEdit(r)}
                        className="p-1.5 rounded-sm border border-current/10 hover:border-amber-500/40 hover:text-amber-500 transition-colors"
                        title="Edit Specs"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => onOpenDetail(r.id)}
                        className="p-1.5 rounded-sm border border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-zinc-950 transition-colors"
                        title="Inspect"
                      >
                        <Eye size={12} />
                      </button>
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
          Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, total)} of {total} rooms
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
