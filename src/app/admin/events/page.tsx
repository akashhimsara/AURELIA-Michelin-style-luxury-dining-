import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { ModulePlaceholder } from "@/components/admin/module-placeholder";
import { Trophy } from "lucide-react";

export const metadata: Metadata = { title: "Events — AURELIA Admin" };

export default function EventsPage() {
  return (
    <>
      <PageHeader title="Events" description="Special events calendar, private hire, and corporate bookings." />
      <ModulePlaceholder moduleName="Events" icon={Trophy} description="Event scheduling, venue configuration, catering requests, and guest list management will be administered here." />
    </>
  );
}
