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
  fullWidthButtonOnMobile?: boolean;
};

export function CallToAction({
  title,
  description,
  secondaryHref,
  secondaryLabel,
  animateOnView = true,
  variant = "default",
  fullWidthButtonOnMobile = false,
}: CallToActionProps) {
  const inverse = variant === "inverse";
  const sectionClass = inverse ? "bg-surface text-inverse" : "";
  const headingClass = inverse ? "!text-inverse" : "";
  const bodyClass = inverse ? "!text-inverse/75" : "";
  const buttonClass = inverse ? "!bg-inverse !text-surface" : "";
  const contentWidthClass = fullWidthButtonOnMobile ? "w-full" : "";
  const actionsClass = fullWidthButtonOnMobile
    ? "flex w-full flex-col items-center justify-center gap-4 lg:flex-row"
    : "flex flex-wrap items-center justify-center gap-4";
  const fullWidthButtonClass = fullWidthButtonOnMobile ? "w-full lg:w-auto" : "";
  const sectionPaddingClass = fullWidthButtonOnMobile
    ? "px-5 md:px-page"
    : "px-page";
  const secondaryClass = inverse
    ? "text-inverse hover:text-inverse/75"
    : "text-ink-strong hover:text-ink-medium";

  if (!animateOnView) {
    return (
      <section className={`section-panel ${sectionPaddingClass} py-section text-center ${sectionClass}`}>
        <div className={`mx-auto flex ${contentWidthClass} max-w-xl flex-col items-center gap-6`}>
          <Text as="h2" variant="h2" animate={false} className={headingClass}>
            {title}
          </Text>
          <Text variant="body" animate={false} className={bodyClass}>
            {description}
          </Text>
          <div className={actionsClass}>
            <ButtonLink href="/contact" className={`${buttonClass} ${fullWidthButtonClass}`}>
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
    <SectionTransition className={`section-panel ${sectionPaddingClass} py-section text-center ${sectionClass}`}>
      <div className={`mx-auto flex ${contentWidthClass} max-w-xl flex-col items-center gap-6`}>
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
        <ScrollReveal
          delay={0.24}
          className={fullWidthButtonOnMobile ? "w-full" : undefined}
        >
          <div className={actionsClass}>
            <ButtonLink href="/contact" className={`${buttonClass} ${fullWidthButtonClass}`}>
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
