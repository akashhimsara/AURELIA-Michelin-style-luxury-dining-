"use client";

import React, { useState, useCallback, useTransition } from "react";
import {
  Search, Download, FileText, Calendar, TableIcon,
  GitBranch, RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { SerializedReservation } from "@/features/admin/actions/reservations";
import { ReservationsTable } from "./reservations-table";
import { ReservationsCalendar } from "./reservations-calendar";
import { ReservationTimeline } from "./reservation-timeline";
import { ReservationDetailDrawer } from "./reservation-detail-drawer";
import { BulkActionsBar } from "./bulk-actions-bar";
import { ReservationFilters } from "./reservation-filters";
import { exportToCSV, exportToPDF } from "./export-utils";

type ViewMode = "table" | "calendar" | "timeline";
type TypeTab = "all" | "room" | "dining" | "spa" | "wedding";

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

interface AvailableRoom {
  id: string;
  name: string;
  pricePerNight: number;
  capacity: number;
}

interface ReservationsShellProps {
  initialReservations: SerializedReservation[];
  total: number;
  totalPages: number;
  availableRooms: AvailableRoom[];
}

const TABS: { key: TypeTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "room", label: "Rooms" },
  { key: "dining", label: "Dining" },
  { key: "spa", label: "Spa" },
  { key: "wedding", label: "Wedding" },
];

const VIEW_ICONS: Record<ViewMode, React.ReactNode> = {
  table:    <TableIcon size={13} />,
  calendar: <Calendar size={13} />,
  timeline: <GitBranch size={13} />,
};

const DEFAULT_FILTERS: FiltersState = {
  status: "all",
  paymentStatus: "all",
  dateFrom: "",
  dateTo: "",
  amountMin: "",
  amountMax: "",
  sortBy: "createdAt",
  sortDir: "desc",
};

