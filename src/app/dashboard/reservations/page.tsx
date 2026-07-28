"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, BedDouble, ArrowLeft, RefreshCw, XCircle, Download, CheckCircle2, Coffee, Clock, Sparkles, Edit2 } from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { getGuestDashboardData } from "@/features/profile/actions";
import { cancelReservation, modifyReservation } from "@/features/booking/actions";

interface ReservationItem {
  id: string;
  type: string;
  name: string;
  date: string;
  checkOutDate?: string | null;
  time?: string | null;
  guests: number;
  status: string;
  finalAmount?: number | null;
  specialRequests?: string | null;
  dietaryRequirements?: string | null;
}

export default function ReservationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"lodging" | "dining" | "spa">("lodging");
  
  const [lodgingReservations, setLodgingReservations] = useState<ReservationItem[]>([]);
  const [diningReservations, setDiningReservations] = useState<ReservationItem[]>([]);
  const [spaReservations, setSpaReservations] = useState<ReservationItem[]>([]);
  
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Edit / Modification form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCheckIn, setEditCheckIn] = useState("");
  const [editCheckOut, setEditCheckOut] = useState("");
  const [editTime, setEditTime] = useState("19:00");
  const [editGuests, setEditGuests] = useState(2);
  const [editSpecialRequests, setEditSpecialRequests] = useState("");
  const [editDietaryRequirements, setEditDietaryRequirements] = useState("");

  async function loadData() {
    const res = await getGuestDashboardData();
    if (!res.success) {
      router.push("/login");
    } else {
      const allUpcoming = res.upcoming || [];
      setLodgingReservations(allUpcoming.filter((r: any) => r.type === "Lodging"));
      setDiningReservations(allUpcoming.filter((r: any) => r.type === "Dining"));
      setSpaReservations(allUpcoming.filter((r: any) => r.type === "Spa"));
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [router]);

  const handleCancel = (id: string) => {
    setActionError(null);
    setActionSuccess(null);
    if (!confirm("Are you sure you want to cancel this reservation?")) return;

    startTransition(async () => {
      const res = await cancelReservation(id);
      if (res.success) {
        setActionSuccess(res.message);
        loadData();
      } else {
        setActionError(res.message);
      }
    });
  };

  const startEdit = (res: ReservationItem) => {
    setEditingId(res.id);
    setEditCheckIn(res.date.split("T")[0]);
    setEditCheckOut(res.checkOutDate ? res.checkOutDate.split("T")[0] : "");
    setEditTime(res.time || "10:00");
    setEditGuests(res.guests);
    setEditSpecialRequests(res.specialRequests || "");
    setEditDietaryRequirements(res.dietaryRequirements || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setActionError(null);
  };

  const handleModify = (id: string, type: string) => {
    setActionError(null);
    setActionSuccess(null);

    if (type === "Lodging" && (!editCheckIn || !editCheckOut)) {
      setActionError("Check-in and Check-out dates must be fully specified.");
      return;
    }
    if ((type === "Dining" || type === "Spa") && !editCheckIn) {
      setActionError("Reservation date must be specified.");
      return;
    }

    startTransition(async () => {
      const res = await modifyReservation(
        id,
        editCheckIn,
        type === "Lodging" ? editCheckOut : null,
        editGuests,
        (type === "Dining" || type === "Spa") ? editTime : null,
        type === "Dining" ? editSpecialRequests : null,
        type === "Dining" ? editDietaryRequirements : null
      );
      if (res.success) {
        setActionSuccess(res.message);
        setEditingId(null);
        loadData();
      } else {
        setActionError(res.message);
      }
    });
  };

  const mockDownloadPdf = (res: ReservationItem) => {
    const code = res.id.slice(0, 8).toUpperCase();
    const content = `
=========================================
     AURELIA LUXURY HOTELS & RESORTS
        RESERVATION CONFIRMATION
=========================================
Voucher Reference: AUR-${code}
Arrangement Class: ${res.type.toUpperCase()}
Name:              ${res.name}
Guests Count:      ${res.guests} guests
Target Date:       ${new Date(res.date).toLocaleDateString("en-GB")}
${res.type === "Lodging" ? `Check-out Date:    ${res.checkOutDate ? new Date(res.checkOutDate).toLocaleDateString("en-GB") : "N/A"}` : `Seating/Session:   ${res.time || "N/A"}`}
${res.type === "Dining" && res.dietaryRequirements ? `Dietary Notes:     ${res.dietaryRequirements}` : ""}
${res.type === "Dining" && res.specialRequests ? `Special Requests:  ${res.specialRequests}` : ""}
Grand Total:       £${res.finalAmount ? res.finalAmount.toFixed(2) : "0.00"}
Booking Status:    ${res.status.toUpperCase()}
=========================================
Thank you for choosing AURELIA.
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Aurelia_${res.type}_Confirmation_${code}.txt`;
    link.click();
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex-1 flex items-center justify-center py-40">
          <RefreshCw className="animate-spin text-gold" size={32} />
        </div>
      </PageWrapper>
    );
  }

  const currentList =
    activeTab === "lodging"
      ? lodgingReservations
      : activeTab === "dining"
      ? diningReservations
      : spaReservations;

  return (
    <PageWrapper>
      <Section className="relative pt-28 pb-20 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.015)_0%,_black_100%)]">
        <Container className="max-w-3xl mx-auto space-y-8 text-left">
          {/* Top Return Link */}
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-zinc-500 hover:text-gold transition-colors font-sans"
            >
              <ArrowLeft size={10} /> Back to Dashboard
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
            <div>
              <Heading subtitle>Stay & Wellness Management</Heading>
              <Heading as="h1" accent className="tracking-wide text-2xl sm:text-3xl">
                Reservations Portal
              </Heading>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gold/10 font-sans text-[10px] uppercase tracking-widest gap-4">
              <button
                onClick={() => { setActiveTab("lodging"); cancelEdit(); }}
                className={`pb-2 transition-all cursor-pointer ${
                  activeTab === "lodging" ? "text-gold border-b border-gold font-medium" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Suites Stays
              </button>
              <button
                onClick={() => { setActiveTab("dining"); cancelEdit(); }}
                className={`pb-2 transition-all cursor-pointer ${
                  activeTab === "dining" ? "text-gold border-b border-gold font-medium" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Gastronomy Dining
              </button>
              <button
                onClick={() => { setActiveTab("spa"); cancelEdit(); }}
                className={`pb-2 transition-all cursor-pointer ${
                  activeTab === "spa" ? "text-gold border-b border-gold font-medium" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Wellness Spa
              </button>
            </div>
          </div>

          {actionSuccess && (
            <div className="p-3 border border-emerald-500/20 bg-emerald-950/20 text-emerald-400 text-xs font-sans text-center rounded-sm">
              {actionSuccess}
            </div>
          )}
          {actionError && (
            <div className="p-3 border border-red-500/20 bg-red-950/20 text-red-400 text-xs font-sans text-center rounded-sm">
              {actionError}
            </div>
          )}

          <div className="space-y-6">
            {currentList.length === 0 ? (
              <div className="p-12 border border-gold/10 bg-charcoal/10 rounded-sm text-center">
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-sans block">
                  {activeTab === "lodging"
                    ? "No Active Suite Bookings"
                    : activeTab === "dining"
                    ? "No Active Table Bookings"
                    : "No Active Spa Bookings"}
                </span>
                <p className="text-[9px] text-zinc-600 mt-1 font-light font-sans">
                  {activeTab === "lodging"
                    ? "You currently do not have any room stay reservations at AURELIA London."
                    : activeTab === "dining"
                    ? "You currently do not have any dining table reservations logged."
                    : "You currently do not have any wellness spa treatment sessions booked."}
                </p>
                <div className="mt-6">
                  <Link href={activeTab === "lodging" ? "/rooms" : activeTab === "dining" ? "/reserve" : "/spa"}>
                    <Button variant="outline" size="sm" className="uppercase tracking-widest font-sans text-[10px]">
                      {activeTab === "lodging"
                        ? "Book a Luxury Suite"
                        : activeTab === "dining"
                        ? "Reserve Dining Table"
                        : "Book Spa Treatment"}
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {currentList.map((res) => {
                  const isEditing = editingId === res.id;
                  const code = res.id.slice(0, 8).toUpperCase();

                  return (
                    <div key={res.id} className="p-5 border border-gold/10 bg-charcoal/40 relative rounded-sm luxury-glass flex flex-col gap-4">
                      {/* Top Reservation Row */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 border border-gold/15 bg-gold/5 text-gold">
                            {res.type === "Lodging" ? (
                              <BedDouble size={16} />
                            ) : res.type === "Dining" ? (
                              <Coffee size={16} />
                            ) : (
                              <Sparkles size={16} />
                            )}
                          </div>
                          <div>
                            <span className="text-[8px] uppercase tracking-widest font-sans text-zinc-500 block">Ref: AUR-{code}</span>
                            <h3 className="text-sm font-serif font-light text-zinc-200 tracking-wide mt-0.5">{res.name}</h3>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 text-[8px] uppercase tracking-widest font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-500/20">
                          {res.status}
                        </span>
                      </div>

                      {/* Detail row */}
                      {!isEditing ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans font-light text-zinc-400 py-2 border-y border-gold/5">
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-zinc-600 mb-0.5">Date</span>
                              <span className="text-zinc-300 font-medium font-sans font-light">
                                {new Date(res.date).toLocaleDateString("en-GB")}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-zinc-600 mb-0.5">
                                {res.type === "Lodging" ? "Check-out" : "Session Time"}
                              </span>
                              <span className="text-zinc-300 font-medium font-sans font-light">
                                {res.type === "Lodging"
                                  ? res.checkOutDate
                                    ? new Date(res.checkOutDate).toLocaleDateString("en-GB")
                                    : "N/A"
                                  : res.time || "N/A"}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-zinc-600 mb-0.5">Guests</span>
                              <span className="text-zinc-300 font-medium font-sans font-light">{res.guests} Guests</span>
                            </div>
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-zinc-600 mb-0.5">Estimated Spend</span>
                              <span className="text-zinc-300 font-mono font-medium">
                                {res.finalAmount ? `£${res.finalAmount.toFixed(2)}` : "TBD"}
                              </span>
                            </div>
                          </div>

                          {res.type === "Dining" && (res.dietaryRequirements || res.specialRequests) && (
                            <div className="text-[11px] font-sans font-light space-y-1 text-zinc-400">
                              {res.dietaryRequirements && (
                                <p><span className="text-gold font-medium uppercase text-[8px] tracking-wider mr-1">Dietary:</span> {res.dietaryRequirements}</p>
                              )}
                              {res.specialRequests && (
                                <p><span className="text-gold font-medium uppercase text-[8px] tracking-wider mr-1">Requests:</span> {res.specialRequests}</p>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Modification inline inputs form */
                        <div className="space-y-4 border-y border-gold/5 py-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans text-left">
                            <div className="space-y-1">
                              <label className="block text-[9px] uppercase tracking-wider text-gold font-sans font-medium">New Date</label>
                              <input
                                type="date"
                                className="w-full bg-black/60 border border-gold/15 p-2 text-xs text-zinc-200 outline-none rounded-sm font-sans"
                                value={editCheckIn}
                                onChange={(e) => setEditCheckIn(e.target.value)}
                              />
                            </div>
                            
                            {res.type === "Lodging" ? (
                              <div className="space-y-1">
                                <label className="block text-[9px] uppercase tracking-wider text-gold font-sans font-medium">New Check-out</label>
                                <input
                                  type="date"
                                  className="w-full bg-black/60 border border-gold/15 p-2 text-xs text-zinc-200 outline-none rounded-sm font-sans"
                                  value={editCheckOut}
                                  onChange={(e) => setEditCheckOut(e.target.value)}
                                />
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <label className="block text-[9px] uppercase tracking-wider text-gold font-sans font-medium">
                                  {res.type === "Spa" ? "Session Time" : "New Seating Time"}
                                </label>
                                <select
                                  className="w-full bg-black/60 border border-gold/15 p-2 text-xs text-zinc-200 outline-none rounded-sm cursor-pointer font-sans"
                                  value={editTime}
                                  onChange={(e) => setEditTime(e.target.value)}
                                >
                                  {res.type === "Spa" ? (
                                    <>
                                      <option value="09:00">09:00 AM</option>
                                      <option value="10:30">10:30 AM</option>
                                      <option value="12:00">12:00 PM</option>
                                      <option value="13:30">13:30 PM</option>
                                      <option value="15:00">15:00 PM</option>
                                      <option value="16:30">16:30 PM</option>
                                      <option value="18:00">18:00 PM</option>
                                    </>
                                  ) : (
                                    <>
                                      <option value="17:30">17:30 PM</option>
                                      <option value="18:00">18:00 PM</option>
                                      <option value="18:30">18:30 PM</option>
                                      <option value="19:00">19:00 PM</option>
                                      <option value="19:30">19:30 PM</option>
                                      <option value="20:00">20:00 PM</option>
                                      <option value="20:30">20:30 PM</option>
                                      <option value="21:00">21:00 PM</option>
                                      <option value="21:30">21:30 PM</option>
                                    </>
                                  )}
                                </select>
                              </div>
                            )}

                            <div className="space-y-1">
                              <label className="block text-[9px] uppercase tracking-wider text-gold font-sans font-medium">New Guests</label>
                              <select
                                className="w-full bg-black/60 border border-gold/15 p-2 text-xs text-zinc-200 outline-none rounded-sm cursor-pointer font-sans"
                                value={editGuests}
                                onChange={(e) => setEditGuests(parseInt(e.target.value))}
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                  <option key={num} value={num}>{num} Guests</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {res.type === "Dining" && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-left">
                              <div className="space-y-1">
                                <label className="block text-[9px] uppercase tracking-wider text-gold font-sans font-medium">Dietary Requirements</label>
                                <textarea
                                  rows={2}
                                  className="w-full bg-black/60 border border-gold/15 p-2 text-xs text-zinc-200 outline-none rounded-sm font-sans resize-none"
                                  value={editDietaryRequirements}
                                  onChange={(e) => setEditDietaryRequirements(e.target.value)}
                                  placeholder="E.g. allergies, vegan..."
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[9px] uppercase tracking-wider text-gold font-sans font-medium">Special Requests</label>
                                <textarea
                                  rows={2}
                                  className="w-full bg-black/60 border border-gold/15 p-2 text-xs text-zinc-200 outline-none rounded-sm font-sans resize-none"
                                  value={editSpecialRequests}
                                  onChange={(e) => setEditSpecialRequests(e.target.value)}
                                  placeholder="E.g. window table..."
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action buttons footer */}
                      <div className="flex flex-wrap gap-2 justify-end">
                        {!isEditing ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1 text-[9px] uppercase tracking-widest py-1.5 font-sans cursor-pointer"
                              onClick={() => mockDownloadPdf(res)}
                            >
                              <Download size={10} /> Voucher
                            </Button>
                            {res.status !== "cancelled" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1 text-[9px] uppercase tracking-widest py-1.5 text-zinc-300 hover:text-gold font-sans cursor-pointer"
                                  onClick={() => startEdit(res)}
                                  disabled={isPending}
                                >
                                  <Edit2 size={10} /> Modify
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1 text-[9px] uppercase tracking-widest py-1.5 text-red-400 border-red-500/20 hover:bg-red-950/20 font-sans cursor-pointer"
                                  onClick={() => handleCancel(res.id)}
                                  disabled={isPending}
                                >
                                  <XCircle size={10} /> Cancel
                                </Button>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[9px] py-1.5 uppercase tracking-widest font-sans cursor-pointer"
                              onClick={cancelEdit}
                              disabled={isPending}
                            >
                              Discard
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              className="text-[9px] py-1.5 uppercase tracking-widest font-sans cursor-pointer"
                              onClick={() => handleModify(res.id, res.type)}
                              disabled={isPending}
                            >
                              {isPending ? <RefreshCw size={10} className="animate-spin" /> : "Save Changes"}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </PageWrapper>
  );
}
