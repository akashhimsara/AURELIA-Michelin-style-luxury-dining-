import React from "react";
import { ClipboardList, BedDouble, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

interface Reservation {
  id: string;
  name: string;
  email: string;
  bookedRoomName: string | null;
  date: string;
  finalAmount: number | null;
  status: string;
  roomId: string | null;
  createdAt: string;
}

interface RecentReservationsProps {
  data: Reservation[];
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-500",
    confirmed: "bg-emerald-500/10 text-emerald-500",
    cancelled: "bg-red-500/10 text-red-400",
  };
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-sm ${map[status] ?? "bg-gray-500/10 text-gray-400"}`}>
      {status}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

export function RecentReservations({ data }: RecentReservationsProps) {
  return (
    <div className="admin-card rounded-sm border p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-sm bg-sky-500/10 flex items-center justify-center">
          <ClipboardList size={14} className="text-sky-500" />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest opacity-50 font-sans">Live Feed</p>
          <p className="text-sm font-semibold font-sans">Recent Reservations</p>
        </div>
        <Link
          href="/admin/reservations"
          className="ml-auto text-[11px] opacity-50 hover:opacity-100 transition-opacity"
        >
          View all →
        </Link>
      </div>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-current/5">
              <th className="text-left py-2 px-1 font-medium opacity-40 uppercase tracking-wide">Guest</th>
              <th className="text-left py-2 px-1 font-medium opacity-40 uppercase tracking-wide hidden sm:table-cell">Type</th>
              <th className="text-left py-2 px-1 font-medium opacity-40 uppercase tracking-wide hidden md:table-cell">Date</th>
              <th className="text-right py-2 px-1 font-medium opacity-40 uppercase tracking-wide">Amount</th>
              <th className="text-right py-2 px-1 font-medium opacity-40 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 opacity-40">
                  No reservations yet
                </td>
              </tr>
            ) : (
              data.map((r) => (
                <tr key={r.id} className="border-b border-current/5 hover:bg-current/3 transition-colors">
                  <td className="py-2.5 px-1">
                    <p className="font-medium truncate max-w-[130px]">{r.name}</p>
                    <p className="opacity-40 truncate max-w-[130px]">{r.email}</p>
                  </td>
                  <td className="py-2.5 px-1 hidden sm:table-cell">
                    <span className="flex items-center gap-1 opacity-70">
                      {r.roomId ? (
                        <><BedDouble size={10} />{r.bookedRoomName || "Suite"}</>
                      ) : (
                        <><UtensilsCrossed size={10} />Dining</>
                      )}
                    </span>
                  </td>
                  <td className="py-2.5 px-1 opacity-60 hidden md:table-cell">
                    {formatDate(r.date)}
                  </td>
                  <td className="py-2.5 px-1 text-right font-semibold">
                    {r.finalAmount ? `£${r.finalAmount.toLocaleString("en-GB")}` : "—"}
                  </td>
                  <td className="py-2.5 px-1 text-right">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
