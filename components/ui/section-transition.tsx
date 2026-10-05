"use client";

import { useScrollReveal } from "@/components/ui/use-scroll-reveal";

type SectionTransitionProps = {
  children?: React.ReactNode;
  className?: string;
  animateOnView?: boolean;
};

export function SectionTransition({
  children,
  className,
  animateOnView = true,
}: SectionTransitionProps) {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={animateOnView ? ref : undefined}
      data-section-transition
      data-scroll-reveal={animateOnView || undefined}
      className={className}
    >
      {children}
    </section>
  );
}
