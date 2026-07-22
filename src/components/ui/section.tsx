import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  padding?: "sm" | "md" | "lg" | "none";
}

export function Section({
  children,
  className = "",
  id,
  padding = "md",
}: SectionProps) {
  const paddingStyles = {
    sm: "py-12 sm:py-16",
    md: "py-24 sm:py-32",
    lg: "py-36 sm:py-48",
    none: "py-0",
  };

  return (
    <section id={id} className={`${paddingStyles[padding]} ${className}`}>
      {children}
    </section>
  );
}
