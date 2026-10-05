"use client";

import { motion } from "motion/react";
import { createElement, type ReactNode } from "react";
import {
  useIsHydrated,
  usePrefersReducedMotion,
} from "@/components/ui/use-prefers-reduced-motion";
import { DURATION, EASE } from "@/lib/design/motion";

type RevealTag = "div" | "h1" | "h2" | "h3" | "h4" | "p" | "span";

const motionTags = {
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  p: motion.p,
  span: motion.span,
};

const revealVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function ScrollReveal({
  children,
  className,
  delay = 0.05,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: RevealTag;
}) {
  const isHydrated = useIsHydrated();
  const prefersReducedMotion = usePrefersReducedMotion();
  const Component = motionTags[as];

  if (!isHydrated || prefersReducedMotion) {
    return createElement(
      as,
      {
        "data-scroll-reveal": true,
        className: `${as === "span" ? "inline-block" : ""} ${className ?? ""}`.trim(),
      },
      children,
    );
  }

  return (
    <Component
      data-scroll-reveal
      className={`${as === "span" ? "inline-block" : ""} ${className ?? ""}`.trim()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={revealVariants}
      transition={{
        duration: DURATION.slow,
        delay,
        ease: EASE,
      }}
    >
      {children}
    </Component>
  );
}
