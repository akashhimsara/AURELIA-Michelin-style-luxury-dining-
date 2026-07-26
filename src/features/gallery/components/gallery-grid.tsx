"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Heading } from "@/components/ui/heading";

interface GalleryItem {
  src: string;
  alt: string;
  category: "suites" | "gastronomy" | "wellness" | "events";
  title: string;
  caption: string;
}

const items: GalleryItem[] = [
  {
    src: "/room-ocean.png",
    alt: "Ocean Presidential Villa",
    category: "suites",
    title: "Ocean Presidential Villa",
    caption: "Panoramic sea-view balcony with a private glass-front infinity pool.",
  },
  {
    src: "/room-penthouse.png",
    alt: "Mayfair Penthouse Suite",
    category: "suites",
    title: "Mayfair Penthouse Suite",
    caption: "Generous styling with handcrafted velvet beds and modern gold accents.",
  },
  {
    src: "/room-heritage.png",
    alt: "Deluxe Heritage Chamber",
    category: "suites",
    title: "Deluxe Heritage Chamber",
    caption: "A classical master bedroom with bespoke walnut panels and a stone hearth.",
  },
  {
    src: "/about-dish.png",
    alt: "Lobster Carpaccio Gastronomy",
    category: "gastronomy",
    title: "Lobster Carpaccio",
    caption: "Bespoke culinary layout topped with fresh dill and local microgreens.",
  },
  {
    src: "/menu-chanterelles.png",
    alt: "Sautéed Autumn Chanterelles",
    category: "gastronomy",
    title: "Autumn Chanterelles",
    caption: "Delicate woodland mushrooms, light white wine butter, and brioche toast.",
  },
  {
    src: "/menu-halibut.png",
    alt: "Pan-roasted Atlantic Halibut",
    category: "gastronomy",
    title: "Atlantic Halibut",
    caption: "Pan-roasted fillet served with a vibrant saffron-infused vanilla emulsion.",
  },
  {
    src: "/menu-pear.png",
    alt: "Saffron Poached Pear",
    category: "gastronomy",
    title: "Saffron Poached Pear",
    caption: "Poached winter pear, rich mascarpone mousse, and caramelized honeycomb.",
  },
  {
    src: "/spa-massage.png",
    alt: "Himalayan Salt Stone Therapy",
    category: "wellness",
    title: "Himalayan Stone Therapy",
    caption: "Deep mineral hot stone massage rooms to release muscle tension.",
  },
  {
    src: "/spa-facial.png",
    alt: "Gold Leaf Facial Skin Care",
    category: "wellness",
    title: "Gold Leaf Facial",
    caption: "Anti-ageing skin regenerator utilizing genuine 24k gold leaf foil.",
  },
  {
    src: "/spa-detox.png",
    alt: "Organic Seaweed body wrap",
    category: "wellness",
    title: "Seaweed Body Wrap",
    caption: "Fresh seaweed wrap drawing impurities and locking in deep hydration.",
  },
  {
    src: "/event-wedding.png",
    alt: "Imperial Garden Wedding Ceremony",
    category: "events",
    title: "Imperial Garden Wedding",
    caption: "Elegant pavilion draped in white silk, illuminated by soft fairy lights.",
  },
  {
    src: "/event-corporate.png",
    alt: "Grand Ballroom Executive Seminar",
    category: "events",
    title: "Grand Ballroom Seminar",
    caption: "Executive conference setup styled in gold and minimalist charcoal panels.",
  },
  {
    src: "/event-private.png",
    alt: "Intimate Botanical Glasshouse Dinner",
    category: "events",
    title: "Glasshouse Canopy Banquet",
    caption: "Intimate dining table settings surrounded by tropical exotic orchids.",
  },
];

