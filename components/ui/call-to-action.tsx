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
  variant?: "default" | "inverse";
};

export function CallToAction({
  title,
  description,
  secondaryHref,
  secondaryLabel,
  animateOnView = true,
  variant = "default",
}: CallToActionProps) {
  const inverse = variant === "inverse";
  const sectionClass = inverse ? "bg-surface text-inverse" : "";
  const headingClass = inverse ? "!text-inverse" : "";
  const bodyClass = inverse ? "!text-inverse/75" : "";
  const buttonClass = inverse ? "!bg-inverse !text-surface" : "";
  const secondaryClass = inverse
    ? "text-inverse hover:text-inverse/75"
    : "text-ink-strong hover:text-ink-medium";

  if (!animateOnView) {
    return (
      <section className={`section-panel px-page py-section text-center ${sectionClass}`}>
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
          <Text as="h2" variant="h2" animate={false} className={headingClass}>
            {title}
          </Text>
          <Text variant="body" animate={false} className={bodyClass}>
            {description}
          </Text>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="/contact" className={buttonClass}>
              Get in touch
            </ButtonLink>
            {secondaryHref && secondaryLabel ? (
              <Link
                href={secondaryHref}
                className={`text-body-bold ${secondaryClass} underline underline-offset-4 transition-colors duration-200`}
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
    <SectionTransition className={`section-panel px-page py-section text-center ${sectionClass}`}>
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
        <ScrollReveal>
          <Text as="h2" variant="h2" className={headingClass}>
            {title}
          </Text>
        </ScrollReveal>
        <ScrollReveal delay={0.12}>
          <Text variant="body" className={bodyClass}>
            {description}
          </Text>
        </ScrollReveal>
        <ScrollReveal delay={0.24}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="/contact" className={buttonClass}>
              Get in touch
            </ButtonLink>
            {secondaryHref && secondaryLabel ? (
              <Link
                href={secondaryHref}
                className={`text-body-bold ${secondaryClass} underline underline-offset-4 transition-colors duration-200`}
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
