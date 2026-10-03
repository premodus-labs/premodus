"use client";

import { motion } from "motion/react";
import {
  useIsHydrated,
  usePrefersReducedMotion,
} from "@/components/ui/use-prefers-reduced-motion";
import { DURATION, EASE } from "@/lib/design/motion";

/**
 * App Router remounts `template.tsx` on navigation (unlike `layout.tsx`).
 * Enter-only fade + slide; exit transitions need the View Transitions API.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const isHydrated = useIsHydrated();
  const prefersReducedMotion = usePrefersReducedMotion();
  const animate = isHydrated && !prefersReducedMotion;

  return (
    <motion.div
      key={animate ? "animated-template" : "static-template"}
      initial={animate ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: animate ? DURATION.base : 0,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  );
}
