import React from "react";
import { cookies } from "next/headers";
import { Sidebar } from "@/features/admin/components/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.has("session");

  // If visiting the login page (unauthenticated), bypass the dashboard layout wrapper
  if (!hasSession) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex font-sans">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.015)_0%,_black_100%)]">
        {children}
      </main>
    </div>
  );
}
