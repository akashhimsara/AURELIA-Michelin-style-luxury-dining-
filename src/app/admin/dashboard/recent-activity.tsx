import React from "react";
import { BedDouble, UtensilsCrossed, Mail, CheckCircle2, Clock, XCircle } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "reservation" | "message";
  title: string;
  detail: string;
  status: string;
  time: string;
}

interface RecentActivityProps {
  data: ActivityItem[];
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function statusIcon(status: string) {
  switch (status) {
    case "confirmed":
    case "read":
      return <CheckCircle2 size={10} className="text-emerald-500" />;
    case "cancelled":
    case "archived":
      return <XCircle size={10} className="text-red-400" />;
    default:
      return <Clock size={10} className="text-amber-500" />;
  }
}

export function RecentActivity({ data }: RecentActivityProps) {
  return (
    <div className="admin-card rounded-sm border p-5">
      <div className="mb-5">
        <p className="text-[11px] uppercase tracking-widest opacity-50 font-sans">Timeline</p>
        <p className="text-sm font-semibold font-sans">Recent Activity</p>
      </div>

      {data.length === 0 ? (
        <p className="text-[12px] opacity-40 py-4 text-center">No recent activity</p>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[15px] top-0 bottom-0 w-px bg-current opacity-[0.07]" />

          <div className="space-y-0">
            {data.map((item, i) => (
              <div key={item.id} className="flex items-start gap-4 pb-4 last:pb-0">
                {/* Timeline dot */}
                <div
                  className={`relative z-10 shrink-0 w-[30px] h-[30px] rounded-full flex items-center justify-center mt-0.5 ${
                    item.type === "reservation"
                      ? item.status === "confirmed"
                        ? "bg-emerald-500/15 text-emerald-500"
                        : item.status === "cancelled"
                        ? "bg-red-500/15 text-red-400"
                        : "bg-amber-500/15 text-amber-500"
                      : "bg-sky-500/15 text-sky-500"
                  }`}
                >
                  {item.type === "message" ? (
                    <Mail size={12} />
                  ) : item.detail.toLowerCase().includes("dining") || !item.detail ? (
                    <UtensilsCrossed size={12} />
                  ) : (
                    <BedDouble size={12} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-[12px] font-medium">{item.title}</p>
                    <span className="flex items-center gap-0.5 text-[10px] opacity-50">
                      {statusIcon(item.status)}
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-50 truncate">{item.detail}</p>
                </div>

                {/* Time */}
                <p className="shrink-0 text-[10px] opacity-35 pt-1.5">{timeAgo(item.time)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
