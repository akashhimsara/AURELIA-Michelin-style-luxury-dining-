import React from "react";
import type { Metadata } from "next";
import { Heading } from "@/components/ui/heading";
import { db } from "@/lib/db";
import { InquiryList } from "@/features/admin/components/inquiry-list";

export const metadata: Metadata = {
  title: "Inquiries Console | AURELIA Console",
  description: "Inspect guest contact coordinates and custom event inquiries.",
};

export default async function AdminMessagesPage() {
  const messages = await db.message.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const mappedMessages = messages.map((msg) => ({
    id: msg.id,
    name: msg.name,
    email: msg.email,
    subject: msg.subject,
    message: msg.message,
    status: msg.status,
    createdAt: msg.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-8">
      {/* Header titles */}
      <div>
        <Heading subtitle>Concierge Operations</Heading>
        <Heading as="h1" accent className="tracking-wide">
          Guest Inquiries
        </Heading>
        <p className="text-xs text-zinc-500 font-sans mt-1">
          Review general contact submissions and custom event planning coordinates.
        </p>
      </div>

      {/* Dynamic filterable messages list */}
      <InquiryList messages={mappedMessages} />
    </div>
  );
}
