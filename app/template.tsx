"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/components/ui/use-prefers-reduced-motion";
import { DURATION, EASE } from "@/lib/design/motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : DURATION.base,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  );
}
