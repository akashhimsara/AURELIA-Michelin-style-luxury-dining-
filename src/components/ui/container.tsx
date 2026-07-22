import React from "react";

interface ContainerProps {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  clean?: boolean;
}

export function Container({
  as: Component = "div",
  children,
  className = "",
  clean = false,
}: ContainerProps) {
  return (
    <Component
      className={`mx-auto w-full max-w-7xl ${
        clean ? "" : "px-6 sm:px-8 lg:px-12"
      } ${className}`}
    >
      {children}
    </Component>
  );
}
