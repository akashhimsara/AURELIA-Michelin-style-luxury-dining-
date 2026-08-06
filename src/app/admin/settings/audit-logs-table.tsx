"use client";

import React, { useState } from "react";
import { Search, ShieldAlert, CheckCircle2, AlertTriangle, Lock } from "lucide-react";
import type { AuditLogEntry } from "@/features/admin/actions/settings";

interface AuditLogsTableProps {
  logs: AuditLogEntry[];
}

export function AuditLogsTable({ logs }: AuditLogsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredLogs = logs.filter((l) => {
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !l.action.toLowerCase().includes(q) &&
        !l.adminEmail.toLowerCase().includes(q) &&
        !l.moduleName.toLowerCase().includes(q) &&
        !l.ipAddress.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-4 font-sans text-[12px]">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 admin-card rounded-sm border p-4">
        <div>
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Lock size={15} className="text-amber-500" /> Administrative Audit & Activity Trail
          </h2>
          <p className="text-[10px] opacity-50 mt-0.5">
            Cryptographically logged trail of all admin actions, security policy edits, and access attempts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40" />
            <input
              type="text"
              placeholder="Search action, email, IP…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-52 pl-8 pr-3 py-1.5 text-[11px] rounded-sm border border-current/10 bg-transparent outline-none focus:border-amber-500/40 placeholder:opacity-40"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-sm border border-current/10 bg-transparent px-2 py-1.5 text-[11px] outline-none"
          >
            <option value="all">All Audit Statuses</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="denied">Denied</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="admin-card rounded-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] font-sans min-w-[850px]">
            <thead className="border-b border-current/5">
              <tr>
                <th className="px-4 py-3 text-left opacity-50 uppercase tracking-widest text-[10px]">Timestamp</th>
                <th className="px-4 py-3 text-left opacity-50 uppercase tracking-widest text-[10px]">Admin Account</th>
                <th className="px-4 py-3 text-left opacity-50 uppercase tracking-widest text-[10px]">Role</th>
                <th className="px-4 py-3 text-left opacity-50 uppercase tracking-widest text-[10px]">Action Performed</th>
                <th className="px-4 py-3 text-left opacity-50 uppercase tracking-widest text-[10px]">Module</th>
                <th className="px-4 py-3 text-left opacity-50 uppercase tracking-widest text-[10px]">IP Address</th>
                <th className="px-4 py-3 text-right opacity-50 uppercase tracking-widest text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-current/5">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center opacity-40 text-[12px]">
                    No audit log records match the search parameters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-current/3 transition-colors">
                    <td className="px-4 py-3.5 font-mono opacity-60 whitespace-nowrap">
                      {new Date(l.timestamp).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-zinc-900 dark:text-zinc-100">{l.adminEmail}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-sm bg-amber-500/10 border border-amber-500/20 text-amber-500 font-medium text-[10px]">
                        {l.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 opacity-90">{l.action}</td>
                    <td className="px-4 py-3.5 font-mono opacity-60 capitalize">{l.moduleName}</td>
                    <td className="px-4 py-3.5 font-mono text-[10px] opacity-50">{l.ipAddress}</td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <span
                        className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm border ${
                          l.status === "success"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                            : l.status === "denied"
                            ? "bg-red-500/10 border-red-500/20 text-red-400"
                            : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
