"use client";

import React, { useState, useTransition } from "react";
import { Check, X, Trash2, Loader2, ChevronDown, ChevronUp, Mail, MailOpen, Send } from "lucide-react";
import { updateMessageStatus, deleteMessage, sendInquiryReply } from "../actions/messages";
import { Button } from "@/components/ui/button";

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
  const [replyText, setReplyText] = useState("");
  const [replySuccess, setReplySuccess] = useState(false);

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

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    startTransition(async () => {
      const response = await sendInquiryReply(message.id, replyText);
      if (response.success) {
        setReplySuccess(true);
        setReplyText("");
        // Auto-close success indicator after 3 seconds
        setTimeout(() => setReplySuccess(false), 3000);
      }
    });
  };

  const isUnread = message.status === "unread";

  return (
    <>
      <tr 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`border-b border-gold/5 hover:bg-gold/2 text-xs font-sans text-zinc-300 transition-colors cursor-pointer ${
          isUnread ? "bg-gold-[0.01] font-medium" : "font-light"
        }`}
      >
        <td className="p-4 w-4">
          {isUnread ? (
            <Mail size={14} className="text-gold animate-pulse" />
          ) : (
            <MailOpen size={14} className="text-zinc-500" />
          )}
        </td>
        <td className="p-4 font-medium text-zinc-200">{message.name}</td>
        <td className="p-4">{message.email}</td>
        <td className="p-4 max-w-xs truncate">
          <span className={isUnread ? "text-zinc-100 font-normal" : "text-zinc-400 font-light"}>
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
        <td className="p-4 font-sans">
          <span
            className={`inline-block px-2 py-0.5 text-[8px] uppercase tracking-wider font-semibold rounded-none ${
              isUnread
                ? "bg-amber-950/40 text-amber-400 border border-amber-500/20"
                : message.status === "replied"
                ? "bg-sky-950/40 text-sky-400 border border-sky-500/20"
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
      </tr>
      {isExpanded && (
        <tr className="bg-black/40 border-b border-gold/5" onClick={(e) => e.stopPropagation()}>
          <td colSpan={7} className="p-6 text-zinc-300 font-sans leading-relaxed text-xs font-light whitespace-pre-wrap">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Inquiry details */}
              <div className="space-y-3">
                <div>
                  <span className="block text-[8px] uppercase tracking-wider text-gold mb-1.5 font-medium">
                    Inquiry Details & Requirements
                  </span>
                  <p className="text-zinc-200 leading-relaxed max-w-lg">{message.message}</p>
                </div>
              </div>

              {/* Reply box */}
              <div className="border-t lg:border-t-0 lg:border-l border-gold/10 pt-6 lg:pt-0 lg:pl-8 space-y-4">
                <span className="block text-[8px] uppercase tracking-wider text-gold font-medium">
                  Draft Proposal response
                </span>

                {replySuccess ? (
                  <div className="p-3 border border-emerald-500/20 bg-emerald-950/20 text-emerald-400 text-[11px] font-sans text-center rounded-sm">
                    Concierge Proposal Dispatched Successfully.
                  </div>
                ) : (
                  <form onSubmit={handleSendReply} className="space-y-3">
                    <textarea
                      rows={4}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full bg-black/60 border border-gold/15 focus:border-gold focus:ring-1 focus:ring-gold outline-none p-2.5 text-xs text-zinc-200 font-sans font-light rounded-sm resize-none"
                      placeholder="Draft a custom menu pricing proposal or details adjustments..."
                      required
                    />
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        className="flex items-center gap-1.5 text-[10px] py-1.5 px-3 uppercase tracking-wider font-medium"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <>
                            <Loader2 size={12} className="animate-spin" /> Dispatched Proposal...
                          </>
                        ) : (
                          <>
                            <Send size={10} /> Send Proposal Email
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
