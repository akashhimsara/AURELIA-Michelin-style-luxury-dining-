import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, ShieldCheck, CheckSquare } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";

export interface RoomItem {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  imageUrl: string;
  facilities: string[];
}

interface RoomCardProps {
  room: RoomItem;
  checkin?: string;
  checkout?: string;
  priority?: boolean;
}

export function RoomCard({ room, checkin, checkout, priority }: RoomCardProps) {
  const bookingUrl = `/reserve?roomId=${room.id}${checkin ? `&date=${checkin}` : ""}`;

  return (
    <article className="group relative border border-gold/10 bg-charcoal/40 rounded-sm overflow-hidden gold-border-glow shadow-elevation flex flex-col md:flex-row h-full">
      {/* Decorative hairline border */}
      <div className="absolute inset-1.5 border border-gold/5 pointer-events-none z-10" />

      {/* Room Photo container */}
      <div className="relative w-full md:w-[40%] aspect-[4/3] md:aspect-auto min-h-[250px] overflow-hidden bg-zinc-950">
        <Image
          src={room.imageUrl}
          alt={room.name}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          priority={priority}
          loading={priority ? undefined : "lazy"}
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Details pane */}
      <div className="w-full md:w-[60%] p-6 sm:p-8 flex flex-col justify-between space-y-6 relative z-20">
        <div className="space-y-4">
          {/* Header titles */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-[8px] uppercase tracking-[0.25em] text-gold font-sans font-medium">
                Luxury Suite
              </span>
              <Heading as="h3" className="text-xl sm:text-2xl font-light tracking-wide mt-1">
                {room.name}
              </Heading>
            </div>
            <div className="text-right">
              <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-sans block">
                Rate Per Night
              </span>
              <span className="text-xl font-serif text-gold block">
                &pound;{room.pricePerNight}
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 font-sans leading-relaxed font-light">
            {room.description}
          </p>

          {/* Core Specs */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-zinc-300 font-sans font-light pt-2 border-t border-gold/5">
            <span className="flex items-center gap-1.5">
              <Users size={12} className="text-gold" /> Up to {room.capacity} Guests
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-gold" /> Exclusive Concierge
            </span>
          </div>

          {/* Facilities list */}
          {room.facilities.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <span className="block text-[8px] uppercase tracking-widest text-zinc-500 font-sans font-medium">
                Included Amenities
              </span>
              <div className="grid grid-cols-2 gap-2">
                {room.facilities.map((fac) => (
                  <span key={fac} className="flex items-center gap-1.5 text-[9px] text-zinc-400 font-sans font-light">
                    <CheckSquare size={10} className="text-gold/60" /> {fac}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action button CTA */}
        <div className="pt-4 flex justify-end">
          <Link href={bookingUrl}>
            <Button variant="primary" size="sm">
              Confirm Arrangement
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
