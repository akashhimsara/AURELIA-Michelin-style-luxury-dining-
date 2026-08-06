"use client";

import React, { useState, useTransition } from "react";
import { Mail, MessageSquare, Save, Loader2, Sparkles, Eye } from "lucide-react";
import {
  updateEmailTemplate,
  updateSmsTemplate,
  type EmailTemplateConfig,
  type SmsTemplateConfig,
} from "@/features/admin/actions/settings";
import { useRouter } from "next/navigation";

interface TemplateEditorTabProps {
  emailTemplates: EmailTemplateConfig[];
  smsTemplates: SmsTemplateConfig[];
}

const VARIABLES = [
  "{{guest_name}}",
  "{{check_in_date}}",
  "{{check_out_date}}",
  "{{suite_name}}",
  "{{total_amount}}",
  "{{invoice_ref}}",
  "{{table_num}}",
  "{{time}}",
];

export function TemplateEditorTab({ emailTemplates, smsTemplates }: TemplateEditorTabProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [type, setType] = useState<"email" | "sms">("email");
  const [selectedId, setSelectedId] = useState(emailTemplates[0]?.id || "tpl-1");

  const selectedEmail = emailTemplates.find((t) => t.id === selectedId);
  const selectedSms = smsTemplates.find((t) => t.id === selectedId);

  const [subject, setSubject] = useState(selectedEmail?.subject || "");
  const [body, setBody] = useState(selectedEmail?.body || "");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSelectTemplate = (id: string, isSms: boolean) => {
    setSelectedId(id);
    setFeedback(null);
    if (isSms) {
      const tpl = smsTemplates.find((t) => t.id === id);
      if (tpl) {
        setBody(tpl.body);
        setSubject("");
      }
    } else {
      const tpl = emailTemplates.find((t) => t.id === id);
      if (tpl) {
        setSubject(tpl.subject);
        setBody(tpl.body);
      }
    }
  };

  const insertVariable = (varTag: string) => {
    setBody((prev) => prev + " " + varTag);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      let res;
      if (type === "email") {
        res = await updateEmailTemplate(selectedId, subject, body);
      } else {
        res = await updateSmsTemplate(selectedId, body);
      }

      if (res.success) {
        setFeedback("Template saved successfully!");
        router.refresh();
      } else {
        setFeedback(res.message || "Failed to save template.");
      }
    });
  };

  // Preview renderer replacing tags with sample values
  const renderPreview = () => {
    let str = body;
    str = str.replace(/\{\{guest_name\}\}/g, "Lord Sterling");
    str = str.replace(/\{\{check_in_date\}\}/g, "12 Aug 2026");
    str = str.replace(/\{\{check_out_date\}\}/g, "15 Aug 2026");
    str = str.replace(/\{\{suite_name\}\}/g, "Mayfair Penthouse Suite");
    str = str.replace(/\{\{total_amount\}\}/g, "3,600.00");
    str = str.replace(/\{\{invoice_ref\}\}/g, "INV-2026-1082");
    str = str.replace(/\{\{table_num\}\}/g, "4");
    str = str.replace(/\{\{time\}\}/g, "19:30");
    return str;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-[12px] font-sans">
      {/* Editor Column */}
      <form onSubmit={handleSubmit} className="admin-card rounded-sm border p-6 space-y-5">
        <div className="border-b border-current/5 pb-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Mail size={16} className="text-amber-500" /> Automated Communications Editor
          </h2>
          <p className="text-[10px] opacity-50 mt-0.5">
            Configure system transactional email subjects and SMS notification templates.
          </p>
        </div>

        {feedback && (
          <div
            className={`p-2.5 rounded-sm text-[11px] ${
              feedback.startsWith("Error") ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-500"
            }`}
          >
            {feedback}
          </div>
        )}

        {/* Channel Selector */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setType("email");
              handleSelectTemplate(emailTemplates[0]?.id || "tpl-1", false);
            }}
            className={`flex-1 py-2 rounded-sm border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              type === "email"
                ? "bg-amber-500 text-zinc-950 border-amber-500"
                : "border-current/10 opacity-60 hover:opacity-100"
            }`}
          >
            <Mail size={13} /> Email Templates
          </button>
          <button
            type="button"
            onClick={() => {
              setType("sms");
              handleSelectTemplate(smsTemplates[0]?.id || "sms-1", true);
            }}
            className={`flex-1 py-2 rounded-sm border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              type === "sms"
                ? "bg-amber-500 text-zinc-950 border-amber-500"
                : "border-current/10 opacity-60 hover:opacity-100"
            }`}
          >
            <MessageSquare size={13} /> SMS Templates
          </button>
        </div>

        {/* Template Dropdown */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Select Template</label>
          <select
            value={selectedId}
            onChange={(e) => handleSelectTemplate(e.target.value, type === "sms")}
            className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none"
          >
            {type === "email"
              ? emailTemplates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))
              : smsTemplates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
          </select>
        </div>

        {/* Email Subject Line (if email) */}
        {type === "email" && (
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Email Subject Line</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2 outline-none focus:border-amber-500/40"
            />
          </div>
        )}

        {/* Dynamic Variable Tags */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Insert Dynamic Variables</label>
          <div className="flex flex-wrap gap-1.5">
            {VARIABLES.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => insertVariable(tag)}
                className="px-2 py-0.5 rounded-xs bg-amber-500/10 border border-amber-500/20 text-amber-500 font-mono text-[10px] hover:bg-amber-500/20"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Template Body Editor */}
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest opacity-50 font-medium">Template Body Content</label>
          <textarea
            rows={7}
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded-sm border border-current/10 bg-transparent px-3 py-2.5 outline-none focus:border-amber-500/40 font-mono text-[11px] resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 bg-amber-500 text-zinc-950 font-semibold rounded-sm text-xs hover:bg-amber-400 disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Template Configuration
        </button>
      </form>

      {/* Live Preview Column */}
      <div className="admin-card rounded-sm border p-6 space-y-4 flex flex-col justify-between">
        <div>
          <div className="border-b border-current/5 pb-3">
            <p className="text-[10px] uppercase tracking-widest opacity-50 font-semibold flex items-center gap-1">
              <Eye size={13} className="text-amber-500" /> Live Rendered Preview
            </p>
            <h3 className="text-sm font-semibold">Guest View Preview</h3>
          </div>

          <div className="mt-4 p-5 rounded-sm border border-current/10 bg-zinc-950 text-zinc-100 space-y-3">
            {type === "email" && subject && (
              <div className="border-b border-zinc-800 pb-2">
                <span className="text-[9px] uppercase tracking-widest opacity-40 block">Subject</span>
                <p className="font-semibold text-amber-500 text-xs">{subject}</p>
              </div>
            )}
            <div>
              <span className="text-[9px] uppercase tracking-widest opacity-40 block">Message Body</span>
              <p className="whitespace-pre-wrap font-sans opacity-90 leading-relaxed text-[11px] pt-1">
                {renderPreview()}
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-sm bg-current/2 border border-current/5 text-[10px] opacity-60">
          Variables enclosed in <code>&#123;&#123;tags&#125;&#125;</code> will be automatically replaced with guest reservation data during automated email/SMS dispatches.
        </div>
      </div>
    </div>
  );
}
