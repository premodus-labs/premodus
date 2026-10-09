import Link from "next/link";
import { ButtonLink } from "./button";
import { ScrollReveal } from "./scroll-reveal";
import { SectionTransition } from "./section-transition";
import { Text } from "./text";

type CallToActionProps = {
  title: string;
  description: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  animateOnView?: boolean;
};

export function CallToAction({
  title,
  description,
  secondaryHref,
  secondaryLabel,
  animateOnView = true,
}: CallToActionProps) {
  if (!animateOnView) {
    return (
      <section className="section-panel px-page py-section text-center">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
          <Text as="h2" variant="h2" animate={false}>
            {title}
          </Text>
          <Text variant="body" animate={false}>
            {description}
          </Text>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="/contact">Get in touch</ButtonLink>
            {secondaryHref && secondaryLabel ? (
              <Link
                href={secondaryHref}
                className="text-body-bold text-ink-strong underline underline-offset-4 transition-colors duration-200 hover:text-ink-medium"
              >
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <SectionTransition className="section-panel px-page py-section text-center">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
        <ScrollReveal>
          <Text as="h2" variant="h2">
            {title}
          </Text>
        </ScrollReveal>
        <ScrollReveal delay={0.12}>
          <Text variant="body">{description}</Text>
        </ScrollReveal>
        <ScrollReveal delay={0.24}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="/contact">Get in touch</ButtonLink>
            {secondaryHref && secondaryLabel ? (
              <Link
                href={secondaryHref}
                className="text-body-bold text-ink-strong underline underline-offset-4 transition-colors duration-200 hover:text-ink-medium"
              >
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </ScrollReveal>
      </div>
    </SectionTransition>
  );
}
