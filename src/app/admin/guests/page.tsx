import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { ModulePlaceholder } from "@/components/admin/module-placeholder";
import { Users } from "lucide-react";

export const metadata: Metadata = { title: "Guests — AURELIA Admin" };

export default function GuestsPage() {
  return (
    <>
      <PageHeader title="Guests" description="Guest CRM registry, profiles, and stay history." />
      <ModulePlaceholder moduleName="Guests" icon={Users} description="Guest profiles, loyalty tiers, contact details, and reservation history will be displayed here." />
    </>
  );
}
