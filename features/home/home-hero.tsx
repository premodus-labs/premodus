"use client";

import { ButtonLink } from "@/components/ui/button";
import { SectionTransition } from "@/components/ui/section-transition";
import { Text } from "@/components/ui/text";

export function HomeHero() {
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
        <div className="hero-action-enter">
          <ButtonLink href="/contact">Get in touch</ButtonLink>
        </div>
      </div>
    </SectionTransition>
  );
}
