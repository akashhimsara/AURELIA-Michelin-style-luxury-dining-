import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { ModulePlaceholder } from "@/components/admin/module-placeholder";
import { BedDouble } from "lucide-react";

export const metadata: Metadata = { title: "Rooms — AURELIA Admin" };

export default function RoomsPage() {
  return (
    <>
      <PageHeader title="Rooms" description="Room inventory, availability grid, and housekeeping status." />
      <ModulePlaceholder moduleName="Rooms" icon={BedDouble} description="Room categories, pricing tiers, availability calendar, and maintenance status will be managed here." />
    </>
  );
}
