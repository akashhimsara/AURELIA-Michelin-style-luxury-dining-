"use client";

import React, { useState, useTransition } from "react";
import { Check, X, Trash2, Loader2, ChevronDown, ChevronUp, Mail, MailOpen } from "lucide-react";
import { updateMessageStatus, deleteMessage } from "../actions/messages";

interface MessageRowProps {
  message: {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
  };
}

export function MessageRow({ message }: MessageRowProps) {
  const [isPending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusChange = (status: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid expanding the card when clicking control triggers
    startTransition(async () => {
      await updateMessageStatus(message.id, status);
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this inquiry?")) {
      return;
    }
    startTransition(async () => {
      await deleteMessage(message.id);
    });
  };

  const isUnread = message.status === "unread";

  return (
    <tr 
      onClick={() => setIsExpanded(!isExpanded)}
      className={`border-b border-gold/5 hover:bg-gold/2 text-xs font-sans text-zinc-300 transition-colors cursor-pointer ${
        isUnread ? "bg-gold-[0.01] font-medium" : "font-light"
      }`}
    >
      <td className="p-4 w-4">
        {isUnread ? (
          <Mail size={14} className="text-gold" />
        ) : (
          <MailOpen size={14} className="text-zinc-500" />
        )}
      </td>
      <td className="p-4 font-medium text-zinc-200">{message.name}</td>
      <td className="p-4">{message.email}</td>
      <td className="p-4 max-w-xs truncate">
        <span className={isUnread ? "text-zinc-100" : "text-zinc-400"}>
          {message.subject}
        </span>
      </td>
      <td className="p-4">
        {new Date(message.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td className="p-4">
        <span
          className={`inline-block px-2 py-0.5 text-[8px] uppercase tracking-wider font-semibold rounded-none ${
            isUnread
              ? "bg-amber-950/40 text-amber-400 border border-amber-500/20"
              : message.status === "archived"
              ? "bg-zinc-800/40 text-zinc-400 border border-zinc-500/20"
              : "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20"
          }`}
        >
          {message.status}
        </span>
      </td>
      <td className="p-4 text-right">
        <div className="flex justify-end items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {isPending ? (
            <Loader2 size={12} className="animate-spin text-gold" />
          ) : (
            <>
              {isUnread && (
                <button
                  onClick={(e) => handleStatusChange("read", e)}
                  className="p-1 border border-emerald-500/20 bg-emerald-950/10 text-emerald-400 hover:bg-emerald-950/30 transition-colors outline-none cursor-pointer"
                  title="Mark as Read"
                >
                  <Check size={12} />
                </button>
              )}
              {message.status !== "archived" && (
                <button
                  onClick={(e) => handleStatusChange("archived", e)}
                  className="p-1 border border-zinc-500/20 bg-zinc-800/10 text-zinc-400 hover:bg-zinc-800/30 transition-colors outline-none cursor-pointer"
                  title="Archive"
                >
                  <X size={12} />
                </button>
              )}
              <button
                onClick={handleDelete}
                className="p-1 border border-red-500/20 bg-red-950/10 text-red-400 hover:bg-red-950/30 transition-colors outline-none cursor-pointer"
                title="Delete"
              >
                <Trash2 size={12} />
              </button>
            </>
          )}
          <span className="text-zinc-500 ml-2">
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </div>
      </td>
      {isExpanded && (
        <tr className="bg-black/40 border-b border-gold/5" onClick={(e) => e.stopPropagation()}>
          <td colSpan={7} className="p-6 text-zinc-300 font-sans leading-relaxed text-xs font-light whitespace-pre-wrap">
            <span className="block text-[8px] uppercase tracking-wider text-gold mb-2 font-medium">
              Inquiry Details & Requirements
            </span>
            {message.message}
          </td>
        </tr>
      )}
    </tr>
  );
}
