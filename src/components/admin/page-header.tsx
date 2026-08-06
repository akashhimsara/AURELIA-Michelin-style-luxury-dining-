import React from "react";
import { Breadcrumbs } from "./breadcrumbs";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 space-y-3">
      <Breadcrumbs />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1 min-w-0">
          <h1 className="text-xl font-semibold font-sans tracking-tight truncate">{title}</h1>
          {description && (
            <p className="text-sm font-sans text-zinc-500 leading-relaxed max-w-xl">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
