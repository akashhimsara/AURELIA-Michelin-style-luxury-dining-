"use client";

import React, { useState, useTransition } from "react";
import { Check, X, Search, Calendar, Coffee, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { approveReservation, cancelReservation } from "@/features/admin/actions/reservations";
import { useRouter } from "next/navigation";

interface SerializedReservation {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  date: string;
  checkOutDate: string | null;
  time: string | null;
  guests: number;
  children: number;
  status: string;
  bookedRoomName: string | null;
  finalAmount: number | null;
  roomId: string | null;
  createdAt: string;
}

interface ReservationsTableProps {
  initialReservations: SerializedReservation[];
}

export function ReservationsTable({ initialReservations }: ReservationsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Handle action calls
  const handleApprove = (id: string) => {
    setError(null);
    startTransition(async () => {
      const res = await approveReservation(id);
      if (res.success) {
        router.refresh();
      } else {
        setError(res.message || "Failed to approve reservation.");
      }
    });
  };

  const handleCancel = (id: string) => {
    setError(null);
    startTransition(async () => {
      const res = await cancelReservation(id);
      if (res.success) {
        router.refresh();
      } else {
        setError(res.message || "Failed to cancel reservation.");
      }
    });
  };

  // Filters logic
  const filteredReservations = initialReservations.filter((r) => {
    const matchesTab = activeTab === "all" || r.status.toLowerCase() === activeTab;
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.bookedRoomName && r.bookedRoomName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 text-xs bg-red-950/20 border border-red-500/20 text-red-400 rounded-sm">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Tabs */}
        <div className="flex border border-zinc-200 dark:border-zinc-800 p-0.5 rounded-sm bg-zinc-50 dark:bg-zinc-950 w-full sm:w-auto">
          {(["all", "pending", "confirmed", "cancelled"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-medium uppercase tracking-wider rounded-sm cursor-pointer transition-colors ${
                activeTab === tab
                  ? "bg-amber-500 text-zinc-950 font-semibold"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Search reservations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-zinc-200 dark:border-zinc-800 rounded-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 outline-none focus:border-amber-500/40"
          />
        </div>
      </div>

      {/* Reservations Table */}
      <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-sm bg-white dark:bg-zinc-900/60 backdrop-blur-md">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-left text-xs font-sans">
          <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 uppercase tracking-widest font-semibold text-[10px]">
            <tr>
              <th className="px-6 py-3.5">Ref ID</th>
              <th className="px-6 py-3.5">Guest details</th>
              <th className="px-6 py-3.5">Arrangement</th>
              <th className="px-6 py-3.5">Schedule</th>
              <th className="px-6 py-3.5">Amount</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
            {filteredReservations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-zinc-400 dark:text-zinc-500">
                  <div className="flex flex-col items-center gap-1.5 justify-center">
                    {isPending ? (
                      <RefreshCw className="animate-spin text-amber-500" size={20} />
                    ) : (
                      <>
                        <Calendar size={18} />
                        <span>No reservations catalog items match the query criteria.</span>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredReservations.map((res) => {
                const isRoom = !!res.roomId;
                return (
                  <tr key={res.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                    {/* Ref ID */}
                    <td className="px-6 py-4 font-mono font-medium text-amber-600 dark:text-amber-500">
                      AUR-{res.id.slice(0, 8).toUpperCase()}
                    </td>

                    {/* Guest Name & Contact */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100">{res.name}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{res.email}</p>
                      {res.phone && <p className="text-[10px] text-zinc-500">{res.phone}</p>}
                    </td>

                    {/* Arrangement Type & Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`p-1 rounded-sm border ${
                          isRoom
                            ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
                            : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                        }`}>
                          {isRoom ? <Calendar size={12} /> : <Coffee size={12} />}
                        </span>
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-zinc-200">
                            {res.bookedRoomName || "Fine Dining Seating"}
                          </p>
                          <p className="text-[9px] uppercase tracking-wider text-zinc-500 mt-0.5">
                            {isRoom ? "Suite stay" : "Restaurant table"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Schedule (Check-in/out or slot time) */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-zinc-800 dark:text-zinc-300">
                        {new Date(res.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        {isRoom && res.checkOutDate
                          ? `Checkout: ${new Date(res.checkOutDate).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}`
                          : `Seating time: ${res.time}`}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        {res.guests} Adults {res.children > 0 ? `, ${res.children} Children` : ""}
                      </p>
                    </td>

                    {/* finalAmount */}
                    <td className="px-6 py-4 font-mono font-medium">
                      {res.finalAmount ? `£${res.finalAmount.toFixed(2)}` : "—"}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-[9px] uppercase tracking-widest font-semibold border rounded-sm ${
                        res.status === "confirmed"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : res.status === "cancelled"
                          ? "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                          : "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400 animate-pulse"
                      }`}>
                        {res.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      {res.status === "pending" && (
                        <div className="flex gap-2 justify-end">
                          <button
                            id={`approve-btn-${res.id.slice(0, 8)}`}
                            onClick={() => handleApprove(res.id)}
                            disabled={isPending}
                            title="Approve Reservation"
                            className="p-1.5 rounded-sm border border-emerald-500/20 hover:border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500 hover:text-zinc-950 text-emerald-600 dark:text-emerald-400 cursor-pointer transition-colors"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            id={`cancel-btn-${res.id.slice(0, 8)}`}
                            onClick={() => handleCancel(res.id)}
                            disabled={isPending}
                            title="Cancel Reservation"
                            className="p-1.5 rounded-sm border border-red-500/20 hover:border-red-500 bg-red-500/10 hover:bg-red-500 hover:text-zinc-950 text-red-600 dark:text-red-400 cursor-pointer transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
