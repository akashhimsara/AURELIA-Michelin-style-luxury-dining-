import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { ModulePlaceholder } from "@/components/admin/module-placeholder";
import { Utensils } from "lucide-react";

export const metadata: Metadata = { title: "Restaurant — AURELIA Admin" };

export default function RestaurantPage() {
  return (
    <>
      <PageHeader title="Restaurant" description="Dining reservations, menu management, and private dining." />
      <ModulePlaceholder moduleName="Restaurant" icon={Utensils} description="Table reservations, menu catalogue, private dining enquiries, and tasting menus will be managed here." />
    </>
  );
}
