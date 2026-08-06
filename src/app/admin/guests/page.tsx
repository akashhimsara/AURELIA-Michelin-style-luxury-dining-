import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { getGuests } from "@/features/admin/actions/guests";
import { GuestsShell } from "./guests-shell";

export const metadata: Metadata = {
  title: "Guest Management — AURELIA Admin",
  description: "Guest CRM registry, profiles, VIP tiering, preferences, and stay analytics.",
};

export const dynamic = "force-dynamic";

export default async function GuestsPage() {
  const guests = await getGuests();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Guest CRM Registry"
        description="Comprehensive guest profiles, VIP tiers, preferences, reservation history, and lifetime analytics."
      />
      <GuestsShell initialGuests={guests} />
    </div>
  );
}
