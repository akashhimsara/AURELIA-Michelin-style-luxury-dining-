"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { Check, ShieldCheck, RefreshCw, Compass, Users, Calendar, Clock, DollarSign } from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { experienceBookingSchema, ExperienceBookingInput, experiencesCatalog } from "@/features/experiences/schema";
import { createExperienceBooking } from "@/features/experiences/actions/booking";

const experiences = [
  {
    id: "art-tour",
    title: "Royal Mayfair Art Tour",
    subtitle: "Curated Tours",
    description: "An exclusive walking tour of Mayfair's historic art auction houses and private galleries, followed by a champagne tasting lunch at Aurelia.",
    rate: "£250 per guest",
    image: "/private-oak.png",
  },
  {
    id: "helicopter",
    title: "Helicopter Cotswolds Flight",
    subtitle: "Bespoke Aviation",
    description: "Private helicopter flight departing from London Heliport straight to a secluded Cotswolds estate for a curated luxury lunch, returning by sunset.",
    rate: "£1,200 per flight",
    image: "/event-wedding.png",
  },
  {
    id: "cigar-masterclass",
    title: "Vintage Cognac & Cigar Masterclass",
    subtitle: "Heritage Tastings",
    description: "An intimate evening seminar hosted in our stone vaults, pairing pre-embargo cigars with rare, century-old cognac reserves.",
    rate: "£180 per guest",
    image: "/private-crypt.png",
  },
];

