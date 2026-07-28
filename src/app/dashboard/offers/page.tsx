"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Percent, Compass, Coffee, Sparkles, RefreshCw, Landmark, ShieldCheck } from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { getGuestDashboardData } from "@/features/profile/actions";

interface OfferPackage {
  title: string;
  subtitle: string;
  description: string;
  code: string;
  discount: string;
  targetRoomId: string;
  iconType: "lodging" | "dining" | "spa";
}

export default function DashboardOffersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userTier, setUserTier] = useState("Standard Guest");

  const [packages, setPackages] = useState<OfferPackage[]>([]);

  useEffect(() => {
    async function loadData() {
      const res = await getGuestDashboardData();
      if (!res.success) {
        router.push("/login");
      } else {
        setUserTier(res.vipTier || "Standard Guest");

        // Set static promotion items but link to appropriate booking paths
        setPackages([
          {
            title: "The Royal Mayfair Escape",
            subtitle: "Premium Stay Package",
            description: "Indulge in two nights inside our premier Penthouse Suite accompanied by custom breakfast setups and complimentary champagne bottles upon arrival.",
            code: "ROYAL15",
            discount: "15% off lodging rates",
            targetRoomId: "fallback-penthouse",
            iconType: "lodging",
          },
          {
            title: "Michelin Gastronomy Weekend",
            subtitle: "Culinary Dining Bundle",
            description: "A one-night stay inside our Deluxe Heritage Chamber combined with a priority tasting menu arrangement for two at The Chef's Oak Table.",
            code: "MICHELIN10",
            discount: "10% off package rates",
            targetRoomId: "fallback-heritage",
            iconType: "dining",
          },
          {
            title: "Sanctuary Wellness Retreat",
            subtitle: "Thermal Spa & Suite Bundle",
            description: "A two-night relaxation booking inside our Presidential Villa, featuring unlimited access to thermal cabins and a 90m hot stone massage session.",
            code: "SANCTUARY20",
            discount: "20% off villa lodgings",
            targetRoomId: "fallback-presidential",
            iconType: "spa",
          },
        ]);
      }
      setLoading(false);
    }

    loadData();
  }, [router]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex-1 flex items-center justify-center py-40">
          <RefreshCw className="animate-spin text-gold" size={32} />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Section className="relative pt-28 pb-20 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.015)_0%,_black_100%)]">
        <Container className="max-w-3xl mx-auto space-y-8 text-left">
          {/* Top Return Link */}
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-zinc-500 hover:text-gold transition-colors font-sans"
            >
              <ArrowLeft size={10} /> Back to Dashboard
            </Link>
          </div>

          <div>
            <Heading subtitle>Bespoke Escape Codes</Heading>
            <Heading as="h1" accent className="tracking-wide text-2xl sm:text-3xl">
              Active Offers & Rates
            </Heading>
            <p className="text-xs text-zinc-500 font-sans mt-1">
              Active offers tailored for your current tier: <span className="text-gold font-medium font-serif">{userTier}</span>. Claim coupon codes instantly.
            </p>
          </div>

          {/* Catalog grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.title} className="p-6 border border-gold/10 bg-charcoal/40 relative rounded-sm luxury-glass flex flex-col justify-between space-y-6">
                <div className="absolute inset-1.5 border border-gold/5 pointer-events-none z-10" />

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] uppercase tracking-widest text-gold font-sans font-medium">
                      {pkg.subtitle}
                    </span>
                    <div className="flex items-center gap-0.5 text-[8px] text-emerald-400 font-semibold px-1.5 py-0.5 bg-emerald-950/40 border border-emerald-500/20">
                      <Percent size={8} /> {pkg.code}
                    </div>
                  </div>

                  <h3 className="text-sm font-serif font-light text-zinc-200 tracking-wide mt-1">{pkg.title}</h3>
                  <p className="text-[10px] text-zinc-400 font-sans leading-relaxed font-light">{pkg.description}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-gold/5">
                  <div className="flex justify-between items-center text-[10px] text-zinc-400 font-sans">
                    <span>Discount:</span>
                    <span className="text-gold font-medium">{pkg.discount}</span>
                  </div>
                  
                  {/* Claim Button */}
                  <Link href={`/reserve?roomId=${pkg.targetRoomId}&promo=${pkg.code}`}>
                    <Button variant="primary" className="w-full text-[9px] uppercase tracking-wider py-2 font-sans flex items-center justify-center gap-1 cursor-pointer">
                      Claim & Book Option
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-[9px] text-zinc-600 font-sans uppercase tracking-widest pt-4">
            <ShieldCheck size={12} className="text-gold/40" /> Verified Guest Club Rates
          </div>
        </Container>
      </Section>
    </PageWrapper>
  );
}
