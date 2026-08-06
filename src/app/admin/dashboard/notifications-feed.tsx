import React from "react";
import { Bell, Mail, Clock } from "lucide-react";

interface Notification {
  id: string;
  type: "message" | "reservation";
  title: string;
  body: string;
  time: string;
}

interface NotificationsFeedProps {
  data: Notification[];
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationsFeed({ data }: NotificationsFeedProps) {
  return (
    <div className="admin-card rounded-sm border p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-sm bg-amber-500/10 flex items-center justify-center">
          <Bell size={14} className="text-amber-500" />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest opacity-50 font-sans">Inbox</p>
          <p className="text-sm font-semibold font-sans">Notifications</p>
        </div>
        {data.length > 0 && (
          <span className="ml-auto text-[11px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-medium">
            {data.length}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {data.length === 0 ? (
          <p className="text-[12px] opacity-40 py-4 text-center">No notifications</p>
        ) : (
          data.map((n) => (
            <div key={n.id} className="flex items-start gap-3 py-2 border-b last:border-0 border-current/5">
              <div
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${
                  n.type === "message"
                    ? "bg-sky-500/10 text-sky-500"
                    : "bg-amber-500/10 text-amber-500"
                }`}
              >
                {n.type === "message" ? <Mail size={12} /> : <Clock size={12} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium truncate">{n.title}</p>
                <p className="text-[11px] opacity-50 truncate">{n.body}</p>
                <p className="text-[10px] opacity-35 mt-0.5">{timeAgo(n.time)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
