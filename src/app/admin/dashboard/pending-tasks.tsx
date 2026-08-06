"use client";

import React, { useState } from "react";
import { CheckSquare, BedDouble, UtensilsCrossed, AlertCircle } from "lucide-react";

interface Task {
  id: string;
  name: string;
  email: string;
  bookedRoomName: string | null;
  date: string;
  status: string;
  roomId: string | null;
  createdAt: string;
}

interface PendingTasksProps {
  data: Task[];
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function PendingTasks({ data }: PendingTasksProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = data.filter((t) => !dismissed.has(t.id));

  return (
    <div className="admin-card rounded-sm border p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-sm bg-red-500/10 flex items-center justify-center">
          <AlertCircle size={14} className="text-red-400" />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest opacity-50 font-sans">Action Required</p>
          <p className="text-sm font-semibold font-sans">Pending Tasks</p>
        </div>
        {visible.length > 0 && (
          <span className="ml-auto text-[11px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full font-medium">
            {visible.length}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {visible.length === 0 ? (
          <div className="py-6 text-center">
            <CheckSquare size={24} className="mx-auto mb-2 text-emerald-500 opacity-60" />
            <p className="text-[12px] opacity-40">All tasks are cleared!</p>
          </div>
        ) : (
          visible.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 rounded-sm border border-current/5 px-3 py-2.5 hover:bg-current/3 transition-colors"
            >
              <div className="flex-shrink-0 text-amber-500">
                {task.roomId ? <BedDouble size={14} /> : <UtensilsCrossed size={14} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium truncate">
                  {task.name}
                </p>
                <p className="text-[10px] opacity-50 truncate">
                  {task.bookedRoomName || "Dining"} · {timeAgo(task.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setDismissed((s) => new Set([...s, task.id]))}
                className="shrink-0 text-[10px] text-emerald-500 border border-emerald-500/30 px-2 py-0.5 rounded-sm hover:bg-emerald-500/10 transition-colors"
                aria-label="Dismiss task"
              >
                Dismiss
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
