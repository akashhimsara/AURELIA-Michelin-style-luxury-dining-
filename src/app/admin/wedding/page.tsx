import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { ModulePlaceholder } from "@/components/admin/module-placeholder";
import { Heart } from "lucide-react";

export const metadata: Metadata = { title: "Wedding — AURELIA Admin" };

export default function WeddingPage() {
  return (
    <>
      <PageHeader title="Weddings" description="Wedding package enquiries, event logistics, and vendor coordination." />
      <ModulePlaceholder moduleName="Weddings" icon={Heart} description="Wedding enquiries, package configuration, floral and catering coordination, and timeline management will be handled here." />
    </>
  );
}
