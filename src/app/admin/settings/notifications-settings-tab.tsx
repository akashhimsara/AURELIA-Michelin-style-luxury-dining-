"use client";

import React, { useState, useTransition } from "react";
import { Bell, Save, Loader2, Mail, ShieldAlert, Sparkles } from "lucide-react";
import { updateNotificationSettings } from "@/features/admin/actions/settings";
import { useRouter } from "next/navigation";

interface NotificationsSettingsTabProps {
  notifications: {
    emailOnNewBooking: boolean;
    emailOnDiningBooking: boolean;
    alertOnVipCheckIn: boolean;
    alertOnCancellation: boolean;
    dailyDigestEmail: boolean;
  };
}

export function NotificationsSettingsTab({ notifications }: NotificationsSettingsTabProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState(notifications);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      const res = await updateNotificationSettings(form);
      if (res.success) {
        setFeedback("Notification preferences saved successfully!");
        router.refresh();
      } else {
        setFeedback(res.message || "Failed to save notifications.");
      }
    });
  };

  const ToggleRow = ({
    label,
    desc,
    checked,
    onChange,
  }: {
    label: string;
    desc: string;
    checked: boolean;
    onChange: (val: boolean) => void;
  }) => (
    <div className="flex items-center justify-between py-3 border-b border-current/5">
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-[10px] opacity-40 mt-0.5">{desc}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-9 h-5 bg-current/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
      </label>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="admin-card rounded-sm border p-6 space-y-6 max-w-2xl text-[12px] font-sans">
      <div className="border-b border-current/5 pb-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Bell size={16} className="text-amber-500" /> Dispatch Alerts & Notification Preferences
        </h2>
        <p className="text-[10px] opacity-50 mt-0.5">
          Choose which guest events trigger instant email dispatches or concierge pushes.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-2.5 rounded-sm text-[11px] ${
            feedback.startsWith("Error") ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-500"
          }`}
        >
          {feedback}
        </div>
      )}

      <div className="space-y-1">
        <ToggleRow
          label="Instant Alert on New Suite Booking"
          desc="Sends immediate email notification to reception staff when a suite is booked."
          checked={form.emailOnNewBooking}
          onChange={(val) => setForm({ ...form, emailOnNewBooking: val })}
        />
        <ToggleRow
          label="Instant Alert on Fine Dining Booking"
          desc="Notifies restaurant manager of new table reservations."
          checked={form.emailOnDiningBooking}
          onChange={(val) => setForm({ ...form, emailOnDiningBooking: val })}
        />
        <ToggleRow
          label="High-Priority VIP Guest Arrival Push"
          desc="Alerts concierge and duty manager when a Gold, Platinum, or Elite VIP registers or checks in."
          checked={form.alertOnVipCheckIn}
          onChange={(val) => setForm({ ...form, alertOnVipCheckIn: val })}
        />
        <ToggleRow
          label="Booking Cancellation Alerts"
          desc="Sends notification when a reservation is cancelled or refunded."
          checked={form.alertOnCancellation}
          onChange={(val) => setForm({ ...form, alertOnCancellation: val })}
        />
        <ToggleRow
          label="Daily Financial Summary Digest"
          desc="Sends midnight summary email with daily gross revenue, occupancy, and covers."
          checked={form.dailyDigestEmail}
          onChange={(val) => setForm({ ...form, dailyDigestEmail: val })}
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-amber-500 text-zinc-950 font-semibold rounded-sm text-xs hover:bg-amber-400 disabled:opacity-40 transition-colors flex items-center gap-1.5 shadow-xs"
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Notification Preferences
        </button>
      </div>
    </form>
  );
}
