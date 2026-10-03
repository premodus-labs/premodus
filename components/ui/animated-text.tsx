"use client";

import { motion, useInView } from "motion/react";
import { createElement, useRef } from "react";
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

type AnimatedTextProps = {
  as?: AnimatedTag;
  children: string;
  mode?: "words" | "lines" | "chars";
  stagger?: number;
  delay?: number;
  className?: string;
};

function AnimatedUnit({
  unit,
  mode,
  delay,
  stagger,
  index,
}: {
  unit: string;
  mode: NonNullable<AnimatedTextProps["mode"]>;
  delay: number;
  stagger: number;
  index: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={mode === "lines" ? "block overflow-hidden" : "inline-block overflow-hidden"}
      style={{ paddingBottom: "0.12em", marginBottom: "-0.12em" }}
    >
      <motion.span
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={unitVariants}
        transition={{
          duration: DURATION.slow,
          delay: delay + index * stagger,
          ease: EASE,
        }}
        style={{ display: "inline-block", willChange: "transform" }}
      >
        {unit}
      </motion.span>
    </span>
  );
}

function splitText(text: string, mode: NonNullable<AnimatedTextProps["mode"]>) {
  if (mode === "lines") return text.split("\n");
  if (mode === "chars") return Array.from(text);
  return text.split(/(\s+)/).filter(Boolean);
}

export function AnimatedText({
  as = "span",
  children,
  mode = "words",
  stagger = TEXT_STAGGER,
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
    >
      {units.map((unit, index) => {
        if (mode === "words" && /^\s+$/.test(unit)) {
          return (
            <span key={`space-${index}`} aria-hidden="true">
              {unit}
            </span>
          );
        }

        const currentIndex = units
          .slice(0, index)
          .filter((candidate) => mode !== "words" || !/^\s+$/.test(candidate))
          .length;

        return (
          <AnimatedUnit
            key={`${unit}-${index}`}
            unit={unit}
            mode={mode}
            delay={delay}
            stagger={stagger}
            index={currentIndex}
          />
        );
      })}
    </Component>
  );
}