export function GalleryGrid() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filteredItems = items.filter((item) => {
    if (activeTab === "all") return true;
    return item.category === activeTab;
  });

  // Handle keyboard events inside the lightbox
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIndex(null);
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : null));
      } else if (e.key === "ArrowLeft") {
        setActiveIndex((prev) =>
          prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Lock background scroll when lightbox is active
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [activeIndex, filteredItems.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex !== null) {
      setActiveIndex((activeIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex !== null) {
      setActiveIndex((activeIndex + 1) % filteredItems.length);
    }
  };

  const tabs = [
    { label: "All Collections", val: "all" },
    { label: "Suites", val: "suites" },
    { label: "Gastronomy", val: "gastronomy" },
    { label: "Wellness", val: "wellness" },
    { label: "Events", val: "events" },
  ];

  return (
    <div className="space-y-12">
      {/* Category Selection Tabs */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-gold/10 pb-1 max-w-xl mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.val}
            onClick={() => {
              setActiveTab(tab.val);
              setActiveIndex(null);
            }}
            className={`px-4 py-2.5 text-[10px] uppercase tracking-wider font-sans font-medium transition-all border-b-2 outline-none cursor-pointer ${
              activeTab === tab.val
                ? "border-gold text-gold"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Masonry-style Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <article
            key={item.src}
            onClick={() => setActiveIndex(index)}
            className="group relative aspect-[4/3] w-full border border-gold/10 bg-charcoal/40 rounded-sm overflow-hidden gold-border-glow shadow-elevation cursor-pointer flex flex-col justify-end"
          >
            <div className="absolute inset-1.5 border border-gold/5 pointer-events-none z-10" />

            {/* Photo */}
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 350px"
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              loading="lazy"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500 z-20" />

            {/* Content Details */}
            <div className="absolute inset-x-0 bottom-0 p-5 space-y-1 z-30 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <span className="text-[7px] uppercase tracking-widest text-gold font-sans font-semibold block">
                {item.category}
              </span>
              <h4 className="text-xs sm:text-sm font-serif text-zinc-100 tracking-wide font-light flex items-center gap-1.5">
                {item.title}
                <ZoomIn size={12} className="text-gold/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </h4>
              <p className="text-[10px] text-zinc-400 font-sans font-light leading-normal opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                {item.caption}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeIndex !== null && (
        <div
          onClick={() => setActiveIndex(null)}
          className="fixed inset-0 bg-black/98 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
        >
          {/* Close button */}
          <button
            onClick={() => setActiveIndex(null)}
            className="absolute top-6 right-6 text-zinc-400 hover:text-gold transition-colors duration-300 p-2 cursor-pointer z-50 outline-none"
            aria-label="Close Lightbox"
          >
            <X size={24} />
          </button>

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-6 text-zinc-400 hover:text-gold transition-colors duration-300 p-3 cursor-pointer z-50 outline-none bg-black/40 border border-gold/10 hover:border-gold/30 rounded-full"
            aria-label="Previous Image"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Expanded Image container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl aspect-[16/10] overflow-hidden border border-gold/10 bg-zinc-950 shadow-elevation animate-scale-up"
          >
            <div className="absolute inset-1.5 border border-gold/5 pointer-events-none z-10" />

            <Image
              src={filteredItems[activeIndex].src}
              alt={filteredItems[activeIndex].alt}
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1000px"
              priority
            />

            {/* Slide details details */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 space-y-1.5 z-20">
              <span className="text-[8px] uppercase tracking-widest text-gold font-sans font-semibold">
                {filteredItems[activeIndex].category}
              </span>
              <h3 className="text-sm sm:text-base font-serif text-zinc-100 font-light tracking-wide">
                {filteredItems[activeIndex].title}
              </h3>
              <p className="text-xs text-zinc-400 font-sans font-light leading-relaxed max-w-xl">
                {filteredItems[activeIndex].caption}
              </p>
              <div className="text-[9px] text-zinc-500 font-sans tracking-wider pt-2">
                Image {activeIndex + 1} of {filteredItems.length}
              </div>
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-6 text-zinc-400 hover:text-gold transition-colors duration-300 p-3 cursor-pointer z-50 outline-none bg-black/40 border border-gold/10 hover:border-gold/30 rounded-full"
            aria-label="Next Image"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
