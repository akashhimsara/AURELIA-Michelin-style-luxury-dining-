import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { ModulePlaceholder } from "@/components/admin/module-placeholder";
import { Mail } from "lucide-react";

export const metadata: Metadata = { title: "Marketing — AURELIA Admin" };

export default function MarketingPage() {
  return (
    <>
      <PageHeader title="Marketing" description="Campaign management, email broadcasts, and promotional offers." />
      <ModulePlaceholder moduleName="Marketing" icon={Mail} description="Email campaigns via Resend, seasonal promotions, membership offer configuration, and guest segmentation will be managed here." />
    </>
  );
}
