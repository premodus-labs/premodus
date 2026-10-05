"use client";

import { ButtonLink } from "@/components/ui/button";
import { SectionTransition } from "@/components/ui/section-transition";
import { Text } from "@/components/ui/text";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/components/ui/use-prefers-reduced-motion";
import { DURATION, EASE } from "@/lib/design/motion";

export function HomeHero() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <SectionTransition
      animateOnView={false}
      className="section-panel px-page py-section text-center"
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
        <div>
          <Text as="h1" variant="h2">
            World-class technology for Malawi’s overlooked problems.
          </Text>
        </div>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : DURATION.fast,
            delay: prefersReducedMotion ? 0 : DURATION.base,
            ease: EASE,
          }}
        >
          <ButtonLink href="/contact">Get in touch</ButtonLink>
        </motion.div>
      </div>
    </SectionTransition>
  );
}
