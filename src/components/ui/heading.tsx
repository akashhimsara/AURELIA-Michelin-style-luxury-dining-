import React from "react";

interface HeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
  subtitle?: boolean;
}

export function Heading({
  as: Component = "h2",
  children,
  className = "",
  accent = false,
  subtitle = false,
}: HeadingProps) {
  // Styles for the subtitle uppercase label
  if (subtitle) {
    return (
      <span
        className={`block text-[10px] sm:text-xs font-sans font-medium uppercase tracking-[0.25em] text-gold ${className}`}
      >
        {children}
      </span>
    );
  }

  const baseStyles = "font-serif font-light tracking-wide text-zinc-100";

  const sizeStyles = {
    h1: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight",
    h2: "text-3xl sm:text-4xl md:text-5xl leading-tight",
    h3: "text-2xl sm:text-3xl md:text-4xl leading-snug",
    h4: "text-xl sm:text-2xl md:text-3xl leading-snug",
    h5: "text-lg sm:text-xl md:text-2xl leading-normal",
    h6: "text-base sm:text-lg md:text-xl leading-normal",
  };

  const accentStyles = accent ? "text-gold-gradient" : "";

  return (
    <Component className={`${baseStyles} ${sizeStyles[Component]} ${accentStyles} ${className}`}>
      {children}
    </Component>
  );
}
