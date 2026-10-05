"use client";

import { motion } from "motion/react";
import { createElement } from "react";
import {
  useIsHydrated,
  usePrefersReducedMotion,
} from "@/components/ui/use-prefers-reduced-motion";
import { DURATION, EASE, TEXT_STAGGER } from "@/lib/design/motion";

export type AnimatedTag = "h1" | "h2" | "h3" | "h4" | "p" | "span";

const motionTags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  p: motion.p,
  span: motion.span,
};

const unitVariants = {
  hidden: { opacity: 0, y: "110%" },
  visible: { opacity: 1, y: 0 },
};

const textVariants = {
  hidden: {},
  visible: {},
};

type AnimatedTextProps = {
  as?: AnimatedTag;
  children: string;
  mode?: "words" | "lines" | "chars";
  stagger?: number;
  delay?: number;
  className?: string;
};

function splitText(text: string, mode: NonNullable<AnimatedTextProps["mode"]>) {
  if (mode === "lines") return text.split("\n");
  if (mode === "chars") return Array.from(text);
  return text.split(/(\s+)/).filter(Boolean);
}

export function AnimatedText({
  as = "span",
  children,
  mode = "words",
  stagger = as === "p" ? 0.015 : TEXT_STAGGER,
  delay = 0,
  className = "",
}: AnimatedTextProps) {
  const isHydrated = useIsHydrated();
  const prefersReducedMotion = usePrefersReducedMotion();
  const Component = motionTags[as];
  const units = splitText(children, mode);

  if (!isHydrated || prefersReducedMotion) {
    return createElement(
      as,
      {
        "aria-label": children,
        className: `block ${className}`.trim(),
        style: { display: "block" },
      },
      children,
    );
  }

  return (
    <Component
      aria-label={children}
      className={`block ${className}`.trim()}
      style={{ display: "block" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={textVariants}
      transition={{ delayChildren: delay, staggerChildren: stagger }}
    >
      {units.map((unit, index) => {
        if (mode === "words" && /^\s+$/.test(unit)) {
          return (
            <span key={`space-${index}`} aria-hidden="true">
              {unit}
            </span>
          );
        }

        return (
          <span
            key={`${unit}-${index}`}
            aria-hidden="true"
            className={mode === "lines" ? "block overflow-hidden" : "inline-block overflow-hidden"}
            style={{ paddingBottom: "0.12em", marginBottom: "-0.12em" }}
          >
            <motion.span
              variants={unitVariants}
              transition={{ duration: DURATION.slow, ease: EASE }}
              style={{ display: "inline-block", willChange: "transform" }}
            >
              {unit}
            </motion.span>
          </span>
        );
      })}
    </Component>
  );
}
