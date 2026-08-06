"use client";

import React, { useState, useCallback } from "react";
import { Search, Plus, LayoutGrid, List, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SerializedRoom } from "@/features/admin/actions/rooms";
import { RoomsGrid } from "./rooms-grid";
import { RoomsTable } from "./rooms-table";
import { RoomDetailDrawer } from "./room-detail-drawer";
import { RoomFormModal } from "./room-form-modal";
import { RoomStatsSection } from "./room-stats-section";

type ViewMode = "grid" | "table";
type CategoryTab = "all" | "Presidential" | "Penthouse" | "Heritage" | "Villa";

interface RoomsShellProps {
  initialRooms: SerializedRoom[];
  facilities: Array<{ id: string; name: string }>;
}

const TABS: { key: CategoryTab; label: string }[] = [
  { key: "all", label: "All Suites" },
  { key: "Presidential", label: "Presidential" },
  { key: "Penthouse", label: "Penthouse" },
  { key: "Heritage", label: "Heritage Wing" },
  { key: "Villa", label: "Luxury Villa" },
];

export function RoomsShell({ initialRooms, facilities }: RoomsShellProps) {
  const router = useRouter();

  const [view, setView] = useState<ViewMode>("grid");
  const [categoryTab, setCategoryTab] = useState<CategoryTab>("all");
  const [search, setSearch] = useState("");
  const [cleaningFilter, setCleaningFilter] = useState<string>("all");
  const [maintenanceFilter, setMaintenanceFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("price");
  const [sortDir, setSortDir] = useState("desc");

  // Selection & drawer/modal state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openDrawerId, setOpenDrawerId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<SerializedRoom | null>(null);

  // Client-side filtering
  const filtered = initialRooms.filter((r) => {
    if (categoryTab !== "all" && !r.category.toLowerCase().includes(categoryTab.toLowerCase()) && !r.roomType.toLowerCase().includes(categoryTab.toLowerCase())) {
      return false;
    }
    if (cleaningFilter !== "all" && r.cleaningStatus !== cleaningFilter) return false;
    if (maintenanceFilter !== "all" && r.maintenanceStatus !== maintenanceFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.name.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  // Client-side sorting
  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortBy === "name") return a.name.localeCompare(b.name) * dir;
    if (sortBy === "capacity") return (a.capacity - b.capacity) * dir;
    return (a.pricePerNight - b.pricePerNight) * dir;
  });

  const pageSize = view === "grid" ? 12 : 15;
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

  const handleTabChange = (tab: CategoryTab) => {
    setCategoryTab(tab);
    setPage(1);
    setSelectedIds([]);
  };

  const handleOpenAddModal = () => {
    setRoomToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (room: SerializedRoom) => {
    setRoomToEdit(room);
    setIsModalOpen(true);
  };

  const counts: Record<CategoryTab, number> = {
    all: initialRooms.length,
    Presidential: initialRooms.filter((r) => r.category.includes("Presidential")).length,
    Penthouse: initialRooms.filter((r) => r.category.includes("Sky") || r.roomType.includes("Penthouse")).length,
    Heritage: initialRooms.filter((r) => r.category.includes("Heritage") || r.roomType.includes("Heritage")).length,
    Villa: initialRooms.filter((r) => r.roomType.includes("Villa")).length,
  };

  return (
    <div className="space-y-6">
      {/* KPI Stats Section */}
      <RoomStatsSection rooms={initialRooms} />

      {/* Control Bar: Tabs, Search, View Toggle, Add Room */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Tabs */}
        <div className="flex border border-current/10 rounded-sm p-0.5 w-fit overflow-x-auto">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-sm whitespace-nowrap transition-colors ${
                categoryTab === key ? "bg-amber-500 text-zinc-950 font-semibold" : "opacity-60 hover:opacity-90"
              }`}
            >
              {label}
              <span className={`text-[10px] px-1 rounded-sm ${categoryTab === key ? "bg-zinc-950/20" : "bg-current/10"}`}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Input */}
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40" />
            <input
              type="text"
              placeholder="Search suite title, specs…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-56 pl-8 pr-3 py-1.5 text-[11px] rounded-sm border border-current/10 bg-transparent outline-none focus:border-amber-500/40 placeholder:opacity-40"
            />
          </div>

          {/* Cleaning Filter */}
          <select
            value={cleaningFilter}
            onChange={(e) => {
              setCleaningFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-sm border border-current/10 bg-transparent px-2 py-1.5 text-[11px] outline-none"
          >
            <option value="all">All Housekeeping</option>
            <option value="clean">Clean</option>
            <option value="dirty">Needs Cleaning</option>
            <option value="in_progress font-medium">In Progress</option>
          </select>

          {/* View Toggle */}
          <div className="flex border border-current/10 rounded-sm p-0.5">
            <button
              onClick={() => setView("grid")}
              className={`p-1.5 rounded-sm transition-colors ${view === "grid" ? "bg-amber-500 text-zinc-950" : "opacity-50 hover:opacity-80"}`}
              title="Grid View"
            >
              <LayoutGrid size={13} />
            </button>
            <button
              onClick={() => setView("table")}
              className={`p-1.5 rounded-sm transition-colors ${view === "table" ? "bg-amber-500 text-zinc-950" : "opacity-50 hover:opacity-80"}`}
              title="Table View"
            >
              <List size={13} />
            </button>
          </div>

          {/* Add New Room */}
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-sm bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400 transition-colors shadow-xs"
          >
            <Plus size={13} /> Add Suite
          </button>
        </div>
      </div>

      {/* Main Content View */}
      {view === "grid" ? (
        <RoomsGrid
          rooms={paginated}
          onOpenDetail={setOpenDrawerId}
          onEdit={handleOpenEditModal}
        />
      ) : (
        <RoomsTable
          rooms={paginated}
          total={sorted.length}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          selectedIds={selectedIds}
          onSelectToggle={(id) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))}
          onSelectAll={() => setSelectedIds(paginated.map((r) => r.id))}
          onClearAll={() => setSelectedIds([])}
          onPageChange={(p) => setPage(p)}
          onSort={handleSort}
          sortBy={sortBy}
          sortDir={sortDir}
          onOpenDetail={setOpenDrawerId}
          onEdit={handleOpenEditModal}
        />
      )}

      {/* Slide-over Detail Drawer */}
      <RoomDetailDrawer
        roomId={openDrawerId}
        onClose={() => setOpenDrawerId(null)}
        onEdit={handleOpenEditModal}
      />

      {/* Form Modal for Create & Edit */}
      <RoomFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roomToEdit={roomToEdit}
        facilities={facilities}
      />
    </div>
  );
}
