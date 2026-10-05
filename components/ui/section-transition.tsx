"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/components/ui/use-prefers-reduced-motion";
import { DURATION, EASE } from "@/lib/design/motion";

type SectionTransitionProps = {
  children?: React.ReactNode;
  className?: string;
  animateOnView?: boolean;
};

export function SectionTransition({
  children,
  className,
  animateOnView = true,
}: SectionTransitionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = animateOnView && !prefersReducedMotion;

  return (
    <motion.section
      data-section-transition
      className={className}
      initial={shouldAnimate ? "hidden" : false}
      whileInView={shouldAnimate ? "visible" : undefined}
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: DURATION.slow, ease: EASE }}
    >
      {children}
    </motion.section>
  );
}
