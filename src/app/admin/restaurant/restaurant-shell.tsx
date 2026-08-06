"use client";

import React, { useState } from "react";
import { Search, Plus, Utensils, LayoutGrid, Calendar, Sparkles, Wine, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import type { RestaurantData, SerializedMenuItem } from "@/features/admin/actions/restaurant";
import { MenuGrid } from "./menu-grid";
import { TablesFloorMap } from "./tables-floor-map";
import { DiningReservationsTable } from "./dining-reservations-table";
import { MenuFormModal } from "./menu-form-modal";
import { RestaurantStatsSection } from "./restaurant-stats-section";

type MainTab = "catalog" | "tables" | "reservations" | "specials";
type CategoryTab = "all" | "Appetizer" | "Main Course" | "Dessert" | "Cocktail" | "Wine List";

interface RestaurantShellProps {
  data: RestaurantData;
}

const MAIN_TABS: { key: MainTab; label: string; icon: React.ElementType }[] = [
  { key: "catalog", label: "Menu Catalog & Wines", icon: Utensils },
  { key: "tables", label: "Floor Tables Map", icon: LayoutGrid },
  { key: "reservations", label: "Dining Bookings", icon: Calendar },
  { key: "specials", label: "Chef Specials & Sommelier", icon: Sparkles },
];

const CATEGORY_TABS: { key: CategoryTab; label: string }[] = [
  { key: "all", label: "All Items" },
  { key: "Appetizer", label: "Appetizers" },
  { key: "Main Course", label: "Main Courses" },
  { key: "Dessert", label: "Desserts" },
  { key: "Cocktail", label: "Cocktails" },
  { key: "Wine List", label: "Wine List" },
];

export function RestaurantShell({ data }: RestaurantShellProps) {
  const router = useRouter();

  const [activeMainTab, setActiveMainTab] = useState<MainTab>("catalog");
  const [categoryTab, setCategoryTab] = useState<CategoryTab>("all");
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<SerializedMenuItem | null>(null);

  const handleOpenAdd = () => {
    setItemToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: SerializedMenuItem) => {
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  // Client-side filtering for Menu Catalog
  const filteredItems = data.menuItems.filter((item) => {
    if (activeMainTab === "specials") {
      if (!item.tags.includes("Chef Special") && !item.tags.includes("Sommelier Reserve")) {
        return false;
      }
    } else if (categoryTab !== "all" && item.category !== categoryTab) {
      return false;
    }

    if (search) {
      const q = search.toLowerCase();
      if (!item.name.toLowerCase().includes(q) && !item.description.toLowerCase().includes(q)) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Overview KPI Header */}
      <RestaurantStatsSection
        menuItems={data.menuItems}
        reservations={data.diningReservations}
        tables={data.tables}
      />

      {/* Main Module Tabs (Catalog / Floor / Bookings / Chef Specials) */}
      <div className="flex border-b border-current/10 gap-1 overflow-x-auto">
        {MAIN_TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => {
              setActiveMainTab(key);
              setSearch("");
            }}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider font-sans border-b-2 transition-colors whitespace-nowrap ${
              activeMainTab === key
                ? "border-amber-500 text-amber-500"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Module Controls Bar (when on Catalog or Specials) */}
      {(activeMainTab === "catalog" || activeMainTab === "specials") && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Filter Tabs (only for Catalog) */}
          {activeMainTab === "catalog" ? (
            <div className="flex border border-current/10 rounded-sm p-0.5 w-fit overflow-x-auto">
              {CATEGORY_TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setCategoryTab(key)}
                  className={`px-3 py-1.5 text-[11px] font-medium rounded-sm whitespace-nowrap transition-colors ${
                    categoryTab === key
                      ? "bg-amber-500 text-zinc-950 font-semibold"
                      : "opacity-60 hover:opacity-90"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-500 font-semibold text-xs">
              <Sparkles size={14} /> Sommelier & Chef Tasting Reserve Selection
            </div>
          )}

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40" />
              <input
                type="text"
                placeholder="Search dish, wine, ingredient…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-56 pl-8 pr-3 py-1.5 text-[11px] rounded-sm border border-current/10 bg-transparent outline-none focus:border-amber-500/40 placeholder:opacity-40"
              />
            </div>

            <button
              onClick={() => router.refresh()}
              title="Refresh"
              className="p-1.5 rounded-sm border border-current/10 hover:border-current/30 opacity-60 hover:opacity-100 transition-colors"
            >
              <RefreshCw size={13} />
            </button>

            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-sm bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400 transition-colors shadow-xs"
            >
              <Plus size={13} /> Add Menu Item
            </button>
          </div>
        </div>
      )}

      {/* Module Content */}
      {activeMainTab === "catalog" && (
        <MenuGrid items={filteredItems} onEdit={handleOpenEdit} />
      )}

      {activeMainTab === "specials" && (
        <MenuGrid items={filteredItems} onEdit={handleOpenEdit} />
      )}

      {activeMainTab === "tables" && (
        <TablesFloorMap tables={data.tables} />
      )}

      {activeMainTab === "reservations" && (
        <DiningReservationsTable reservations={data.diningReservations} />
      )}

      {/* Form Modal */}
      <MenuFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemToEdit={itemToEdit}
        restaurantId={data.restaurant.id}
      />
    </div>
  );
}
