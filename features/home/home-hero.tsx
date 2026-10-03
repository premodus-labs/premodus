"use client";

import { motion } from "motion/react";
import { ButtonLink } from "@/components/ui/button";
import { SectionTransition } from "@/components/ui/section-transition";
import { Text } from "@/components/ui/text";
import {
  useIsHydrated,
  usePrefersReducedMotion,
} from "@/components/ui/use-prefers-reduced-motion";
import { DURATION, EASE, MOTION } from "@/lib/design/motion";

export function HomeHero() {
  const isHydrated = useIsHydrated();
  const prefersReducedMotion = usePrefersReducedMotion();
  const animate = isHydrated && !prefersReducedMotion;

  return (
    <SectionTransition
      animateOnView={false}
      className="section-panel px-page py-section text-center"
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
        <motion.div
          key={animate ? "animated-heading" : "static-heading"}
          initial={animate ? { opacity: 0, y: MOTION.heroY } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: animate ? DURATION.base : 0,
            ease: EASE,
          }}
        >
          <Text as="h1" variant="h2">
            World-class technology for Malawi’s overlooked problems.
          </Text>
        </motion.div>
        <motion.div
          key={animate ? "animated-action" : "static-action"}
          initial={animate ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: animate ? DURATION.fast : 0,
            delay: animate ? DURATION.base : 0,
            ease: EASE,
          }}
        >
          <ButtonLink href="/contact">Get in touch</ButtonLink>
        </motion.div>
      </div>
    </SectionTransition>
  );
}
