import React from "react";
import Link from "next/link";
import { Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { verifyEmail } from "@/features/auth/actions";

interface VerifyEmailPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const params = await searchParams;
  const token = params.token || "";

  const result = await verifyEmail(token);

  return (
    <PageWrapper>
      <Section className="flex-1 flex items-center justify-center pt-20 pb-24 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.015)_0%,_black_100%)]">
        <Container className="max-w-md mx-auto">
          <div className="w-full p-8 border border-gold/15 bg-charcoal/80 rounded-sm text-center space-y-6 shadow-elevation relative overflow-hidden luxury-glass">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-gold/10 rounded-full blur-[40px] pointer-events-none" />

            <div className="flex justify-center">
              {result.success ? (
                <div className="w-14 h-14 rounded-full border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-center text-emerald-400">
                  <Check size={24} />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full border border-red-500/30 bg-red-950/20 flex items-center justify-center text-red-400">
                  <AlertCircle size={24} />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Heading subtitle>Account Registry</Heading>
              <Heading as="h2" accent className="tracking-wide">
                {result.success ? "Verification Complete" : "Verification Failed"}
              </Heading>
              <p className="text-xs text-zinc-400 font-sans max-w-sm mx-auto leading-relaxed pt-2">
                {result.message}
              </p>
            </div>

            <div className="pt-2">
              <Link href="/login">
                <Button variant="primary" size="sm">
                  {result.success ? "Proceed to Login" : "Back to Login"}
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </PageWrapper>
  );
}
