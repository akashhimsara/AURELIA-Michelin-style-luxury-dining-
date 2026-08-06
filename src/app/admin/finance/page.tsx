import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { ModulePlaceholder } from "@/components/admin/module-placeholder";
import { Receipt } from "lucide-react";

export const metadata: Metadata = { title: "Finance — AURELIA Admin" };

export default function FinancePage() {
  return (
    <>
      <PageHeader title="Finance" description="Revenue ledger, Stripe transactions, invoices, and financial reports." />
      <ModulePlaceholder moduleName="Finance" icon={Receipt} description="Transaction history, Stripe payment records, invoice generation, refund management, and revenue analytics will be displayed here." />
    </>
  );
}
