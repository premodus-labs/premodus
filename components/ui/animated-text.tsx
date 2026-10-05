"use client";

import { createElement } from "react";
import { useScrollReveal } from "@/components/ui/use-scroll-reveal";

export type AnimatedTag = "h1" | "h2" | "h3" | "h4" | "p" | "span";

type AnimatedTextProps = {
  as?: AnimatedTag;
  children: string;
  mode?: "words" | "lines" | "chars";
  stagger?: number;
  delay?: number;
  className?: string;
};

const WORD_STAGGER_MS = 24;
const PARAGRAPH_STAGGER_MS = 12;

function splitText(text: string, mode: NonNullable<AnimatedTextProps["mode"]>) {
  if (mode === "lines") return text.split("\n");
  if (mode === "chars") return Array.from(text);
  return text.split(/(\s+)/).filter(Boolean);
}

export function AnimatedText({
  as = "span",
  children,
  mode = "words",
  stagger,
  delay = 0,
  className = "",
}: AnimatedTextProps) {
  const ref = useScrollReveal<HTMLElement>();
  const units = splitText(children, mode);
  const staggerMs = stagger === undefined
    ? as === "p" ? PARAGRAPH_STAGGER_MS : WORD_STAGGER_MS
    : stagger * 1000;

  return createElement(
    as,
    {
      ref,
      "data-text-reveal": true,
      "aria-label": children,
      className: `block ${className}`.trim(),
      style: { display: "block" },
    },
    units.map((unit, index) => {
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
          data-text-unit
          className={mode === "lines" ? "block overflow-hidden" : "inline-block overflow-hidden"}
          style={{
            paddingBottom: "0.12em",
            marginBottom: "-0.12em",
            animationDelay: `${delay * 1000 + index * staggerMs}ms`,
          }}
        >
          <span>{unit}</span>
        </span>
      );
    }),
  );
}
