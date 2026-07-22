import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const baseStyle = "luxury-btn";
  
  const variantStyles = {
    primary: "luxury-btn-primary",
    outline: "luxury-btn-outline",
    ghost: "bg-transparent text-zinc-400 hover:text-white border-transparent",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-8 py-3 text-xs",
    lg: "px-10 py-4 text-xs",
  };

  const classes = `${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
