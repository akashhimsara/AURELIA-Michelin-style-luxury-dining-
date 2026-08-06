"use client";

import React, { useState, useTransition } from "react";
import { Database, Download, RefreshCw, Loader2, CheckCircle2, Shield } from "lucide-react";
import { createSystemBackup } from "@/features/admin/actions/settings";
import { useRouter } from "next/navigation";

interface BackupMaintenanceTabProps {
  backupInfo: {
    lastBackupDate: string;
    autoBackupFrequency: "daily" | "weekly" | "monthly";
    totalBackupsCount: number;
  };
}

export function BackupMaintenanceTab({ backupInfo }: BackupMaintenanceTabProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleBackup = () => {
    setFeedback(null);
    startTransition(async () => {
      const res = await createSystemBackup();
      if (res.success && res.dump) {
        setFeedback("Database backup generated successfully!");

        // Download database dump JSON file
        const blob = new Blob([res.dump], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `aurelia-database-dump-${new Date().toISOString().split("T")[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        router.refresh();
      } else {
        setFeedback(res.message || "Failed to create backup.");
      }
    });
  };

  return (
    <div className="admin-card rounded-sm border p-6 space-y-6 max-w-2xl text-[12px] font-sans">
      <div className="border-b border-current/5 pb-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Database size={16} className="text-amber-500" /> Database Backup & Disaster Recovery
        </h2>
        <p className="text-[10px] opacity-50 mt-0.5">
          Generate encrypted database backups, download JSON snapshots, and configure automated backup schedules.
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

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-sm border border-current/10 bg-current/2 space-y-1">
          <p className="text-[10px] uppercase tracking-widest opacity-40">Last Backup Generated</p>
          <p className="font-semibold font-mono text-amber-500">
            {new Date(backupInfo.lastBackupDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
        </div>

        <div className="p-4 rounded-sm border border-current/10 bg-current/2 space-y-1">
          <p className="text-[10px] uppercase tracking-widest opacity-40">Total Backups Vault</p>
          <p className="font-semibold font-mono text-emerald-500">
            {backupInfo.totalBackupsCount} Snapshots
          </p>
        </div>
      </div>

      {/* Action Trigger */}
      <div className="p-5 rounded-sm border border-amber-500/20 bg-amber-500/5 space-y-3">
        <div className="flex items-center gap-2 text-amber-500 font-semibold">
          <Shield size={16} /> Manual Immediate System Backup
        </div>
        <p className="opacity-70 text-[11px]">
          Clicking below creates a cryptographically signed backup of all guest CRM profiles, suite catalog, reservations, and audit logs.
        </p>
        <button
          type="button"
          onClick={handleBackup}
          disabled={isPending}
          className="px-4 py-2 bg-amber-500 text-zinc-950 font-semibold rounded-sm text-xs hover:bg-amber-400 disabled:opacity-40 transition-colors flex items-center gap-1.5 shadow-xs"
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} Create & Download DB Dump (.json)
        </button>
      </div>
    </div>
  );
}
