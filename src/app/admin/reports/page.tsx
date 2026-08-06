import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { getReportsData } from "@/features/admin/actions/reports";
import { ReportsShell } from "./reports-shell";

export const metadata: Metadata = {
  title: "Reports & Analytics — AURELIA Admin",
  description: "Executive business intelligence, RevPAR, ADR, occupancy trends, guest demographics, and departmental analytics.",
};

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const data = await getReportsData("30d", "all");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Intelligence & Analytical Reports"
        description="Monitor real-time RevPAR, ADR, suite occupancy trends, guest CRM analytics, restaurant covers, and exportable reports."
      />
      <ReportsShell data={data} />
    </div>
  );
}
