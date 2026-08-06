import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { getFinanceData } from "@/features/admin/actions/finance";
import { FinanceShell } from "./finance-shell";

export const metadata: Metadata = {
  title: "Finance & Accounting — AURELIA Admin",
  description: "Revenue ledger, Stripe transactions, official UK VAT invoices, expense tracking, and monthly/yearly reports.",
};

export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const data = await getFinanceData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance & Accounting Controls"
        description="Monitor real-time gross/net revenue, official 20% UK VAT invoices, operating expenses, refunds, and annual profit margins."
      />
      <FinanceShell data={data} />
    </div>
  );
}
