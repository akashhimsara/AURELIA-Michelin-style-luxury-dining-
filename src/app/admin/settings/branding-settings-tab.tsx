"use client";

import React, { useState, useTransition } from "react";
import { Save, Loader2, Palette, Moon, Sun, Sparkles } from "lucide-react";
import { updateBrandingSettings, type BrandingSettingsConfig } from "@/features/admin/actions/settings";
import { useRouter } from "next/navigation";

interface BrandingSettingsTabProps {
  config: BrandingSettingsConfig;
}

export function BrandingSettingsTab({ config }: BrandingSettingsTabProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState<BrandingSettingsConfig>(config);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      const res = await updateBrandingSettings(form);
      if (res.success) {
        setFeedback("Branding settings saved successfully!");
        router.refresh();
      } else {
        setFeedback(res.message || "Failed to update branding.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card rounded-sm border p-6 space-y-6 max-w-2xl text-[12px] font-sans">
      <div className="border-b border-current/5 pb-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Palette size={16} className="text-amber-500" /> System Branding & Aesthetics
        </h2>
        <p className="text-[10px] opacity-50 mt-0.5">
          Customize portal theme colors, dark mode defaults, typography, and logo branding.
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

      {/* Accent Color & Dark Mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Primary Accent Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={form.accentColor}
              onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
              className="w-9 h-9 rounded-sm cursor-pointer bg-transparent border border-current/10 p-0.5"
            />
            <input
              type="text"
              value={form.accentColor}
              onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
              className="flex-1 rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none font-mono"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Portal Theme Mode</label>
          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.darkMode}
                onChange={(e) => setForm({ ...form, darkMode: e.target.checked })}
                className="accent-amber-500 rounded-xs"
              />
              <span className="font-semibold flex items-center gap-1">
                <Moon size={14} className="text-amber-500" /> Default Dark Mode
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Typography Suite</label>
        <select
          value={form.fontFamily}
          onChange={(e) => setForm({ ...form, fontFamily: e.target.value })}
          className="w-full rounded-sm border border-current/10 bg-transparent px-2 py-2 outline-none"
        >
          <option value="Cinzel & Inter">Cinzel (Headings) + Inter (Body) — Modern Luxury</option>
          <option value="Cormorant & Roboto">Cormorant Garamond + Roboto — Heritage Serif</option>
          <option value="Outfit & Inter">Outfit + Inter — Contemporary Minimalist</option>
        </select>
      </div>

      {/* Logo & Favicon URLs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Brand Logo URL</label>
          <input
            type="text"
            required
            value={form.logoUrl}
            onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
            className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none font-mono text-[11px]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Favicon URL</label>
          <input
            type="text"
            required
            value={form.faviconUrl}
            onChange={(e) => setForm({ ...form, faviconUrl: e.target.value })}
            className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none font-mono text-[11px]"
          />
        </div>
      </div>

      {/* Live Preview Box */}
      <div className="p-4 rounded-sm border border-current/10 bg-zinc-950 text-white space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-amber-500 font-semibold flex items-center gap-1">
          <Sparkles size={12} /> Theme Preview Card
        </p>
        <h3 className="text-base font-serif font-bold text-amber-500">AURELIA Mayfair</h3>
        <p className="text-[11px] opacity-70">Experience bespoke luxury with customized accent highlights.</p>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-amber-500 text-zinc-950 font-semibold rounded-sm text-xs hover:bg-amber-400 disabled:opacity-40 transition-colors flex items-center gap-1.5 shadow-xs"
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Branding Preferences
        </button>
      </div>
    </form>
  );
}
