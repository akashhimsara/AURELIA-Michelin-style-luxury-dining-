import React from "react";
import { Navbar } from "../layout/navbar";
import { Footer } from "../layout/footer";

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="relative min-h-screen flex flex-col bg-black text-zinc-100 selection:bg-gold/30 selection:text-gold antialiased overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-charcoal-light),_transparent_60%)] pointer-events-none" />

      {/* Brand Navbar */}
      <Navbar />

      {/* Main Canvas Area */}
      <main className="flex-1 flex flex-col pt-24 z-10">
        {children}
      </main>

      {/* Brand Footer */}
      <Footer />
    </div>
  );
}