export default function ExperiencesPage() {
  const [isPending, startTransition] = useTransition();
  const [successData, setSuccessData] = useState<any>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<any>({
    resolver: zodResolver(experienceBookingSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      experience: "art-tour",
      date: new Date().toISOString().split("T")[0],
      time: "14:00",
      guests: 2,
      notes: "",
    },
  });

  const selectedExpId = watch("experience");
  const selectedExp = experiences.find((e) => e.id === selectedExpId) || experiences[0];

  const onSubmit = (data: any) => {
    setServerError(null);
    startTransition(async () => {
      try {
        const response = await createExperienceBooking(data);
        if (response.success) {
          setSuccessData(response.reservation);
          reset();
        } else {
          setServerError(response.message || "Invalid input details. Please verify your fields.");
        }
      } catch (err) {
        setServerError("Could not establish connection to the reservation server.");
      }
    });
  };

  const handleReset = () => {
    setSuccessData(null);
    setServerError(null);
  };

  if (successData) {
    return (
      <PageWrapper>
        <Section className="relative pt-32 pb-24 min-h-[80vh] flex items-center bg-black">
          <div className="w-full max-w-xl mx-auto p-8 border border-gold/20 bg-charcoal/80 rounded-sm text-center space-y-8 shadow-elevation relative overflow-hidden luxury-glass">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full border border-gold/30 bg-gold/10 flex items-center justify-center text-gold animate-pulse">
                <Check size={28} />
              </div>
            </div>

            <div className="space-y-3">
              <Heading subtitle>Experience Reserved</Heading>
              <Heading as="h2" accent className="tracking-wide">
                Your Adventure is Arranged
              </Heading>
            </div>

            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-gold/30 to-transparent mx-auto" />

            <div className="grid grid-cols-2 gap-4 text-left border border-gold/10 bg-black/40 p-5 rounded-sm max-w-md mx-auto text-xs font-sans font-light text-zinc-300">
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">Guest</span>
                <span className="font-medium text-zinc-200">{successData.name}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">Guests Size</span>
                <span className="font-medium text-zinc-200">{successData.guests} Guests</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">Arrangement</span>
                <span className="font-medium text-zinc-200">{successData.bookedRoomName.replace("Experience: ", "")}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-zinc-500 mb-1">Date & Time</span>
                <span className="font-medium text-zinc-200">
                  {new Date(successData.date).toLocaleDateString("en-GB")} at {successData.time}
                </span>
              </div>
              <div className="col-span-2 pt-2 border-t border-gold/5 flex justify-between items-center">
                <span className="text-[9px] uppercase tracking-wider text-zinc-500">Estimated Total Cost</span>
                <span className="font-mono text-gold font-medium">&pound;{successData.finalAmount.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 font-sans font-light max-w-sm mx-auto leading-relaxed">
              A bespoke concierge coordinator will contact you shortly with the final timing itinerary.
            </p>

            <div className="pt-4">
              <Button variant="outline" size="sm" onClick={handleReset}>
                Explore Other Tours
              </Button>
            </div>
          </div>
        </Section>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Header section */}
      <Section className="relative pt-32 pb-16 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.015)_0%,_black_100%)] border-b border-gold/5">
        <Container className="max-w-2xl mx-auto space-y-4 text-center">
          <Heading subtitle>Curated Local Tours</Heading>
          <Heading as="h1" accent className="tracking-wide">
            Luxury Experiences
          </Heading>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed font-light">
            Go beyond standard stays. Aurelia compiles private coordinates, gallery lockouts, and helicopter transfers to make your visit unforgettable.
          </p>
        </Container>
      </Section>

      {/* Experience cards list */}
      <Section className="py-20 bg-black">
        <Container className="space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {experiences.map((exp) => (
              <article key={exp.id} className="group relative border border-gold/10 bg-charcoal/40 rounded-sm overflow-hidden gold-border-glow shadow-elevation flex flex-col justify-between">
                <div className="absolute inset-1.5 border border-gold/5 pointer-events-none z-10" />

                <div className="space-y-4">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
                    <Image
                      src={exp.image}
                      alt={exp.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 350px"
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[8px] uppercase tracking-widest text-gold font-sans font-medium block">
                        {exp.subtitle}
                      </span>
                      <Heading as="h3" className="text-base sm:text-lg font-light mt-0.5 tracking-wide">
                        {exp.title}
                      </Heading>
                    </div>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed font-light">
                      {exp.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-gold/5 mt-4 space-y-3">
                  <div className="flex justify-between items-center text-[10px] text-zinc-300 font-sans font-light">
                    <span>Exclusive Package</span>
                    <span className="text-gold font-medium">{exp.rate}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* Booking Form Section */}
      <Section className="pb-24 pt-10 border-t border-gold/5 bg-[radial-gradient(circle_at_bottom,_rgba(212,175,55,0.015)_0%,_black_100%)]">
        <Container className="text-center space-y-12">
          <div className="max-w-xl mx-auto space-y-2">
            <Heading subtitle>Reserve Tour Guide</Heading>
            <h2 className="text-xl sm:text-2xl font-serif text-zinc-100 font-light tracking-wide">
              Request Experience Booking
            </h2>
            <p className="text-xs text-zinc-400 font-sans font-light leading-relaxed">
              Verify credentials below to queue dates in the concierge scheduler calendars.
            </p>
          </div>

          <div className="w-full max-w-xl mx-auto p-6 sm:p-8 border border-gold/10 bg-charcoal/40 rounded-sm shadow-elevation relative luxury-glass">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left relative z-20">
              {serverError && (
                <div className="p-3 border border-red-500/20 bg-red-950/20 text-red-400 text-xs font-sans text-center rounded-sm">
                  {serverError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5 col-span-1 sm:col-span-2">
                  <label htmlFor="name" className="block text-[10px] uppercase tracking-widest text-gold font-sans font-medium">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full bg-black/60 border border-gold/15 focus:border-gold outline-none p-3 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
                    placeholder="E.g., Lord Sterling"
                    {...register("name")}
                  />
                  {errors.name && (
                    <span className="text-[10px] text-red-400 font-sans block">{errors.name?.message as string}</span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-[10px] uppercase tracking-widest text-gold font-sans font-medium">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full bg-black/60 border border-gold/15 focus:border-gold outline-none p-3 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
                    placeholder="sterling@belgravia.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <span className="text-[10px] text-red-400 font-sans block">{errors.email?.message as string}</span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phone" className="block text-[10px] uppercase tracking-widest text-gold font-sans font-medium">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="w-full bg-black/60 border border-gold/15 focus:border-gold outline-none p-3 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300"
                    placeholder="+44 7123 456789"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <span className="text-[10px] text-red-400 font-sans block">{errors.phone?.message as string}</span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="experience" className="block text-[10px] uppercase tracking-widest text-gold font-sans font-medium">
                    Select Experience
                  </label>
                  <select
                    id="experience"
                    className="w-full bg-black/60 border border-gold/15 focus:border-gold outline-none p-3 text-xs text-zinc-200 font-sans font-light rounded-sm cursor-pointer"
                    {...register("experience")}
                  >
                    <option value="art-tour">Royal Mayfair Art Tour (£250/guest)</option>
                    <option value="helicopter">Helicopter Cotswolds Flight (£1,200/flight)</option>
                    <option value="cigar-masterclass">Vintage Cognac Cigar Masterclass (£180/guest)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="guests" className="block text-[10px] uppercase tracking-widest text-gold font-sans font-medium">
                    Guests count
                  </label>
                  <select
                    id="guests"
                    className="w-full bg-black/60 border border-gold/15 focus:border-gold outline-none p-3 text-xs text-zinc-200 font-sans font-light rounded-sm cursor-pointer"
                    {...register("guests", { valueAsNumber: true })}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>{num} Guests</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="date" className="block text-[10px] uppercase tracking-widest text-gold font-sans font-medium">
                    Select Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    className="w-full bg-black/60 border border-gold/15 focus:border-gold outline-none p-3 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300 scheme-dark"
                    {...register("date")}
                  />
                  {errors.date && (
                    <span className="text-[10px] text-red-400 font-sans block">{errors.date?.message as string}</span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="time" className="block text-[10px] uppercase tracking-widest text-gold font-sans font-medium">
                    Select Hour Slot
                  </label>
                  <select
                    id="time"
                    className="w-full bg-black/60 border border-gold/15 focus:border-gold outline-none p-3 text-xs text-zinc-200 font-sans font-light rounded-sm cursor-pointer"
                    {...register("time")}
                  >
                    <option value="10:00">10:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="14:00">14:00 PM</option>
                    <option value="16:00">16:00 PM</option>
                    <option value="18:00">18:00 PM</option>
                  </select>
                </div>

                <div className="space-y-1.5 col-span-1 sm:col-span-2">
                  <label htmlFor="notes" className="block text-[10px] uppercase tracking-widest text-gold font-sans font-medium">
                    Special Coordination Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    className="w-full bg-black/60 border border-gold/15 focus:border-gold outline-none p-3 text-xs text-zinc-200 font-sans font-light rounded-sm transition-all duration-300 resize-none"
                    placeholder="E.g., Special dietary requests, helicopter pick-up arrangements..."
                    {...register("notes")}
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2 text-xs py-3 cursor-pointer"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Finalizing Booking...
                    </>
                  ) : (
                    <>Book Curated Experience</>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[9px] text-zinc-500 font-sans uppercase tracking-widest pt-2">
                <ShieldCheck size={12} className="text-gold/60" /> Secure SSL Connection
              </div>
            </form>
          </div>
        </Container>
      </Section>
    </PageWrapper>
  );
}
