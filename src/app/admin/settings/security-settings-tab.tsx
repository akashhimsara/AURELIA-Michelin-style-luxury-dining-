"use client";

import React, { useState, useTransition } from "react";
import { ShieldCheck, Save, Loader2, KeyRound, Lock } from "lucide-react";
import { updateSecuritySettings, type SystemSettingsData } from "@/features/admin/actions/settings";
import { useRouter } from "next/navigation";

interface SecuritySettingsTabProps {
  security: SystemSettingsData["security"];
}

export function SecuritySettingsTab({ security }: SecuritySettingsTabProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState(security);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      const res = await updateSecuritySettings(form);
      if (res.success) {
        setFeedback("Security settings saved successfully!");
        router.refresh();
      } else {
        setFeedback(res.message || "Failed to update security settings.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card rounded-sm border p-6 space-y-6 max-w-2xl text-[12px] font-sans">
      <div className="border-b border-current/5 pb-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <ShieldCheck size={16} className="text-amber-500" /> System Security & Access Controls
        </h2>
        <p className="text-[10px] opacity-50 mt-0.5">
          Configure session timeouts, 2FA authentication enforcement, rate limiting, and IP whitelisting.
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

      {/* Session Timeout & 2FA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Session Inactivity Timeout (Mins)</label>
          <input
            type="number"
            required
            min={5}
            max={240}
            value={form.sessionTimeoutMins}
            onChange={(e) => setForm({ ...form, sessionTimeoutMins: Number(e.target.value) })}
            className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Enforce 2FA for Staff</label>
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input
                type="checkbox"
                checked={form.enforce2FA}
                onChange={(e) => setForm({ ...form, enforce2FA: e.target.checked })}
                className="accent-amber-500 rounded-xs"
              />
              Mandatory Two-Factor Auth (2FA)
            </label>
          </div>
        </div>
      </div>

      {/* Max Attempts */}
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Max Failed Logins Before Lockout</label>
        <select
          value={form.maxLoginAttempts}
          onChange={(e) => setForm({ ...form, maxLoginAttempts: Number(e.target.value) })}
          className="w-full rounded-sm border border-current/10 bg-transparent px-2 py-2 outline-none"
        >
          <option value={3}>3 Attempts (Strict)</option>
          <option value={5}>5 Attempts (Recommended)</option>
          <option value={10}>10 Attempts</option>
        </select>
      </div>

      {/* IP Whitelist */}
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Admin IP Access Whitelist</label>
        <textarea
          rows={3}
          value={form.ipWhitelist}
          onChange={(e) => setForm({ ...form, ipWhitelist: e.target.value })}
          placeholder="e.g. 192.168.1.*, 10.0.0.12"
          className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none font-mono text-[11px] resize-none"
        />
        <p className="text-[9px] opacity-40">Leave empty or use wildcard pattern to allow all internal subnet connections.</p>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-amber-500 text-zinc-950 font-semibold rounded-sm text-xs hover:bg-amber-400 disabled:opacity-40 transition-colors flex items-center gap-1.5 shadow-xs"
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Security Policies
        </button>
      </div>
    </form>
  );
}
