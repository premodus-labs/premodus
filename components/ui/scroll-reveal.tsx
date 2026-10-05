"use client";

import { createElement, type CSSProperties, type ReactNode } from "react";
import { useScrollReveal } from "@/components/ui/use-scroll-reveal";

type RevealTag = "article" | "div" | "h1" | "h2" | "h3" | "h4" | "p" | "span";

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
  const ref = useScrollReveal<HTMLElement>();

  return createElement(
    as,
    {
      ref,
      "data-scroll-reveal": true,
      className: `${as === "span" ? "inline-block" : ""} ${className ?? ""}`.trim(),
      style: { "--reveal-delay": `${delay}s` } as CSSProperties,
    },
    children,
  );
}
