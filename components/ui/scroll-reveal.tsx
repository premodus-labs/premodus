"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/components/ui/use-prefers-reduced-motion";

const variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.div
      data-scroll-reveal
      className={className}
      initial={prefersReducedMotion ? "visible" : "hidden"}
      animate={prefersReducedMotion ? "visible" : undefined}
      whileInView={prefersReducedMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.15 }}
      variants={variants}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.9,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}