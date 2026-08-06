import React from "react";
import { CreditCard, CheckCircle2, Clock } from "lucide-react";

interface Payment {
  id: string;
  name: string;
  email: string;
  finalAmount: number;
  paymentStatus: string;
  bookedRoomName: string | null;
  createdAt: string;
}

interface LatestPaymentsProps {
  data: Payment[];
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function LatestPayments({ data }: LatestPaymentsProps) {
  return (
    <div className="admin-card rounded-sm border p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-sm bg-emerald-500/10 flex items-center justify-center">
          <CreditCard size={14} className="text-emerald-500" />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest opacity-50 font-sans">Latest</p>
          <p className="text-sm font-semibold font-sans">Payments</p>
        </div>
      </div>

      <div className="space-y-3">
        {data.length === 0 ? (
          <p className="text-[12px] opacity-40 py-4 text-center">No payments recorded yet</p>
        ) : (
          data.map((p) => (
            <div key={p.id} className="flex items-center gap-3 py-2 border-b last:border-0 border-current/5">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-[10px] font-bold">
                {initials(p.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium truncate">{p.name}</p>
                <p className="text-[11px] opacity-50 truncate">{p.bookedRoomName || "Dining"}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[13px] font-semibold text-emerald-500">
                  £{p.finalAmount.toLocaleString("en-GB")}
                </p>
                <p className="text-[10px] opacity-40 flex items-center gap-0.5 justify-end">
                  {p.paymentStatus === "paid" ? (
                    <CheckCircle2 size={9} className="text-emerald-500" />
                  ) : (
                    <Clock size={9} />
                  )}
                  {timeAgo(p.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
