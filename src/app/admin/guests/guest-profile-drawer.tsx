"use client";

import React, { useState, useEffect, useTransition, useCallback } from "react";
import {
  X, User, Crown, ShieldAlert, Award, BedDouble, UtensilsCrossed, Sparkles, Heart,
  Save, Loader2, CheckCircle2, Clock, Calendar, RefreshCw
} from "lucide-react";
import {
  getGuestDetail,
  updateGuestProfile,
  setVipTier,
  addGuestNote,
  blacklistGuest,
  unblacklistGuest,
  updateLoyaltyPoints,
  type GuestDetailData,
  type GuestStatus,
} from "@/features/admin/actions/guests";
import { useRouter } from "next/navigation";

interface GuestProfileDrawerProps {
  guestId: string | null;
  onClose: () => void;
}

type Tab = "profile" | "analytics" | "history" | "preferences" | "notes";
type HistorySubTab = "room" | "dining" | "spa" | "wedding";

function StatusBadge({ status }: { status: GuestStatus }) {
  const map: Record<GuestStatus, string> = {
    vip: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    loyal: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    regular: "bg-sky-500/10 text-sky-500 border-sky-500/20",
    new: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    blacklisted: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${map[status]}`}>
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

const VIP_TIERS = [
  "Standard Guest",
  "Silver Guest",
  "Gold VIP",
  "Platinum VIP",
  "VIP Elite",
  "Blacklisted",
];

export function GuestProfileDrawer({ guestId, onClose }: GuestProfileDrawerProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("profile");
  const [historySubTab, setHistorySubTab] = useState<HistorySubTab>("room");
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<GuestDetailData | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Preference form state
  const [nationality, setNationality] = useState("");
  const [pillowType, setPillowType] = useState("");
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  // Admin note state
  const [newNote, setNewNote] = useState("");

  // Points state
  const [loyaltyPoints, setLoyaltyPointsInput] = useState<number>(0);

  const fetchDetail = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await getGuestDetail(id);
      setDetail(res);
      if (res?.profile) {
        setNationality(res.profile.nationality ?? "");
        setPillowType(res.profile.pillowType ?? "");
        setDietaryNotes(res.profile.dietaryNotes ?? "");
        setEmergencyContact(res.profile.emergencyContact ?? "");
        setLoyaltyPointsInput(res.profile.loyaltyPoints ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (guestId) {
      setTab("profile");
      setHistorySubTab("room");
      setActionFeedback(null);
      setNewNote("");
      fetchDetail(guestId);
    }
  }, [guestId, fetchDetail]);

  const runAction = (fn: () => Promise<{ success: boolean; message?: string }>, msg: string) => {
    setActionFeedback(null);
    startTransition(async () => {
      const res = await fn();
      if (res.success) {
        setActionFeedback(msg);
        if (guestId) await fetchDetail(guestId);
        router.refresh();
      } else {
        setActionFeedback(`Error: ${res.message}`);
      }
    });
  };

  if (!guestId) return null;

  const g = detail?.guest;
  const p = detail?.profile;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md admin-card border-l flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-current/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold text-sm">
              {g ? initials(g.name) : <User size={18} />}
            </div>
            <div>
              <p className="font-semibold text-sm">{g?.name ?? "Guest Profile"}</p>
              <p className="text-[11px] opacity-50">{g?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {g && <StatusBadge status={g.status} />}
            <button onClick={onClose} className="p-1.5 rounded-sm opacity-50 hover:opacity-100 transition-opacity">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-current/5">
          {(["profile", "analytics", "history", "preferences", "notes"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-[11px] font-medium capitalize transition-colors ${
                tab === t ? "border-b-2 border-amber-500 text-amber-500 font-semibold" : "opacity-50 hover:opacity-80"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 size={20} className="animate-spin opacity-40" />
            </div>
          ) : !g ? (
            <p className="text-[12px] opacity-40 text-center py-8">Failed to load guest data.</p>
          ) : (
            <>
              {/* ── Profile Tab ── */}
              {tab === "profile" && (
                <div className="space-y-4">
                  <div className="admin-card rounded-sm border p-4 space-y-2.5">
                    <p className="text-[10px] uppercase tracking-widest opacity-40">Contact Information</p>
                    <div className="flex justify-between text-[12px] py-1 border-b border-current/5">
                      <span className="opacity-50">Full Name</span>
                      <span className="font-medium">{g.name}</span>
                    </div>
                    <div className="flex justify-between text-[12px] py-1 border-b border-current/5">
                      <span className="opacity-50">Email</span>
                      <span className="font-medium">{g.email}</span>
                    </div>
                    <div className="flex justify-between text-[12px] py-1 border-b border-current/5">
                      <span className="opacity-50">Phone</span>
                      <span className="font-medium">{g.phone ?? "Not provided"}</span>
                    </div>
                    <div className="flex justify-between text-[12px] py-1 border-b border-current/5">
                      <span className="opacity-50">Registered</span>
                      <span className="font-medium">
                        {new Date(g.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <div className="flex justify-between text-[12px] py-1">
                      <span className="opacity-50">Email Status</span>
                      <span className={`font-medium ${g.emailVerified ? "text-emerald-500" : "text-amber-500"}`}>
                        {g.emailVerified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                  </div>

                  {/* VIP Tier Selector */}
                  <div className="admin-card rounded-sm border p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Crown size={14} className="text-amber-500" />
                      <p className="text-[12px] font-medium">VIP Tier Management</p>
                    </div>
                    <select
                      value={g.vipTier}
                      onChange={(e) => runAction(() => setVipTier(g.id, e.target.value), `Tier updated to ${e.target.value}`)}
                      disabled={isPending}
                      className="w-full rounded-sm border border-current/10 bg-transparent px-2 py-2 text-[12px] outline-none focus:border-amber-500/40"
                    >
                      {VIP_TIERS.map((tier) => (
                        <option key={tier} value={tier}>
                          {tier}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-2 pt-2 border-t border-current/5">
                      <p className="text-[11px] opacity-60 flex-1">Points: {g.loyaltyPoints}</p>
                      <input
                        type="number"
                        value={loyaltyPoints}
                        onChange={(e) => setLoyaltyPointsInput(Number(e.target.value))}
                        className="w-20 rounded-sm border border-current/10 px-2 py-1 text-[11px] bg-transparent"
                      />
                      <button
                        onClick={() => runAction(() => updateLoyaltyPoints(g.id, loyaltyPoints), "Points updated")}
                        disabled={isPending}
                        className="px-2 py-1 text-[10px] bg-amber-500 text-zinc-950 font-semibold rounded-sm"
                      >
                        Save
                      </button>
                    </div>
                  </div>

                  {/* Blacklist Toggle */}
                  <div className="admin-card rounded-sm border p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[12px] font-medium flex items-center gap-1.5 text-red-400">
                        <ShieldAlert size={14} /> Blacklist Guest
                      </p>
                      <p className="text-[10px] opacity-40">Flag guest to alert concierge and front desk</p>
                    </div>
                    {g.vipTier === "Blacklisted" ? (
                      <button
                        onClick={() => runAction(() => unblacklistGuest(g.id), "Guest unblacklisted")}
                        disabled={isPending}
                        className="px-3 py-1 text-[11px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-sm hover:bg-emerald-500/20"
                      >
                        Restore
                      </button>
                    ) : (
                      <button
                        onClick={() => runAction(() => blacklistGuest(g.id), "Guest blacklisted")}
                        disabled={isPending}
                        className="px-3 py-1 text-[11px] bg-red-500/10 text-red-400 border border-red-500/20 rounded-sm hover:bg-red-500/20"
                      >
                        Blacklist
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ── Analytics Tab ── */}
              {tab === "analytics" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="admin-card rounded-sm border p-3">
                      <p className="text-[10px] uppercase tracking-widest opacity-40">Lifetime Value</p>
                      <p className="text-xl font-semibold text-amber-500 mt-1">£{g.lifetimeValue.toLocaleString("en-GB")}</p>
                    </div>
                    <div className="admin-card rounded-sm border p-3">
                      <p className="text-[10px] uppercase tracking-widest opacity-40">Average Spend</p>
                      <p className="text-xl font-semibold text-emerald-500 mt-1">£{Math.round(g.avgSpend).toLocaleString("en-GB")}</p>
                    </div>
                    <div className="admin-card rounded-sm border p-3">
                      <p className="text-[10px] uppercase tracking-widest opacity-40">Room Stays</p>
                      <p className="text-xl font-semibold mt-1">{g.roomStays}</p>
                    </div>
                    <div className="admin-card rounded-sm border p-3">
                      <p className="text-[10px] uppercase tracking-widest opacity-40">Dining Visits</p>
                      <p className="text-xl font-semibold mt-1">{g.diningVisits}</p>
                    </div>
                  </div>

                  <div className="admin-card rounded-sm border p-4 space-y-2">
                    <p className="text-[10px] uppercase tracking-widest opacity-40">Preferences Summary</p>
                    <div className="flex justify-between text-[12px] py-1 border-b border-current/5">
                      <span className="opacity-50">Favorite Suite</span>
                      <span className="font-medium text-amber-500">{g.favoriteRoom ?? "None recorded"}</span>
                    </div>
                    <div className="flex justify-between text-[12px] py-1 border-b border-current/5">
                      <span className="opacity-50">Last Stay</span>
                      <span className="font-medium">
                        {g.lastStay ? new Date(g.lastStay).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Never"}
                      </span>
                    </div>
                    <div className="flex justify-between text-[12px] py-1">
                      <span className="opacity-50">Total Reservations</span>
                      <span className="font-medium">{g.totalReservations}</span>
                    </div>
                  </div>

                  {/* Monthly Spend Chart */}
                  {detail?.monthlySpend && detail.monthlySpend.length > 0 && (
                    <div className="admin-card rounded-sm border p-4 space-y-3">
                      <p className="text-[10px] uppercase tracking-widest opacity-40">6-Month Spend Trend</p>
                      <div className="flex items-end gap-2 h-24 pt-2">
                        {detail.monthlySpend.map((m) => {
                          const max = Math.max(...detail.monthlySpend.map((x) => x.amount), 100);
                          const pct = Math.round((m.amount / max) * 100);
                          return (
                            <div key={m.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                              <div
                                className="w-full bg-amber-500/80 rounded-t-sm transition-all"
                                style={{ height: `${Math.max(pct, 4)}%` }}
                                title={`£${m.amount}`}
                              />
                              <span className="text-[9px] opacity-40">{m.month}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── History Tab ── */}
              {tab === "history" && (
                <div className="space-y-4">
                  {/* Subtabs */}
                  <div className="flex border border-current/10 rounded-sm p-0.5">
                    {[
                      { key: "room", label: "Rooms", icon: BedDouble },
                      { key: "dining", label: "Dining", icon: UtensilsCrossed },
                      { key: "spa", label: "Spa", icon: Sparkles },
                      { key: "wedding", label: "Wedding", icon: Heart },
                    ].map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => setHistorySubTab(key as HistorySubTab)}
                        className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] rounded-sm font-medium transition-colors ${
                          historySubTab === key ? "bg-amber-500 text-zinc-950 font-semibold" : "opacity-50 hover:opacity-80"
                        }`}
                      >
                        <Icon size={11} /> {label}
                      </button>
                    ))}
                  </div>

                  {/* Subtab Content */}
                  {historySubTab === "room" && (
                    <div className="space-y-2">
                      {detail?.roomHistory.length === 0 ? (
                        <p className="text-[12px] opacity-40 text-center py-6">No room stay history</p>
                      ) : (
                        detail?.roomHistory.map((r) => (
                          <div key={r.id} className="admin-card rounded-sm border p-3 space-y-1">
                            <div className="flex items-center justify-between text-[12px]">
                              <span className="font-semibold">{r.bookedRoomName ?? "Suite"}</span>
                              <span className="text-amber-500 font-mono font-medium">
                                {r.finalAmount ? `£${r.finalAmount}` : "—"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] opacity-50">
                              <span>
                                {new Date(r.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} · {r.nights} nights
                              </span>
                              <span className="capitalize">{r.status}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {historySubTab === "dining" && (
                    <div className="space-y-2">
                      {detail?.diningHistory.length === 0 ? (
                        <p className="text-[12px] opacity-40 text-center py-6">No dining history</p>
                      ) : (
                        detail?.diningHistory.map((d) => (
                          <div key={d.id} className="admin-card rounded-sm border p-3 space-y-1">
                            <div className="flex items-center justify-between text-[12px]">
                              <span className="font-semibold">Fine Dining Table ({d.guests} guests)</span>
                              <span className="text-amber-500 font-mono font-medium">
                                {d.finalAmount ? `£${d.finalAmount}` : "—"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] opacity-50">
                              <span>{new Date(d.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} {d.time}</span>
                              <span className="capitalize">{d.status}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {historySubTab === "spa" && (
                    <div className="space-y-2">
                      {detail?.spaHistory.length === 0 ? (
                        <p className="text-[12px] opacity-40 text-center py-6">No spa treatment history</p>
                      ) : (
                        detail?.spaHistory.map((s) => (
                          <div key={s.id} className="admin-card rounded-sm border p-3 space-y-1">
                            <div className="flex items-center justify-between text-[12px]">
                              <span className="font-semibold">Spa & Wellness Treatment</span>
                              <span className="text-amber-500 font-mono font-medium">
                                {s.finalAmount ? `£${s.finalAmount}` : "—"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] opacity-50">
                              <span>{new Date(s.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} {s.time}</span>
                              <span className="capitalize">{s.status}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {historySubTab === "wedding" && (
                    <div className="space-y-2">
                      {detail?.weddingHistory.length === 0 ? (
                        <p className="text-[12px] opacity-40 text-center py-6">No wedding/event history</p>
                      ) : (
                        detail?.weddingHistory.map((w) => (
                          <div key={w.id} className="admin-card rounded-sm border p-3 space-y-1">
                            <div className="flex items-center justify-between text-[12px]">
                              <span className="font-semibold">Wedding Celebration ({w.guests} guests)</span>
                              <span className="text-amber-500 font-mono font-medium">
                                {w.finalAmount ? `£${w.finalAmount}` : "—"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] opacity-50">
                              <span>{new Date(w.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span>
                              <span className="capitalize">{w.status}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── Preferences Tab ── */}
              {tab === "preferences" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest opacity-50">Nationality</label>
                    <input
                      type="text"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      placeholder="e.g. British, American, French"
                      className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 text-[12px] outline-none focus:border-amber-500/40"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest opacity-50">Pillow Type Preference</label>
                    <input
                      type="text"
                      value={pillowType}
                      onChange={(e) => setPillowType(e.target.value)}
                      placeholder="e.g. Feather, Memory Foam, Firm"
                      className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 text-[12px] outline-none focus:border-amber-500/40"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest opacity-50">Dietary Requirements</label>
                    <input
                      type="text"
                      value={dietaryNotes}
                      onChange={(e) => setDietaryNotes(e.target.value)}
                      placeholder="e.g. Vegan, Gluten-Free, Nut Allergy"
                      className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 text-[12px] outline-none focus:border-amber-500/40"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest opacity-50">Emergency Contact</label>
                    <input
                      type="text"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="e.g. Spouse: +44 7123 456789"
                      className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 text-[12px] outline-none focus:border-amber-500/40"
                    />
                  </div>

                  <button
                    onClick={() =>
                      runAction(
                        () =>
                          updateGuestProfile(g.id, {
                            nationality,
                            pillowType,
                            dietaryNotes,
                            emergencyContact,
                          }),
                        "Preferences updated!"
                      )
                    }
                    disabled={isPending}
                    className="w-full py-2 text-[12px] rounded-sm bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400 disabled:opacity-40 transition-colors"
                  >
                    {isPending ? "Saving…" : "Save Preferences"}
                  </button>
                </div>
              )}

              {/* ── Notes Tab ── */}
              {tab === "notes" && (
                <div className="space-y-4">
                  <p className="text-[12px] font-medium">Add Admin Note</p>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter confidential guest notes visible only to staff…"
                    rows={5}
                    className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2.5 text-[12px] outline-none focus:border-amber-500/40 resize-none"
                  />
                  <button
                    onClick={() => {
                      if (!newNote.trim()) return;
                      runAction(() => addGuestNote(g.id, newNote), "Note saved!");
                      setNewNote("");
                    }}
                    disabled={!newNote.trim() || isPending}
                    className="w-full py-2 text-[12px] rounded-sm bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400 disabled:opacity-40 transition-colors"
                  >
                    {isPending ? "Saving…" : "Save Note"}
                  </button>

                  {p?.dietaryNotes && (
                    <div className="admin-card rounded-sm border p-4 space-y-2">
                      <p className="text-[10px] uppercase tracking-widest opacity-40">Existing Notes & Preferences</p>
                      <p className="text-[11px] whitespace-pre-wrap opacity-70">{p.dietaryNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Action feedback banner */}
        {actionFeedback && (
          <div
            className={`mx-5 mb-4 px-3 py-2 rounded-sm text-[11px] ${
              actionFeedback.startsWith("Error") ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-500"
            }`}
          >
            {actionFeedback}
          </div>
        )}
      </div>
    </>
  );
}
