import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { ModulePlaceholder } from "@/components/admin/module-placeholder";
import { Home } from "lucide-react";

export const metadata: Metadata = { title: "Housekeeping — AURELIA Admin" };

export default function HousekeepingPage() {
  return (
    <>
      <PageHeader title="Housekeeping" description="Room status tracking, cleaning assignments, and inspection logs." />
      <ModulePlaceholder moduleName="Housekeeping" icon={Home} description="Room cleaning schedules, status boards (clean/dirty/inspect), staff assignments, and maintenance tickets will be managed here." />
    </>
  );
}
