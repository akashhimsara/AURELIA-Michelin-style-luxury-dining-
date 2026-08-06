"use client";

import React, { useState, useTransition } from "react";
import { ShieldCheck, Lock, Check, Loader2, Save } from "lucide-react";
import { updateRolePermissions } from "@/features/admin/actions/settings";
import { useRouter } from "next/navigation";

interface RolesPermissionMatrixProps {
  permissionMatrix: Record<string, string[]>;
}

const ALL_ROLES = [
  { key: "super_admin", label: "Super Admin" },
  { key: "hotel_manager", label: "Hotel Manager" },
  { key: "reception", label: "Reception" },
  { key: "restaurant_manager", label: "Restaurant Mgr" },
  { key: "spa_manager", label: "Spa Mgr" },
  { key: "wedding_manager", label: "Wedding Mgr" },
  { key: "finance", label: "Finance" },
  { key: "housekeeping", label: "Housekeeping" },
  { key: "marketing", label: "Marketing" },
];

const MODULES = [
  "dashboard",
  "reservations",
  "guests",
  "rooms",
  "restaurant",
  "spa",
  "wedding",
  "events",
  "staff",
  "housekeeping",
  "finance",
  "marketing",
  "reports",
  "settings",
  "system-logs",
];

export function RolesPermissionMatrix({ permissionMatrix }: RolesPermissionMatrixProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [matrix, setMatrix] = useState<Record<string, string[]>>(permissionMatrix);
  const [feedback, setFeedback] = useState<string | null>(null);

  const togglePermission = (moduleName: string, roleKey: string) => {
    // Super admin permissions are locked
    if (roleKey === "super_admin") return;

    setMatrix((prev) => {
      const currentRoles = prev[moduleName] || [];
      const updated = currentRoles.includes(roleKey)
        ? currentRoles.filter((r) => r !== roleKey)
        : [...currentRoles, roleKey];

      return { ...prev, [moduleName]: updated };
    });
  };

  const handleSaveModule = (moduleName: string) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await updateRolePermissions(moduleName, matrix[moduleName] || []);
      if (res.success) {
        setFeedback(`Permissions saved for module '${moduleName}'!`);
        router.refresh();
      } else {
        setFeedback(res.message || "Failed to update permissions.");
      }
    });
  };

  return (
    <div className="space-y-6 text-[12px] font-sans">
      <div className="admin-card rounded-sm border p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <ShieldCheck size={16} className="text-amber-500" /> RBAC 9-Role Permission Matrix
          </h2>
          <p className="text-[10px] opacity-50 mt-0.5">
            Configure access authorization rules across all 14 portal modules for each enterprise role.
          </p>
        </div>
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

      {/* Permission Matrix Grid */}
      <div className="admin-card rounded-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] font-sans min-w-[950px]">
            <thead className="border-b border-current/5">
              <tr>
                <th className="px-4 py-3 text-left opacity-50 uppercase tracking-widest text-[10px] min-w-[140px]">
                  System Module
                </th>
                {ALL_ROLES.map((r) => (
                  <th key={r.key} className="px-2 py-3 text-center opacity-70 uppercase tracking-wider text-[9px]">
                    {r.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right opacity-50 uppercase tracking-widest text-[10px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-current/5">
              {MODULES.map((mod) => {
                const permittedRoles = matrix[mod] || [];

                return (
                  <tr key={mod} className="hover:bg-current/3 transition-colors">
                    <td className="px-4 py-3 font-semibold capitalize font-mono text-amber-500">
                      {mod}
                    </td>

                    {ALL_ROLES.map((r) => {
                      const isChecked = permittedRoles.includes(r.key);
                      const isSuperAdmin = r.key === "super_admin";

                      return (
                        <td key={r.key} className="px-2 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => togglePermission(mod, r.key)}
                            disabled={isSuperAdmin}
                            className={`w-6 h-6 rounded-xs border inline-flex items-center justify-center transition-all ${
                              isChecked
                                ? "bg-amber-500 text-zinc-950 border-amber-500 font-bold"
                                : "border-current/15 opacity-40 hover:opacity-100"
                            } ${isSuperAdmin ? "cursor-not-allowed opacity-90 bg-amber-500/80" : "cursor-pointer"}`}
                            title={`${r.label} access to ${mod}`}
                          >
                            {isChecked ? <Check size={12} /> : null}
                          </button>
                        </td>
                      );
                    })}

                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleSaveModule(mod)}
                        disabled={isPending}
                        className="px-2 py-1 text-[10px] rounded-sm bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500 hover:text-zinc-950 transition-colors"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
