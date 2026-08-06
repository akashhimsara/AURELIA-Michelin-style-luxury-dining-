"use client";

import React, { useState, useTransition, useEffect, useCallback } from "react";
import {
  X, BedDouble, UtensilsCrossed, Sparkles, Heart,
  CheckCircle2, XCircle, RefreshCw, CreditCard,
  User, StickyNote, Home, Loader2, ChevronRight,
} from "lucide-react";
import {
  getReservationDetail,
  approveReservation,
  cancelReservation,
  markRefunded,
  assignRoom,
  changeRoom,
  upgradeRoom,
  addNote,
} from "@/features/admin/actions/reservations";
import { useRouter } from "next/navigation";

interface AvailableRoom {
  id: string;
  name: string;
  pricePerNight: number;
  capacity: number;
}

interface ReservationDetailDrawerProps {
  reservationId: string | null;
  availableRooms: AvailableRoom[];
  onClose: () => void;
}

type Tab = "overview" | "guest" | "room" | "notes";

const TYPE_ICON: Record<string, React.ReactNode> = {
  room: <BedDouble size={14} />,
  dining: <UtensilsCrossed size={14} />,
  spa: <Sparkles size={14} />,
  wedding: <Heart size={14} />,
};

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "confirmed" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
    status === "cancelled" ? "bg-red-500/10 text-red-400 border-red-500/20" :
    "bg-amber-500/10 text-amber-500 border-amber-500/20";
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-sm border ${cls}`}>
      {status}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-current/5 last:border-0">
      <p className="text-[11px] opacity-50 shrink-0">{label}</p>
      <p className="text-[12px] font-medium text-right">{value ?? "—"}</p>
    </div>
  );
}

export function ReservationDetailDrawer({ reservationId, availableRooms, onClose }: ReservationDetailDrawerProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [isPending, startTransition] = useTransition();
  const [detail, setDetail] = useState<Awaited<ReturnType<typeof getReservationDetail>>>(null);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const fetchDetail = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const d = await getReservationDetail(id);
      setDetail(d);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (reservationId) {
      setTab("overview");
      setNote("");
      setSelectedRoomId("");
      setActionFeedback(null);
      fetchDetail(reservationId);
    }
  }, [reservationId, fetchDetail]);

  const handleAction = (fn: () => Promise<{ success: boolean; message?: string }>, successMsg: string) => {
    setActionFeedback(null);
    startTransition(async () => {
      const res = await fn();
      if (res.success) {
        setActionFeedback(successMsg);
        if (reservationId) await fetchDetail(reservationId);
        router.refresh();
      } else {
        setActionFeedback(`Error: ${res.message}`);
      }
    });
  };

  if (!reservationId) return null;

  const r = detail?.reservation;
  const user = detail?.user;
  const roomData = detail?.room;

  const nights = r?.checkOutDate
    ? Math.max(1, Math.round((new Date(r.checkOutDate).getTime() - new Date(r.date).getTime()) / 86400000))
    : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md admin-card border-l flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-current/5">
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-40">
              {r ? `AUR-${r.id.slice(0, 8).toUpperCase()}` : "Loading..."}
            </p>
            <p className="font-semibold text-sm">{r?.name ?? "Reservation Details"}</p>
          </div>
          <div className="flex items-center gap-2">
            {r && <StatusBadge status={r.status} />}
            <button onClick={onClose} className="p-1.5 rounded-sm opacity-50 hover:opacity-100 transition-opacity">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-current/5">
          {(["overview", "guest", "room", "notes"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-[11px] font-medium capitalize transition-colors ${
                tab === t
                  ? "border-b-2 border-amber-500 text-amber-500"
                  : "opacity-50 hover:opacity-80"
              }`}
            >
              {t === "guest" ? "Guest" : t === "room" ? "Room Mgmt" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 size={20} className="animate-spin opacity-40" />
            </div>
          ) : !r ? (
            <p className="text-[12px] opacity-40 text-center py-8">Failed to load details.</p>
          ) : (
            <>
              {/* ── Overview ── */}
              {tab === "overview" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-amber-500">{TYPE_ICON[r.type] ?? <Home size={14} />}</span>
                    <span className="text-[12px] capitalize font-medium opacity-70">{r.type} Reservation</span>
                  </div>

                  <div className="admin-card rounded-sm border p-4">
                    <InfoRow label="Guest" value={r.name} />
                    <InfoRow label="Email" value={r.email} />
                    <InfoRow label="Phone" value={r.phone} />
                    <InfoRow label="Guests" value={`${r.guests} adults${r.children > 0 ? `, ${r.children} children` : ""}`} />
                  </div>

                  <div className="admin-card rounded-sm border p-4">
                    <InfoRow label="Arrangement" value={r.bookedRoomName ?? (r.type === "dining" ? "Fine Dining Table" : r.type)} />
                    <InfoRow label="Check-in" value={new Date(r.date).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "long", year: "numeric" })} />
                    {r.checkOutDate && (
                      <InfoRow label="Check-out" value={new Date(r.checkOutDate).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "long", year: "numeric" })} />
                    )}
                    {nights && <InfoRow label="Nights" value={`${nights} nights`} />}
                    {r.time && <InfoRow label="Seating Time" value={r.time} />}
                  </div>

                  <div className="admin-card rounded-sm border p-4">
                    <InfoRow label="Amount" value={r.finalAmount ? `£${r.finalAmount.toLocaleString("en-GB")}` : "—"} />
                    <InfoRow
                      label="Payment"
                      value={
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-sm border ${
                          r.paymentStatus === "paid" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                          r.paymentStatus === "refunded" ? "bg-violet-500/10 text-violet-500 border-violet-500/20" :
                          "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }`}>
                          {r.paymentStatus}
                        </span>
                      }
                    />
                    <InfoRow label="Stripe Session" value={r.stripeSessionId ? r.stripeSessionId.slice(0, 20) + "…" : "None"} />
                    <InfoRow label="Booked" value={new Date(r.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} />
                  </div>

                  {r.specialRequests && (
                    <div className="admin-card rounded-sm border p-4">
                      <p className="text-[10px] uppercase tracking-widest opacity-40 mb-2">Special Requests</p>
                      <p className="text-[12px] whitespace-pre-wrap opacity-70">{r.specialRequests}</p>
                    </div>
                  )}
                  {r.dietaryRequirements && (
                    <div className="admin-card rounded-sm border p-4">
                      <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Dietary</p>
                      <p className="text-[12px] opacity-70">{r.dietaryRequirements}</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Guest ── */}
              {tab === "guest" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{user?.name ?? r.name}</p>
                      <p className="text-[11px] opacity-50">{user?.role ?? "Guest"}</p>
                    </div>
                  </div>
                  {user ? (
                    <>
                      <div className="admin-card rounded-sm border p-4">
                        <InfoRow label="Email" value={user.email} />
                        <InfoRow label="Phone" value={user.phone} />
                        <InfoRow label="Member Since" value={new Date(user.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })} />
                      </div>
                      {user.profile && (
                        <div className="admin-card rounded-sm border p-4">
                          <p className="text-[10px] uppercase tracking-widest opacity-40 mb-2">Guest Profile</p>
                          <InfoRow label="VIP Tier" value={<span className="text-amber-500 font-semibold">{user.profile.vipTier}</span>} />
                          <InfoRow label="Loyalty Points" value={user.profile.loyaltyPoints.toLocaleString()} />
                          <InfoRow label="Nationality" value={user.profile.nationality} />
                          <InfoRow label="Pillow Type" value={user.profile.pillowType} />
                          <InfoRow label="Dietary Notes" value={user.profile.dietaryNotes} />
                          <InfoRow label="Emergency Contact" value={user.profile.emergencyContact} />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="admin-card rounded-sm border p-4">
                      <InfoRow label="Name" value={r.name} />
                      <InfoRow label="Email" value={r.email} />
                      <InfoRow label="Phone" value={r.phone} />
                      <p className="text-[11px] opacity-40 mt-3 text-center">No linked user account</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Room Management ── */}
              {tab === "room" && (
                <div className="space-y-4">
                  {roomData && (
                    <div className="admin-card rounded-sm border p-4">
                      <p className="text-[10px] uppercase tracking-widest opacity-40 mb-2">Current Room</p>
                      <InfoRow label="Name" value={<span className="text-amber-500">{roomData.name}</span>} />
                      <InfoRow label="Rate" value={`£${roomData.pricePerNight}/night`} />
                      <InfoRow label="Capacity" value={`${roomData.capacity} guests`} />
                    </div>
                  )}

                  <div className="admin-card rounded-sm border p-4 space-y-3">
                    <p className="text-[10px] uppercase tracking-widest opacity-40">Assign / Change / Upgrade Room</p>
                    <select
                      value={selectedRoomId}
                      onChange={(e) => setSelectedRoomId(e.target.value)}
                      className="w-full rounded-sm border border-current/10 bg-transparent px-2 py-2 text-[12px] outline-none focus:border-amber-500/40"
                    >
                      <option value="">Select a room…</option>
                      {availableRooms.map((rm) => (
                        <option key={rm.id} value={rm.id}>
                          {rm.name} — £{rm.pricePerNight}/night
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(() => assignRoom(r.id, selectedRoomId), "Room assigned!")}
                        disabled={!selectedRoomId || isPending}
                        className="flex-1 py-1.5 text-[11px] rounded-sm border border-sky-500/20 bg-sky-500/10 text-sky-500 hover:bg-sky-500/20 disabled:opacity-30 transition-colors"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => handleAction(() => changeRoom(r.id, selectedRoomId), "Room changed!")}
                        disabled={!selectedRoomId || isPending}
                        className="flex-1 py-1.5 text-[11px] rounded-sm border border-amber-500/20 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 disabled:opacity-30 transition-colors"
                      >
                        Change
                      </button>
                      <button
                        onClick={() => handleAction(() => upgradeRoom(r.id, selectedRoomId), "Room upgraded!")}
                        disabled={!selectedRoomId || isPending}
                        className="flex-1 py-1.5 text-[11px] rounded-sm border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 disabled:opacity-30 transition-colors"
                      >
                        Upgrade
                      </button>
                    </div>
                  </div>

                  {/* History */}
                  <div className="admin-card rounded-sm border p-4">
                    <p className="text-[10px] uppercase tracking-widest opacity-40 mb-3">Booking History</p>
                    <div className="space-y-3">
                      {[
                        { label: "Reservation Created", time: r.createdAt, icon: <ChevronRight size={10} /> },
                        r.paymentStatus === "paid" && { label: "Payment Received", time: r.updatedAt, icon: <CreditCard size={10} className="text-emerald-500" /> },
                        r.status === "confirmed" && { label: "Reservation Confirmed", time: r.updatedAt, icon: <CheckCircle2 size={10} className="text-emerald-500" /> },
                        r.status === "cancelled" && { label: "Reservation Cancelled", time: r.updatedAt, icon: <XCircle size={10} className="text-red-400" /> },
                        r.paymentStatus === "refunded" && { label: "Refund Processed", time: r.updatedAt, icon: <RefreshCw size={10} className="text-violet-500" /> },
                      ].filter(Boolean).map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-[11px]">
                          <span className="opacity-60">{(item as { icon: React.ReactNode }).icon}</span>
                          <span className="flex-1 opacity-70">{(item as { label: string }).label}</span>
                          <span className="opacity-40">{new Date((item as { time: string }).time).toLocaleDateString("en-GB")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Notes ── */}
              {tab === "notes" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <StickyNote size={14} className="text-amber-500" />
                    <p className="text-[12px] font-medium">Admin Notes</p>
                  </div>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add an internal note visible only to staff…"
                    rows={6}
                    className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2.5 text-[12px] outline-none focus:border-amber-500/40 resize-none"
                  />
                  <button
                    onClick={() => {
                      if (!note.trim()) return;
                      handleAction(() => addNote(r.id, note), "Note saved!");
                      setNote("");
                    }}
                    disabled={!note.trim() || isPending}
                    className="w-full py-2 text-[12px] rounded-sm bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400 disabled:opacity-40 transition-colors"
                  >
                    {isPending ? "Saving…" : "Save Note"}
                  </button>
                  {r.specialRequests && (
                    <div className="admin-card rounded-sm border p-4">
                      <p className="text-[10px] uppercase tracking-widest opacity-40 mb-2">Existing Notes & Requests</p>
                      <p className="text-[11px] whitespace-pre-wrap opacity-60">{r.specialRequests}</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Action feedback */}
        {actionFeedback && (
          <div className={`mx-5 mb-2 px-3 py-2 rounded-sm text-[11px] ${
            actionFeedback.startsWith("Error") ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-500"
          }`}>
            {actionFeedback}
          </div>
        )}

        {/* Footer Actions */}
        {r && (
          <div className="flex gap-2 p-4 border-t border-current/5">
            {r.status === "pending" && (
              <button
                onClick={() => handleAction(() => approveReservation(r.id), "Approved!")}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[12px] rounded-sm bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-40 transition-colors"
              >
                {isPending ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                Approve
              </button>
            )}
            {r.status !== "cancelled" && (
              <button
                onClick={() => handleAction(() => cancelReservation(r.id), "Cancelled.")}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[12px] rounded-sm bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-40 transition-colors"
              >
                {isPending ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                Cancel
              </button>
            )}
            {r.paymentStatus === "paid" && r.status === "cancelled" && (
              <button
                onClick={() => handleAction(() => markRefunded(r.id), "Refunded.")}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[12px] rounded-sm bg-violet-500/10 text-violet-500 border border-violet-500/20 hover:bg-violet-500/20 disabled:opacity-40 transition-colors"
              >
                <RefreshCw size={12} />
                Refund
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
