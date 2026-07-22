"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface AnimationWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
}

export function AnimationWrapper({
  children,
  delay = 0,
  className = "",
  ...props
}: AnimationWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1], // Premium bezier cubic ease curve
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
