"use client";

import { motion as fm } from "motion/react";
import { ButtonLink } from "@/components/ui/button";
import { SectionTransition } from "@/components/ui/section-transition";
import { Text } from "@/components/ui/text";
import { usePrefersReducedMotion } from "@/components/ui/use-prefers-reduced-motion";
import { motion } from "@/lib/design/motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function HomeHero() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <SectionTransition
      className="section-panel px-page py-section text-center"
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
        <fm.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: motion.heroY }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : motion.heroHeadingMs / 1000,
            ease,
          }}
        >
          <Text as="h1" variant="h2">
            World-class technology for Malawi’s overlooked problems.
          </Text>
        </fm.div>
        <fm.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : motion.heroButtonMs / 1000,
            delay: prefersReducedMotion ? 0 : motion.heroHeadingMs / 1000,
            ease,
          }}
        >
          <ButtonLink href="/contact">Get in touch</ButtonLink>
        </fm.div>
      </div>
    </SectionTransition>
  );
}
