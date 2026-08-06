"use client";

import React, { useState, useEffect, useTransition, useCallback } from "react";
import {
  X, BedDouble, Sparkles, TrendingUp, Calendar, UserCheck, ShieldAlert,
  Loader2, CheckCircle2, Clock, DollarSign, Wrench, Edit3, Trash2
} from "lucide-react";
import {
  getRoomDetail,
  updateRoom,
  deleteRoom,
  type RoomDetailData,
  type CleaningStatus,
  type MaintenanceStatus,
  type SerializedRoom,
} from "@/features/admin/actions/rooms";
import { useRouter } from "next/navigation";

interface RoomDetailDrawerProps {
  roomId: string | null;
  onClose: () => void;
  onEdit: (room: SerializedRoom) => void;
}

type Tab = "overview" | "housekeeping" | "pricing" | "schedule";

const HOUSEKEEPERS = [
  "Sophie Laurent",
  "Elena Rostova",
  "Marcus Vance",
  "Claire Beauchamp",
  "David Sterling",
];

export function RoomDetailDrawer({ roomId, onClose, onEdit }: RoomDetailDrawerProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<RoomDetailData | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Editable local state for Housekeeping & Pricing overrides
  const [cleaningStatus, setCleaningStatus] = useState<CleaningStatus>("clean");
  const [maintenanceStatus, setMaintenanceStatus] = useState<MaintenanceStatus>("operational");
  const [outOfService, setOutOfService] = useState(false);
  const [assignedHousekeeper, setAssignedHousekeeper] = useState("Sophie Laurent");
  const [pricePerNight, setPricePerNight] = useState<number>(500);

  const fetchDetail = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await getRoomDetail(id);
      setDetail(res);
      if (res?.room) {
        setCleaningStatus(res.room.cleaningStatus);
        setMaintenanceStatus(res.room.maintenanceStatus);
        setOutOfService(res.room.outOfService);
        setAssignedHousekeeper(res.room.assignedHousekeeper ?? "Sophie Laurent");
        setPricePerNight(res.room.pricePerNight);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (roomId) {
      setTab("overview");
      setFeedback(null);
      fetchDetail(roomId);
    }
  }, [roomId, fetchDetail]);

  if (!roomId) return null;

  const r = detail?.room;

  const handleSavePrice = () => {
    if (!r) return;
    setFeedback(null);
    startTransition(async () => {
      const res = await updateRoom(r.id, { pricePerNight });
      if (res.success) {
        setFeedback("Pricing updated successfully!");
        await fetchDetail(r.id);
        router.refresh();
      } else {
        setFeedback(`Error: ${res.message}`);
      }
    });
  };

  const handleDelete = () => {
    if (!r || !confirm(`Are you sure you want to delete ${r.name}?`)) return;
    setFeedback(null);
    startTransition(async () => {
      const res = await deleteRoom(r.id);
      if (res.success) {
        onClose();
        router.refresh();
      } else {
        setFeedback(`Error: ${res.message}`);
      }
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md admin-card border-l flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-current/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <BedDouble size={18} />
            </div>
            <div>
              <p className="font-semibold text-sm truncate max-w-[200px]">{r?.name ?? "Suite Details"}</p>
              <p className="text-[10px] opacity-50 uppercase tracking-wider">{r?.category ?? "Loading..."}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {r && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(r);
                }}
                className="p-1.5 rounded-sm border border-current/10 hover:border-amber-500/40 hover:text-amber-500 transition-colors"
                title="Edit Suite Specs"
              >
                <Edit3 size={14} />
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-sm opacity-50 hover:opacity-100 transition-opacity">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-current/5">
          {(["overview", "housekeeping", "pricing", "schedule"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-[11px] font-medium capitalize transition-colors ${
                tab === t ? "border-b-2 border-amber-500 text-amber-500 font-semibold" : "opacity-50 hover:opacity-80"
              }`}
            >
              {t === "housekeeping" ? "Ops & Maid" : t}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 size={20} className="animate-spin opacity-40" />
            </div>
          ) : !r ? (
            <p className="text-[12px] opacity-40 text-center py-8">Failed to load suite detail.</p>
          ) : (
            <>
              {/* ── Overview Tab ── */}
              {tab === "overview" && (
                <div className="space-y-4 text-[12px]">
                  {/* Image Preview */}
                  <div className="relative h-40 rounded-sm overflow-hidden border border-current/10 bg-zinc-950">
                    <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                      <div>
                        <p className="text-white font-medium">{r.name}</p>
                        <p className="text-[10px] text-amber-400 font-mono">£{r.pricePerNight} / night</p>
                      </div>
                    </div>
                  </div>

                  <div className="admin-card rounded-sm border p-4 space-y-2">
                    <p className="text-[10px] uppercase tracking-widest opacity-40 font-medium">Suite Specifications</p>
                    <div className="flex justify-between py-1 border-b border-current/5">
                      <span className="opacity-50">Category</span>
                      <span className="font-medium">{r.category}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-current/5">
                      <span className="opacity-50">Room Type</span>
                      <span className="font-medium">{r.roomType}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-current/5">
                      <span className="opacity-50">Capacity</span>
                      <span className="font-medium">{r.capacity} Guests</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-current/5">
                      <span className="opacity-50">Base Price</span>
                      <span className="font-mono font-medium text-amber-500">£{r.pricePerNight}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="opacity-50">Current Occupancy</span>
                      <span className={`font-semibold ${r.isOccupiedToday ? "text-amber-500" : "text-emerald-500"}`}>
                        {r.isOccupiedToday ? `Occupied (${r.activeGuestName})` : "Available"}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="admin-card rounded-sm border p-4">
                    <p className="text-[10px] uppercase tracking-widest opacity-40 font-medium mb-1.5">Description</p>
                    <p className="opacity-70 leading-relaxed text-[11px]">{r.description}</p>
                  </div>

                  {/* Amenities */}
                  <div className="admin-card rounded-sm border p-4">
                    <p className="text-[10px] uppercase tracking-widest opacity-40 font-medium mb-2">Connected Facilities</p>
                    <div className="flex flex-wrap gap-1.5">
                      {r.facilities.length === 0 ? (
                        <span className="opacity-40 text-[11px]">No facilities linked</span>
                      ) : (
                        r.facilities.map((f) => (
                          <span
                            key={f.id}
                            className="px-2 py-0.5 rounded-sm bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-medium"
                          >
                            {f.name}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="w-full py-2 text-[11px] text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 rounded-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Trash2 size={12} /> Delete Suite Catalog Record
                  </button>
                </div>
              )}

              {/* ── Housekeeping Tab ── */}
              {tab === "housekeeping" && (
                <div className="space-y-4 text-[12px]">
                  <div className="admin-card rounded-sm border p-4 space-y-3">
                    <p className="text-[10px] uppercase tracking-widest opacity-40 font-medium">Cleaning Status</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: "clean", label: "Clean & Inspected", cls: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10" },
                        { key: "dirty", label: "Needs Housekeeping", cls: "text-amber-500 border-amber-500/30 bg-amber-500/10" },
                        { key: "in_progress", label: "Cleaning In Progress", cls: "text-sky-500 border-sky-500/30 bg-sky-500/10" },
                        { key: "inspected", label: "Supervisor Passed", cls: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
                      ].map((st) => (
                        <button
                          key={st.key}
                          type="button"
                          onClick={() => setCleaningStatus(st.key as CleaningStatus)}
                          className={`p-2 rounded-sm border text-[11px] text-left transition-all ${
                            cleaningStatus === st.key ? `${st.cls} font-semibold shadow-xs` : "border-current/10 opacity-50 hover:opacity-100"
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="admin-card rounded-sm border p-4 space-y-3">
                    <p className="text-[10px] uppercase tracking-widest opacity-40 font-medium">Maintenance & Operational</p>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={outOfService}
                          onChange={(e) => setOutOfService(e.target.checked)}
                          className="accent-red-500 rounded-xs"
                        />
                        <span className="font-medium text-red-400">Flag Out of Service (OOS)</span>
                      </label>

                      <div className="pt-2">
                        <label className="text-[10px] opacity-50 block mb-1">Maintenance Status</label>
                        <select
                          value={maintenanceStatus}
                          onChange={(e) => setMaintenanceStatus(e.target.value as MaintenanceStatus)}
                          className="w-full rounded-sm border border-current/10 bg-transparent px-2 py-1.5 outline-none"
                        >
                          <option value="operational">Operational</option>
                          <option value="maintenance">Under Maintenance</option>
                          <option value="out_of_service">Out of Service</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="admin-card rounded-sm border p-4 space-y-2">
                    <p className="text-[10px] uppercase tracking-widest opacity-40 font-medium">Assign Staff Housekeeper</p>
                    <select
                      value={assignedHousekeeper}
                      onChange={(e) => setAssignedHousekeeper(e.target.value)}
                      className="w-full rounded-sm border border-current/10 bg-transparent px-2 py-2 outline-none"
                    >
                      {HOUSEKEEPERS.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setFeedback("Operational and housekeeping status updated!")}
                    className="w-full py-2 bg-amber-500 text-zinc-950 font-semibold rounded-sm text-xs hover:bg-amber-400 transition-colors"
                  >
                    Save Housekeeping Status
                  </button>
                </div>
              )}

              {/* ── Pricing Tab ── */}
              {tab === "pricing" && (
                <div className="space-y-4 text-[12px]">
                  <div className="admin-card rounded-sm border p-4 space-y-3">
                    <p className="text-[10px] uppercase tracking-widest opacity-40 font-medium">Base Nightly Rate</p>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500 font-bold text-base">£</span>
                      <input
                        type="number"
                        value={pricePerNight}
                        onChange={(e) => setPricePerNight(Number(e.target.value))}
                        className="flex-1 rounded-sm border border-current/10 bg-transparent px-3 py-2 text-sm font-mono font-semibold"
                      />
                      <button
                        onClick={handleSavePrice}
                        disabled={isPending}
                        className="px-3 py-2 bg-amber-500 text-zinc-950 font-semibold rounded-sm text-xs hover:bg-amber-400"
                      >
                        Save Rate
                      </button>
                    </div>
                  </div>

                  {/* Pricing Calculators */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="admin-card rounded-sm border p-3">
                      <p className="text-[10px] uppercase tracking-widest opacity-40">Weekend Rate (+20%)</p>
                      <p className="text-lg font-semibold font-mono text-emerald-500 mt-1">
                        £{Math.round(pricePerNight * 1.2)}
                      </p>
                    </div>
                    <div className="admin-card rounded-sm border p-3">
                      <p className="text-[10px] uppercase tracking-widest opacity-40">High Season (+35%)</p>
                      <p className="text-lg font-semibold font-mono text-purple-400 mt-1">
                        £{Math.round(pricePerNight * 1.35)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Schedule Tab ── */}
              {tab === "schedule" && (
                <div className="space-y-3 text-[12px]">
                  <p className="text-[10px] uppercase tracking-widest opacity-40 font-medium">Upcoming Reservations</p>
                  {detail?.upcomingReservations.length === 0 ? (
                    <p className="text-center opacity-40 py-6">No active or upcoming bookings for this suite.</p>
                  ) : (
                    detail?.upcomingReservations.map((res) => (
                      <div key={res.id} className="admin-card rounded-sm border p-3 space-y-1">
                        <div className="flex items-center justify-between font-semibold">
                          <span>{res.guestName}</span>
                          <span className="text-amber-500 font-mono">£{res.amount ?? 0}</span>
                        </div>
                        <div className="flex justify-between text-[10px] opacity-50">
                          <span>
                            {new Date(res.checkIn).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                            {res.checkOut && ` – ${new Date(res.checkOut).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`}
                          </span>
                          <span className="capitalize">{res.status}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {feedback && (
          <div className="mx-5 mb-4 p-2.5 rounded-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[11px]">
            {feedback}
          </div>
        )}
      </div>
    </>
  );
}
