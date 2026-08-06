import React from "react";
import { LucideIcon, Construction } from "lucide-react";

interface ModulePlaceholderProps {
  moduleName: string;
  description?: string;
  icon?: LucideIcon;
}

export function ModulePlaceholder({
  moduleName,
  description,
  icon: Icon = Construction,
}: ModulePlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-8">
      <div className="w-16 h-16 rounded-sm bg-amber-500/10 flex items-center justify-center mb-6">
        <Icon size={28} className="text-amber-500" />
      </div>
      <h2 className="text-lg font-semibold font-sans tracking-tight mb-2">{moduleName}</h2>
      <p className="text-sm font-sans text-zinc-500 max-w-sm leading-relaxed">
        {description ?? `The ${moduleName} module is ready for business logic implementation. Scaffold is in place.`}
      </p>
      <div className="mt-8 flex items-center gap-2 px-4 py-2 rounded-sm border border-amber-500/20 bg-amber-500/5 text-amber-600 text-xs font-sans font-medium">
        <Construction size={12} />
        Implementation pending
      </div>
    </div>
  );
}
