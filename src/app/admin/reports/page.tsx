import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { ModulePlaceholder } from "@/components/admin/module-placeholder";
import { FileBarChart2 } from "lucide-react";

export const metadata: Metadata = { title: "Reports — AURELIA Admin" };

export default function ReportsPage() {
  return (
    <>
      <PageHeader title="Reports" description="Analytical reports, occupancy trends, and operational insights." />
      <ModulePlaceholder moduleName="Reports" icon={FileBarChart2} description="Revenue reports, occupancy charts, guest analytics, and exportable data tables will be available here." />
    </>
  );
}
