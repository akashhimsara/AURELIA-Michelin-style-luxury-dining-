import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { ModulePlaceholder } from "@/components/admin/module-placeholder";
import { Terminal } from "lucide-react";

export const metadata: Metadata = { title: "System Logs — AURELIA Admin" };

export default function SystemLogsPage() {
  return (
    <>
      <PageHeader title="System Logs" description="Server audit trail, API request logs, and error monitoring." />
      <ModulePlaceholder moduleName="System Logs" icon={Terminal} description="Real-time log streaming, error trace records, API webhook audit trails, and admin action history will be displayed here." />
    </>
  );
}
