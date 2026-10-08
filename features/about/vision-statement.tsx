"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { usePrefersReducedMotion } from "@/components/ui/use-prefers-reduced-motion";

type WordProps = {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
};

function Word({ word, progress, range }: WordProps) {
  const opacity = useTransform(progress, range, [0.15, 1]);

  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

type VisionStatementProps = {
  label: string;
  statement: string;
};

/**
 * The page's only scroll-linked treatment. It is intentionally isolated so
 * static sections do not add scroll work to the client.
 */
export function VisionStatement({ label, statement }: VisionStatementProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const words = statement.split(" ");

  if (prefersReducedMotion) {
    return (
      <section className="px-page py-section" aria-labelledby="vision-label">
        <div className="mx-auto max-w-7xl">
          <p id="vision-label" className="text-small-bold text-ink-strong">
            {label}
          </p>
          <p className="mt-4 max-w-5xl text-heading-2 text-ink-strong">
            {statement}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-[240svh]"
      aria-labelledby="vision-label"
    >
      <div className="sticky top-0 flex h-svh items-center px-page">
        <div className="mx-auto w-full max-w-7xl">
          <p id="vision-label" className="text-small-bold text-ink-strong">
            {label}
          </p>
          <p
            className="mt-4 max-w-5xl text-heading-2 text-ink-strong"
            aria-label={statement}
          >
            {words.map((word, index) => {
              const start = 0.08 + (index / words.length) * 0.7;
              const end = Math.min(start + 0.14, 0.92);

              return (
                <Word
                  key={`${word}-${index}`}
                  word={word}
                  progress={scrollYProgress}
                  range={[start, end]}
                />
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