export function ReservationsShell({
  initialReservations,
  total,
  totalPages,
  availableRooms,
}: ReservationsShellProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // View state
  const [view, setView] = useState<ViewMode>("table");
  const [typeTab, setTypeTab] = useState<TypeTab>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Detail drawer state
  const [openDetailId, setOpenDetailId] = useState<string | null>(null);

  // Client-side filtering (works with the initial server data)
  const filtered = initialReservations.filter((r) => {
    if (typeTab !== "all" && r.type !== typeTab) return false;
    if (filters.status !== "all" && r.status !== filters.status) return false;
    if (filters.paymentStatus !== "all" && r.paymentStatus !== filters.paymentStatus) return false;
    if (filters.dateFrom && new Date(r.date) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(r.date) > new Date(filters.dateTo)) return false;
    if (filters.amountMin && (r.finalAmount ?? 0) < Number(filters.amountMin)) return false;
    if (filters.amountMax && (r.finalAmount ?? 0) > Number(filters.amountMax)) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !r.name.toLowerCase().includes(q) &&
        !r.email.toLowerCase().includes(q) &&
        !r.id.toLowerCase().includes(q) &&
        !(r.bookedRoomName?.toLowerCase().includes(q))
      ) return false;
    }
    return true;
  });

  // Client-side sorting
  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortBy === "name") return a.name.localeCompare(b.name) * dir;
    if (sortBy === "amount") return ((a.finalAmount ?? 0) - (b.finalAmount ?? 0)) * dir;
    if (sortBy === "date") return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir;
    return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
  });

  // Client-side pagination
  const pageSize = 15;
  const clientTotalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = useCallback((field: string) => {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
    setPage(1);
  }, [sortBy]);

  const handleTabChange = (tab: TypeTab) => {
    setTypeTab(tab);
    setPage(1);
    setSelectedIds([]);
  };

  const handleSelectToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => setSelectedIds(paginated.map((r) => r.id));
  const handleClearAll = () => setSelectedIds([]);

  const refreshData = () => {
    startTransition(() => { router.refresh(); });
  };

  // Counts per tab
  const counts: Record<TypeTab, number> = {
    all: initialReservations.length,
    room: initialReservations.filter((r) => r.type === "room").length,
    dining: initialReservations.filter((r) => r.type === "dining").length,
    spa: initialReservations.filter((r) => r.type === "spa").length,
    wedding: initialReservations.filter((r) => r.type === "wedding").length,
  };

  return (
    <div className="space-y-4">
      {/* ── Top Bar: Tabs + View Toggle + Actions ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Type Tabs */}
        <div className="flex border border-current/10 rounded-sm p-0.5 w-fit overflow-x-auto">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-sm whitespace-nowrap transition-colors ${
                typeTab === key
                  ? "bg-amber-500 text-zinc-950 font-semibold"
                  : "opacity-60 hover:opacity-90"
              }`}
            >
              {label}
              <span className={`text-[10px] px-1 rounded-sm ${typeTab === key ? "bg-zinc-950/20" : "bg-current/10"}`}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40" />
            <input
              type="text"
              placeholder="Search reservations…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-52 pl-8 pr-3 py-1.5 text-[11px] rounded-sm border border-current/10 bg-transparent outline-none focus:border-amber-500/40 placeholder:opacity-40"
            />
          </div>

          {/* Filters */}
          <div className="relative">
            <ReservationFilters
              filters={filters}
              onFiltersChange={(f) => { setFilters(f); setPage(1); }}
              open={filtersOpen}
              onToggle={() => setFiltersOpen((o) => !o)}
            />
          </div>

          {/* Refresh */}
          <button
            onClick={refreshData}
            title="Refresh"
            className="p-1.5 rounded-sm border border-current/10 hover:border-current/30 opacity-60 hover:opacity-100 transition-colors"
          >
            <RefreshCw size={13} />
          </button>

          {/* View toggle */}
          <div className="flex border border-current/10 rounded-sm p-0.5">
            {(["table", "calendar", "timeline"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                title={v.charAt(0).toUpperCase() + v.slice(1)}
                className={`p-1.5 rounded-sm transition-colors ${
                  view === v ? "bg-amber-500 text-zinc-950" : "opacity-50 hover:opacity-80"
                }`}
              >
                {VIEW_ICONS[v]}
              </button>
            ))}
          </div>

          {/* Export CSV */}
          <button
            onClick={() => exportToCSV(sorted, `aurelia-reservations-${new Date().toISOString().split("T")[0]}`)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] rounded-sm border border-current/10 hover:border-current/30 opacity-70 hover:opacity-100 transition-colors"
          >
            <Download size={12} /> CSV
          </button>

          {/* Export PDF */}
          <button
            onClick={exportToPDF}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] rounded-sm border border-current/10 hover:border-current/30 opacity-70 hover:opacity-100 transition-colors"
          >
            <FileText size={12} /> PDF
          </button>
        </div>
      </div>

      {/* ── Main Content Area ── */}
      {view === "table" && (
        <ReservationsTable
          reservations={paginated}
          total={sorted.length}
          page={page}
          pageSize={pageSize}
          totalPages={clientTotalPages}
          selectedIds={selectedIds}
          onSelectToggle={handleSelectToggle}
          onSelectAll={handleSelectAll}
          onClearAll={handleClearAll}
          onPageChange={(p) => { setPage(p); setSelectedIds([]); }}
          onSort={handleSort}
          sortBy={sortBy}
          sortDir={sortDir}
          onOpenDetail={setOpenDetailId}
        />
      )}

      {view === "calendar" && (
        <ReservationsCalendar
          reservations={sorted}
          onSelectReservation={setOpenDetailId}
        />
      )}

      {view === "timeline" && (
        <ReservationTimeline
          reservations={sorted}
          onSelectReservation={setOpenDetailId}
        />
      )}

      {/* ── Detail Drawer ── */}
      <ReservationDetailDrawer
        reservationId={openDetailId}
        availableRooms={availableRooms}
        onClose={() => setOpenDetailId(null)}
      />

      {/* ── Bulk Actions Bar ── */}
      <BulkActionsBar
        selectedIds={selectedIds}
        reservations={paginated}
        onDeselect={handleClearAll}
      />
    </div>
  );
}
