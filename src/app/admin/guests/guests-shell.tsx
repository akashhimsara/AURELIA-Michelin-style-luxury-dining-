"use client";

import React, { useState, useCallback } from "react";
import { Search, Download, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SerializedGuest, GuestStatus } from "@/features/admin/actions/guests";
import { GuestsTable } from "./guests-table";
import { GuestProfileDrawer } from "./guest-profile-drawer";
import { GuestStatsSection } from "./guest-stats-section";
import { exportGuestsToCSV } from "./guest-export-utils";

type StatusTab = "all" | GuestStatus;

interface GuestsShellProps {
  initialGuests: SerializedGuest[];
}

const TABS: { key: StatusTab; label: string }[] = [
  { key: "all", label: "All Guests" },
  { key: "vip", label: "VIP" },
  { key: "loyal", label: "Loyal" },
  { key: "regular", label: "Regular" },
  { key: "new", label: "New" },
  { key: "blacklisted", label: "Blacklisted" },
];

export function GuestsShell({ initialGuests }: GuestsShellProps) {
  const router = useRouter();

  const [statusTab, setStatusTab] = useState<StatusTab>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  // Selection & drawer state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openDrawerId, setOpenDrawerId] = useState<string | null>(null);

  // Client-side filtering
  const filtered = initialGuests.filter((g) => {
    if (statusTab !== "all" && g.status !== statusTab) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !g.name.toLowerCase().includes(q) &&
        !g.email.toLowerCase().includes(q) &&
        !(g.phone && g.phone.toLowerCase().includes(q))
      )
        return false;
    }
    return true;
  });

  // Client-side sorting
  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortBy === "name") return a.name.localeCompare(b.name) * dir;
    if (sortBy === "ltv") return (a.lifetimeValue - b.lifetimeValue) * dir;
    if (sortBy === "stays") return (a.roomStays - b.roomStays) * dir;
    if (sortBy === "lastStay") {
      const ta = a.lastStay ? new Date(a.lastStay).getTime() : 0;
      const tb = b.lastStay ? new Date(b.lastStay).getTime() : 0;
      return (ta - tb) * dir;
    }
    return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
  });

  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
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

  const handleTabChange = (tab: StatusTab) => {
    setStatusTab(tab);
    setPage(1);
    setSelectedIds([]);
  };

  const handleSelectToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => setSelectedIds(paginated.map((g) => g.id));
  const handleClearAll = () => setSelectedIds([]);

  const counts: Record<StatusTab, number> = {
    all: initialGuests.length,
    vip: initialGuests.filter((g) => g.status === "vip").length,
    loyal: initialGuests.filter((g) => g.status === "loyal").length,
    regular: initialGuests.filter((g) => g.status === "regular").length,
    new: initialGuests.filter((g) => g.status === "new").length,
    blacklisted: initialGuests.filter((g) => g.status === "blacklisted").length,
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <GuestStatsSection guests={initialGuests} />

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Tabs */}
        <div className="flex border border-current/10 rounded-sm p-0.5 w-fit overflow-x-auto">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-sm whitespace-nowrap transition-colors ${
                statusTab === key
                  ? "bg-amber-500 text-zinc-950 font-semibold"
                  : "opacity-60 hover:opacity-90"
              }`}
            >
              {label}
              <span
                className={`text-[10px] px-1 rounded-sm ${
                  statusTab === key ? "bg-zinc-950/20" : "bg-current/10"
                }`}
              >
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40" />
            <input
              type="text"
              placeholder="Search guest name, email, phone…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-60 pl-8 pr-3 py-1.5 text-[11px] rounded-sm border border-current/10 bg-transparent outline-none focus:border-amber-500/40 placeholder:opacity-40"
            />
          </div>

          {/* Refresh */}
          <button
            onClick={() => router.refresh()}
            title="Refresh"
            className="p-1.5 rounded-sm border border-current/10 hover:border-current/30 opacity-60 hover:opacity-100 transition-colors"
          >
            <RefreshCw size={13} />
          </button>

          {/* Export CSV */}
          <button
            onClick={() =>
              exportGuestsToCSV(
                selectedIds.length > 0
                  ? initialGuests.filter((g) => selectedIds.includes(g.id))
                  : sorted,
                `aurelia-guests-${new Date().toISOString().split("T")[0]}`
              )
            }
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-sm border border-current/10 hover:border-current/30 opacity-70 hover:opacity-100 transition-colors"
          >
            <Download size={12} />
            Export CSV {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
          </button>
        </div>
      </div>

      {/* Table */}
      <GuestsTable
        guests={paginated}
        total={sorted.length}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        selectedIds={selectedIds}
        onSelectToggle={handleSelectToggle}
        onSelectAll={handleSelectAll}
        onClearAll={handleClearAll}
        onPageChange={(p) => {
          setPage(p);
          setSelectedIds([]);
        }}
        onSort={handleSort}
        sortBy={sortBy}
        sortDir={sortDir}
        onOpenDetail={setOpenDrawerId}
      />

      {/* Profile Drawer */}
      <GuestProfileDrawer
        guestId={openDrawerId}
        onClose={() => setOpenDrawerId(null)}
      />
    </div>
  );
}
