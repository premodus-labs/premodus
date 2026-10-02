"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { usePrefersReducedMotion } from "@/components/ui/use-prefers-reduced-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

type SectionTransitionProps = HTMLMotionProps<"section">;

export function SectionTransition({
  children,
  className,
  ...props
}: SectionTransitionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.section
      {...props}
      data-section-transition
      className={className}
      initial={prefersReducedMotion ? "visible" : "hidden"}
      animate={prefersReducedMotion ? "visible" : undefined}
      variants={sectionVariants}
      whileInView={prefersReducedMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.72,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.section>
  );
}
