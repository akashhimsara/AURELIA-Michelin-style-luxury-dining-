import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { ModulePlaceholder } from "@/components/admin/module-placeholder";
import { CalendarDays } from "lucide-react";

export const metadata: Metadata = { title: "Reservations — AURELIA Admin" };

export default function ReservationsPage() {
  return (
    <>
      <PageHeader title="Reservations" description="View and manage all hotel reservations." />
      <ModulePlaceholder moduleName="Reservations" icon={CalendarDays} description="Full reservations table with filtering, sorting, and CRUD operations will be implemented here." />
    </>
  );
}
