"use client";

import { motion } from "motion/react";
import {
  useIsHydrated,
  usePrefersReducedMotion,
} from "@/components/ui/use-prefers-reduced-motion";
import { DURATION, EASE } from "@/lib/design/motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

type SectionTransitionProps = {
  children?: React.ReactNode;
  className?: string;
  /** Intersection amount; prefer "some" for sections taller than the viewport. */
  viewportAmount?: number | "some" | "all";
  animateOnView?: boolean;
};

export function SectionTransition({
  children,
  className,
  viewportAmount = "some",
  animateOnView = true,
}: SectionTransitionProps) {
  const isHydrated = useIsHydrated();
  const prefersReducedMotion = usePrefersReducedMotion();
  const skipViewAnimation = !animateOnView || prefersReducedMotion || !isHydrated;

  return (
    <motion.section
      key={skipViewAnimation ? "static" : "animated"}
      data-section-transition
      className={className}
      initial={skipViewAnimation ? false : "hidden"}
      variants={sectionVariants}
      whileInView={skipViewAnimation ? undefined : "visible"}
      viewport={{ once: true, amount: viewportAmount }}
      transition={{
        duration: prefersReducedMotion ? 0 : DURATION.slow,
        ease: EASE,
      }}
    >
      {children}
    </motion.section>
  );
}
