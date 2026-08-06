"use client";

import React, { useState } from "react";
import {
  Building, Palette, Mail, Bell, ShieldCheck, Lock, Database, Shield, RefreshCw
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { SystemSettingsData } from "@/features/admin/actions/settings";
import { HotelSettingsTab } from "./hotel-settings-tab";
import { BrandingSettingsTab } from "./branding-settings-tab";
import { TemplateEditorTab } from "./template-editor-tab";
import { NotificationsSettingsTab } from "./notifications-settings-tab";
import { RolesPermissionMatrix } from "./roles-permission-matrix";
import { AuditLogsTable } from "./audit-logs-table";
import { BackupMaintenanceTab } from "./backup-maintenance-tab";
import { SecuritySettingsTab } from "./security-settings-tab";

type SettingsTab = "hotel" | "branding" | "templates" | "notifications" | "roles" | "audit" | "backup" | "security";

interface SettingsShellProps {
  data: SystemSettingsData;
}

const TABS: { key: SettingsTab; label: string; icon: React.ElementType }[] = [
  { key: "hotel", label: "Hotel Profile", icon: Building },
  { key: "branding", label: "Branding", icon: Palette },
  { key: "templates", label: "Email & SMS Templates", icon: Mail },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "roles", label: "Roles & Permissions", icon: ShieldCheck },
  { key: "audit", label: "Audit & Activity Logs", icon: Lock },
  { key: "backup", label: "Backups", icon: Database },
  { key: "security", label: "Security & 2FA", icon: Shield },
];

export function SettingsShell({ data }: SettingsShellProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>("hotel");

  return (
    <div className="space-y-6">
      {/* Module Navigation Tabs */}
      <div className="flex border-b border-current/10 gap-1 overflow-x-auto print:hidden">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider font-sans border-b-2 transition-colors whitespace-nowrap ${
              activeTab === key
                ? "border-amber-500 text-amber-500"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === "hotel" && <HotelSettingsTab config={data.hotel} />}
      {activeTab === "branding" && <BrandingSettingsTab config={data.branding} />}
      {activeTab === "templates" && (
        <TemplateEditorTab emailTemplates={data.emailTemplates} smsTemplates={data.smsTemplates} />
      )}
      {activeTab === "notifications" && <NotificationsSettingsTab notifications={data.notifications} />}
      {activeTab === "roles" && <RolesPermissionMatrix permissionMatrix={data.permissionMatrix} />}
      {activeTab === "audit" && <AuditLogsTable logs={data.auditLogs} />}
      {activeTab === "backup" && <BackupMaintenanceTab backupInfo={data.backup} />}
      {activeTab === "security" && <SecuritySettingsTab security={data.security} />}
    </div>
  );
}
