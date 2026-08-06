import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { getRooms, getAllFacilities } from "@/features/admin/actions/rooms";
import { RoomsShell } from "./rooms-shell";

export const metadata: Metadata = {
  title: "Room Inventory — AURELIA Admin",
  description: "Room inventory, pricing tiers, amenities, availability grid, and housekeeping management.",
};

export const dynamic = "force-dynamic";

export default async function RoomsPage() {
  const [rooms, facilities] = await Promise.all([getRooms(), getAllFacilities()]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Room & Suite Inventory"
        description="Manage accommodation catalog, dynamic pricing tiers, amenities, housekeeping status, and live occupancy."
      />
      <RoomsShell initialRooms={rooms} facilities={facilities} />
    </div>
  );
}
