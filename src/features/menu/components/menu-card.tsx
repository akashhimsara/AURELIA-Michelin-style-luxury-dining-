import React from "react";
import Image from "next/image";
import { Heading } from "@/components/ui/heading";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  tags?: string[];
  image: string;
}

interface MenuCardProps {
  item: MenuItem;
  priority?: boolean;
}

export function MenuCard({ item, priority }: MenuCardProps) {
  return (
    <article className="group relative flex flex-col justify-between p-3 border border-gold/10 bg-charcoal/40 rounded-sm overflow-hidden gold-border-glow shadow-elevation h-full">
      {/* Decorative inner hairline border */}
      <div className="absolute inset-1.5 border border-gold/5 pointer-events-none z-10" />

      <div className="space-y-4">
        {/* Aspect Ratio Container for responsive images */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-zinc-950">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 350px"
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            loading={priority ? undefined : "lazy"}
            priority={priority}
          />
        </div>

        {/* Content details block */}
        <div className="px-2 space-y-2">
          {/* Dynamic Tags mapping */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[8px] uppercase tracking-widest font-sans font-medium bg-gold/10 text-gold px-2 py-0.5 rounded-none"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Item name and gold price label */}
          <div className="flex justify-between items-baseline gap-4 pt-1">
            <Heading as="h3" className="text-base sm:text-lg font-light leading-snug">
              {item.name}
            </Heading>
            <span className="text-sm font-sans font-medium text-gold tracking-wide">
              &pound;{item.price.toFixed(0)}
            </span>
          </div>

          {/* Description copy */}
          <p className="text-xs text-zinc-400 font-sans leading-relaxed font-light line-clamp-3">
            {item.description}
          </p>
        </div>
      </div>
    </article>
  );
}
