"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Sparkles, Flame, Eye } from "lucide-react";
import Image from "next/image";

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "philosophy" | "craft" | "sourcing";

export function StoryModal({ isOpen, onClose }: StoryModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("philosophy");

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: "philosophy",
      label: "Philosophy",
      icon: <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />,
    },
    {
      id: "craft",
      label: "The Craft",
      icon: <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5" />,
    },
    {
      id: "sourcing",
      label: "The Sourcing",
      icon: <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop with premium blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl bg-charcoal/95 border border-gold/15 rounded-sm shadow-elevation overflow-hidden luxury-glass flex flex-col md:flex-row h-[90vh] md:h-[650px] max-h-[90vh] z-10"
          >
            {/* Top thin gold design divider */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent z-20" />

            {/* Left Column: Premium Brand Visuals (Desktop only) */}
            <div className="hidden md:block md:w-[42%] relative h-full bg-zinc-950 border-r border-gold/10 overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-2 border border-gold/5 pointer-events-none z-20" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={
                      activeTab === "philosophy"
                        ? "/about-dish.png"
                        : activeTab === "craft"
                        ? "/menu-halibut.png"
                        : "/menu-chanterelles.png"
                    }
                    alt={`Aurelia Brand Story - ${activeTab}`}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Decorative Brand Seal Overlay */}
              <div className="absolute bottom-6 left-6 z-20">
                <span className="font-serif text-[10px] uppercase tracking-[0.3em] text-gold/80 block">
                  Aurelia Chronicle
                </span>
                <span className="font-sans text-[8px] uppercase tracking-[0.2em] text-zinc-500 block mt-1">
                  Est. 2024 · London Mayfair
                </span>
              </div>
            </div>

            {/* Right Column: Narrative Content & Navigation */}
            <div className="flex-1 flex flex-col h-full overflow-hidden p-6 sm:p-8 md:p-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <BookOpen className="w-3 h-3 text-gold/80" />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-sans font-medium">
                      The Chronicle
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-light text-zinc-100 tracking-wide">
                    Aurelia London
                  </h2>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 text-zinc-400 hover:text-gold transition-colors outline-none cursor-pointer rounded-full hover:bg-white/5"
                  aria-label="Close story chronicle"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tabs Selector */}
              <div className="flex border-b border-gold/10 pb-px mb-6 gap-2 overflow-x-auto scrollbar-none shrink-0">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-[10px] sm:text-xs uppercase tracking-widest font-sans font-medium border-b transition-all duration-300 relative cursor-pointer whitespace-nowrap ${
                        isActive
                          ? "text-gold border-gold"
                          : "text-zinc-500 border-transparent hover:text-zinc-300"
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Narrative Content Body (Scrollable if needed) */}
              <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gold/20 scroll-smooth">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6 text-zinc-300 font-sans text-xs sm:text-sm leading-relaxed font-light"
                  >
                    {activeTab === "philosophy" && (
                      <>
                        <h3 className="text-sm sm:text-base font-serif text-zinc-100 tracking-wide font-normal mb-2">
                          Culinary Architecture & Symbiosis
                        </h3>
                        <p>
                          At Aurelia, a plate is conceptualized not simply as a serving, but as a meticulously calculated structure where textures, colors, and temperatures form a cohesive sensory landscape. We draw inspiration from clean architectural geometries, crafting dishes that strike a perfect balance between visual symmetry and organic luxury.
                        </p>
                        <p>
                          Our dining space in Mayfair acts as a natural extension of this philosophy. Hand-finished charcoal surfaces, soft atmospheric lighting, and subtle gold accents harmonize to elevate the main theater: the culinary journey unfolding before you.
                        </p>
                      </>
                    )}

                    {activeTab === "craft" && (
                      <>
                        <h3 className="text-sm sm:text-base font-serif text-zinc-100 tracking-wide font-normal mb-2">
                          Precision Fermentation & Ancestral Fire
                        </h3>
                        <p>
                          Led by our team of passionate artisans, the kitchen serves as both a workshop and a sanctuary. Through custom-built aging chambers and our in-house fermentation program, we capture intense umami profiles and unlock forgotten depth in seasonal ingredients.
                        </p>
                        <p>
                          We balance ancestral techniques—such as birch-sap reduction, koji inoculations, and open pine grilling—with modern thermodynamic precision. The result is a progressive Modern European menu that respects time while pushing culinary boundaries.
                        </p>
                      </>
                    )}

                    {activeTab === "sourcing" && (
                      <>
                        <h3 className="text-sm sm:text-base font-serif text-zinc-100 tracking-wide font-normal mb-2">
                          Singular Partnerships & Wild Foraging
                        </h3>
                        <p>
                          Uncompromised luxury begins with integrity at the roots. We collaborate exclusively with independent biodynamic farms, artisan producers, and family-owned heritage estates who practice restorative, regenerative agriculture.
                        </p>
                        <p>
                          Each morning, dedicated foragers harvest wild ingredients from British shorelines and historic woodlands—bringing sea buckthorn, wild chanterelles, and coastal samphire straight to our pass. This direct connection preserves the vibrant energy of the terroir in every bite.
                        </p>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Editorial Footer Decoration */}
              <div className="mt-6 pt-4 border-t border-gold/5 flex justify-between items-center text-[9px] uppercase tracking-widest text-zinc-500 font-sans shrink-0">
                <span>London Mayfair</span>
                <span>Experience No. IV</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
