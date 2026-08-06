"use client";

import React, { useState, useTransition } from "react";
import { Save, Loader2, Building, Clock, MapPin, Globe } from "lucide-react";
import { updateHotelSettings, type HotelSettingsConfig } from "@/features/admin/actions/settings";
import { useRouter } from "next/navigation";

interface HotelSettingsTabProps {
  config: HotelSettingsConfig;
}

export function HotelSettingsTab({ config }: HotelSettingsTabProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState<HotelSettingsConfig>(config);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      const res = await updateHotelSettings(form);
      if (res.success) {
        setFeedback("Hotel settings saved successfully!");
        router.refresh();
      } else {
        setFeedback(res.message || "Failed to update settings.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card rounded-sm border p-6 space-y-6 max-w-2xl text-[12px] font-sans">
      <div className="border-b border-current/5 pb-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Building size={16} className="text-amber-500" /> Property Profile & Operating Hours
        </h2>
        <p className="text-[10px] opacity-50 mt-0.5">
          Configure property branding, contact details, currency, timezone, and check-in/out policies.
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

      {/* Property Name & Tagline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Hotel Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none focus:border-amber-500/40"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Tagline / Motto</label>
          <input
            type="text"
            required
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none focus:border-amber-500/40"
          />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Property Address</label>
        <input
          type="text"
          required
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none focus:border-amber-500/40"
        />
      </div>

      {/* Phone & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Concierge Phone</label>
          <input
            type="text"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none focus:border-amber-500/40 font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Official Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none focus:border-amber-500/40"
          />
        </div>
      </div>

      {/* Currency & Timezone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Base Currency</label>
          <select
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            className="w-full rounded-sm border border-current/10 bg-transparent px-2 py-2 outline-none focus:border-amber-500/40"
          >
            <option value="GBP (£)">GBP (£) British Pound</option>
            <option value="USD ($)">USD ($) US Dollar</option>
            <option value="EUR (€)">EUR (€) Euro</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Property Timezone</label>
          <input
            type="text"
            required
            value={form.timezone}
            onChange={(e) => setForm({ ...form, timezone: e.target.value })}
            className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none focus:border-amber-500/40 font-mono"
          />
        </div>
      </div>

      {/* Check-in & Check-out Times */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Standard Check-In Time</label>
          <input
            type="text"
            required
            value={form.checkInTime}
            onChange={(e) => setForm({ ...form, checkInTime: e.target.value })}
            className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none focus:border-amber-500/40 font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Standard Check-Out Time</label>
          <input
            type="text"
            required
            value={form.checkOutTime}
            onChange={(e) => setForm({ ...form, checkOutTime: e.target.value })}
            className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none focus:border-amber-500/40 font-mono"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-amber-500 text-zinc-950 font-semibold rounded-sm text-xs hover:bg-amber-400 disabled:opacity-40 transition-colors flex items-center gap-1.5 shadow-xs"
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Hotel Settings
        </button>
      </div>
    </form>
  );
}
