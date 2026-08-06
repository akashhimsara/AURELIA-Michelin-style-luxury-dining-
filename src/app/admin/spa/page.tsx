import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { ModulePlaceholder } from "@/components/admin/module-placeholder";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = { title: "Spa — AURELIA Admin" };

export default function SpaPage() {
  return (
    <>
      <PageHeader title="Spa & Wellness" description="Treatment bookings, therapist schedules, and product inventory." />
      <ModulePlaceholder moduleName="Spa & Wellness" icon={Sparkles} description="Spa treatment bookings, therapist availability, package configuration, and guest preferences will be managed here." />
    </>
  );
}
