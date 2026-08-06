import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { getSystemSettingsData } from "@/features/admin/actions/settings";
import { SettingsShell } from "./settings-shell";

export const metadata: Metadata = {
  title: "System Settings & Administration — AURELIA Admin",
  description: "Hotel profile, branding theme, email/SMS templates, RBAC permission matrix, audit trail logs, backups, and security policies.",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const data = await getSystemSettingsData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings & Governance"
        description="Configure property details, branding themes, transactional communication templates, 9-role permission matrix, audit logs, and security policies."
      />
      <SettingsShell data={data} />
    </div>
  );
}
