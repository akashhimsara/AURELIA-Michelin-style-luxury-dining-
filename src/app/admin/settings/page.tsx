import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { ModulePlaceholder } from "@/components/admin/module-placeholder";
import { Settings } from "lucide-react";

export const metadata: Metadata = { title: "Settings — AURELIA Admin" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="System preferences, integrations, and admin configuration." />
      <ModulePlaceholder moduleName="Settings" icon={Settings} description="Stripe API keys, Resend email templates, admin user management, portal preferences, and system integrations will be configured here." />
    </>
  );
}
