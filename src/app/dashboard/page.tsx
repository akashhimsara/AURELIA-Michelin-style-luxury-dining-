"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Calendar,
  Compass,
  History,
  Award,
  Crown,
  LogOut,
  ChevronRight,
  Loader2,
  Settings,
  Coffee,
  BedDouble,
} from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { getGuestDashboardData } from "@/features/profile/actions";
import { logoutGuest } from "@/features/auth/actions";

interface ReservationItem {
  id: string;
  type: string;
  name: string;
  date: string;
  time: string | null;
  guests: number;
  status: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<{
    user: { name: string; email: string };
    loyaltyPoints: number;
    vipTier: string;
    upcoming: ReservationItem[];
    history: ReservationItem[];
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      const res = await getGuestDashboardData();
      if (!res.success) {
        router.push("/login");
      } else {
        setDashboardData(res as any);
      }
      setLoading(false);
    }
    loadData();
  }, [router]);

  const handleLogout = () => {
    startTransition(async () => {
      await logoutGuest();
      router.push("/");
      router.refresh();
    });
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex-1 flex items-center justify-center py-40">
          <Loader2 className="animate-spin text-gold" size={32} />
        </div>
      </PageWrapper>
    );
  }

  if (!dashboardData) return null;

  return (
    <PageWrapper>
      <Section className="relative pt-28 pb-20 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.015)_0%,_black_100%)]">
        <Container className="space-y-10">
          {/* Header Panel */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gold/10">
            <div>
              <Heading subtitle>Welcome Back</Heading>
              <Heading as="h1" accent className="tracking-wide text-2xl sm:text-3xl">
                {dashboardData.user.name}
              </Heading>
              <p className="text-xs text-zinc-500 font-sans mt-0.5">{dashboardData.user.email}</p>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard/profile">
                <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-sans py-2">
                  <Settings size={12} /> Profile Settings
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-red-400 border-red-500/20 bg-red-950/5 hover:bg-red-950/20 font-sans py-2"
                onClick={handleLogout}
                disabled={isPending}
              >
                <LogOut size={12} /> Logout
              </Button>
            </div>
          </div>

          {/* Loyalty & Tier Highlights Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-gold/15 bg-charcoal/40 rounded-sm relative luxury-glass overflow-hidden flex items-center justify-between shadow-elevation">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-[40px] pointer-events-none" />
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-sans font-medium">Guest Status</span>
                <div className="flex items-center gap-2">
                  <Crown className="text-gold" size={20} />
                  <span className="font-serif text-xl sm:text-2xl text-zinc-100 tracking-wide font-light">{dashboardData.vipTier}</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-light font-sans">Access premium dining options and bespoke stay rates.</p>
              </div>
            </div>

            <div className="p-6 border border-gold/15 bg-charcoal/40 rounded-sm relative luxury-glass overflow-hidden flex items-center justify-between shadow-elevation">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-[40px] pointer-events-none" />
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-sans font-medium">Accumulated Rewards</span>
                <div className="flex items-center gap-2">
                  <Award className="text-gold" size={20} />
                  <span className="font-serif text-xl sm:text-2xl text-zinc-100 tracking-wide font-light">{dashboardData.loyaltyPoints} Points</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-light font-sans">Redeem points for spa treatments, private dining, or suite discounts.</p>
              </div>
            </div>
          </div>

          {/* Main Dashboard Rows */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
            {/* Left Stays Columns (Upcoming / History) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Reservations */}
              <div className="space-y-4">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-gold font-sans font-medium flex items-center gap-2">
                  <Calendar size={12} /> Upcoming Stays & Bookings
                </h3>

                {dashboardData.upcoming.length === 0 ? (
                  <div className="p-8 border border-gold/5 bg-charcoal/10 rounded-sm text-center">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-sans block">No Stays Arranged</span>
                    <p className="text-[9px] text-zinc-600 mt-1 font-light">Your upcoming arrangements catalog is empty.</p>
                    <div className="mt-4 flex justify-center gap-3">
                      <Link href="/rooms">
                        <Button size="sm" variant="outline" className="text-[9px] py-1.5 uppercase font-sans">Book Suite</Button>
                      </Link>
                      <Link href="/private-dining">
                        <Button size="sm" variant="outline" className="text-[9px] py-1.5 uppercase font-sans">Reserve Dining</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.upcoming.map((res) => (
                      <div key={res.id} className="p-4 border border-gold/10 hover:border-gold/20 bg-charcoal/30 flex justify-between items-center transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 border border-gold/15 bg-gold/5 text-gold">
                            {res.type === "Dining" ? <Coffee size={14} /> : <BedDouble size={14} />}
                          </div>
                          <div>
                            <h4 className="text-xs font-serif font-light text-zinc-200 tracking-wide">{res.name}</h4>
                            <p className="text-[10px] text-zinc-500 font-sans mt-0.5">
                              {new Date(res.date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}{res.time ? ` at ${res.time}` : ""} &bull; {res.guests} Guests
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 text-[8px] uppercase tracking-widest font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-500/20">
                          {res.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Booking History */}
              <div className="space-y-4">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-gold font-sans font-medium flex items-center gap-2">
                  <History size={12} /> Stays & Dining History
                </h3>

                {dashboardData.history.length === 0 ? (
                  <div className="p-8 border border-gold/5 bg-charcoal/10 rounded-sm text-center">
                    <p className="text-[9px] text-zinc-600 font-light">No historical reservations log found.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.history.map((res) => (
                      <div key={res.id} className="p-4 border border-zinc-900 bg-black/40 flex justify-between items-center opacity-60 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-3">
                          <div className="p-2 border border-zinc-800 bg-zinc-950 text-zinc-400">
                            {res.type === "Dining" ? <Coffee size={14} /> : <BedDouble size={14} />}
                          </div>
                          <div>
                            <h4 className="text-xs font-serif font-light text-zinc-300 tracking-wide">{res.name}</h4>
                            <p className="text-[10px] text-zinc-600 font-sans mt-0.5">
                              {new Date(res.date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}{res.time ? ` at ${res.time}` : ""} &bull; {res.guests} Guests
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 text-[8px] uppercase tracking-widest font-medium border border-zinc-800 text-zinc-500">
                          {res.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Quick Links Panel */}
            <div className="space-y-6">
              <div className="p-5 border border-gold/10 bg-charcoal/20 rounded-sm relative luxury-glass text-left">
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
                <h4 className="text-[10px] uppercase tracking-[0.25em] font-sans font-medium text-gold mb-4">Quick Navigation</h4>
                <div className="flex flex-col gap-2 font-sans text-xs">
                  <Link href="/rooms" className="p-3 border border-gold/5 bg-charcoal/30 flex justify-between items-center hover:border-gold/30 transition-all text-zinc-300 hover:text-gold">
                    <span>Reserve Guest Suite</span>
                    <ChevronRight size={12} />
                  </Link>
                  <Link href="/private-dining" className="p-3 border border-gold/5 bg-charcoal/30 flex justify-between items-center hover:border-gold/30 transition-all text-zinc-300 hover:text-gold">
                    <span>Private Dining Request</span>
                    <ChevronRight size={12} />
                  </Link>
                  <Link href="/spa" className="p-3 border border-gold/5 bg-charcoal/30 flex justify-between items-center hover:border-gold/30 transition-all text-zinc-300 hover:text-gold">
                    <span>Wellness Therapy Booking</span>
                    <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </PageWrapper>
  );
}
