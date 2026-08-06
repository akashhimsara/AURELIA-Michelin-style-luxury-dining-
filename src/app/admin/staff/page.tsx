import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { ModulePlaceholder } from "@/components/admin/module-placeholder";
import { UserCheck } from "lucide-react";

export const metadata: Metadata = { title: "Staff — AURELIA Admin" };

export default function StaffPage() {
  return (
    <>
      <PageHeader title="Staff" description="Employee directory, role assignments, and scheduling." />
      <ModulePlaceholder moduleName="Staff" icon={UserCheck} description="Staff profiles, department assignments, shift scheduling, performance records, and access control will be managed here." />
    </>
  );
}
