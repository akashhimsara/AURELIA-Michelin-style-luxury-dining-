import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { getRestaurantData } from "@/features/admin/actions/restaurant";
import { RestaurantShell } from "./restaurant-shell";

export const metadata: Metadata = {
  title: "Restaurant — AURELIA Admin",
  description: "Culinary menu catalog, wine list, floor seating maps, and dining reservations.",
};

export const dynamic = "force-dynamic";

export default async function RestaurantPage() {
  const data = await getRestaurantData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Michelin Fine Dining & Sommelier"
        description="Manage Mayfair culinary menus, Grand Cru wine lists, floor seating maps, and table reservations."
      />
      <RestaurantShell data={data} />
    </div>
  );
}
