"use client";

import {
  createElement,
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/components/ui/use-prefers-reduced-motion";
import { DURATION, EASE, TEXT_STAGGER } from "@/lib/design/motion";

export type AnimatedTag = "h1" | "h2" | "h3" | "h4";

const motionTags: Record<AnimatedTag, React.ElementType> = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
};

type AnimatedTextProps = {
  as?: AnimatedTag;
  children: string;
  mode?: "words" | "lines";
  stagger?: number;
  delay?: number;
  className?: string;
} & Omit<ComponentPropsWithoutRef<AnimatedTag>, "as" | "children" | "className">;

function splitText(text: string, mode: NonNullable<AnimatedTextProps["mode"]>) {
  if (mode === "lines") return text.split("\n");
  return text.split(/(\s+)/).filter(Boolean);
}

export function AnimatedText({
  as = "h1",
  children,
  mode = "words",
  stagger = TEXT_STAGGER,
  delay = 0,
  className = "",
  ...props
}: AnimatedTextProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const units = splitText(children, mode);

  if (prefersReducedMotion) {
    return createElement(
      as,
      {
        ...props,
        "aria-label": children,
        className: `block ${className}`.trim(),
        style: { ...props.style, display: "block" },
      },
      children,
    );
  }

  let wordIndex = 0;
  return createElement(
    motionTags[as],
    {
      ...props,
      "aria-label": children,
      className: `block ${className}`.trim(),
      style: { ...props.style, display: "block" } as CSSProperties,
      initial: "hidden",
      whileInView: "visible",
      viewport: { once: true, amount: 0.15 },
      variants: { hidden: {}, visible: {} },
    },
    units.map((unit, index) => {
      if (/^\s+$/.test(unit)) {
        return (
          <span key={`space-${index}`} aria-hidden="true">
            {unit}
          </span>
        );
      }

      const currentWordIndex = wordIndex++;
      return (
        <span
          key={`${unit}-${index}`}
          aria-hidden="true"
          className={mode === "lines" ? "block overflow-hidden" : "inline-block overflow-hidden"}
          style={{ paddingBottom: "0.12em", marginBottom: "-0.12em" }}
        >
          <motion.span
            variants={{
              hidden: { y: "110%" },
              visible: { y: 0 },
            }}
            transition={{
              duration: DURATION.slow,
              delay: delay + currentWordIndex * stagger,
              ease: EASE,
            }}
            style={{ display: "inline-block" }}
          >
            {unit}
          </motion.span>
        </span>
      );
    }),
  );
}
