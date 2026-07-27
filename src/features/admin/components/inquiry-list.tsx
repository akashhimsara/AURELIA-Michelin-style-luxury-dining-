"use client";

import React, { useState } from "react";
import { MessageRow } from "./message-row";

interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

interface InquiryListProps {
  messages: MessageItem[];
}

export function InquiryList({ messages }: InquiryListProps) {
  const [filter, setFilter] = useState<string>("all");

  const filteredMessages = messages.filter((msg) => {
    if (filter === "all") return true;
    return msg.status === filter;
  });

  const tabs = [
    { label: "All Inquiries", val: "all" },
    { label: "Unread", val: "unread" },
    { label: "Read", val: "read" },
    { label: "Replied", val: "replied" },
    { label: "Archived", val: "archived" },
  ];

  return (
    <div className="space-y-6">
      {/* Category filters */}
      <div className="flex gap-2 border-b border-gold/10 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.val}
            onClick={() => setFilter(tab.val)}
            className={`px-4 py-2 text-[10px] uppercase tracking-wider font-sans font-medium transition-all border-b-2 outline-none cursor-pointer ${
              filter === tab.val
                ? "border-gold text-gold"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="border border-gold/15 bg-charcoal/20 rounded-sm overflow-hidden luxury-glass">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-20 font-sans">
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              No inquiries found
            </p>
            <p className="text-[10px] text-zinc-600 mt-1 font-light">
              Guest messages matching "{filter}" will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gold/15 bg-black/60 text-[9px] uppercase tracking-widest text-gold font-sans font-medium">
                  <th className="p-4 w-4"></th>
                  <th className="p-4">Sender</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((msg) => (
                  <MessageRow key={msg.id} message={msg} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
