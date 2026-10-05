import type { ComponentPropsWithoutRef, ElementType } from "react";
import { AnimatedText, type AnimatedTag } from "@/components/ui/animated-text";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

type TextTag = "div" | "h1" | "h2" | "h3" | "h4" | "p" | "span";

const variants = {
  display: "text-display text-ink-strong",
  h1: "text-heading-1 text-ink-strong",
  h2: "text-heading-2 text-ink-strong",
  h3: "text-heading-3 text-ink-strong",
  h4: "text-heading-4 text-ink-strong",
  body: "text-body text-ink-medium",
  "body-bold": "text-body-bold text-ink-strong",
  small: "text-small text-ink-medium",
  "small-bold": "text-small-bold text-ink-strong",
  tiny: "text-tiny text-ink-weak",
  "tiny-bold": "text-tiny-bold text-ink-weak",
} as const;

type Variant = keyof typeof variants;

const defaultElements: Record<Variant, ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body: "p",
  "body-bold": "p",
  small: "p",
  "small-bold": "p",
  tiny: "span",
  "tiny-bold": "span",
};

type TextProps<T extends ElementType> = {
  as?: T;
  variant?: Variant;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "variant" | "className">;

export function Text<T extends ElementType = "p">({
  as,
  variant = "body",
  className = "",
  children,
  ...props
}: TextProps<T>) {
  const Component = as ?? defaultElements[variant];
  const combinedClassName = `${variants[variant]} ${className}`.trim();

  if (
    typeof Component === "string" &&
    isAnimatedTag(Component) &&
    typeof children === "string"
  ) {
    return (
      <AnimatedText
        as={Component}
        className={combinedClassName}
      >
        {children}
      </AnimatedText>
    );
  }

  if (typeof Component === "string" && isTextTag(Component)) {
    return (
      <ScrollReveal
        as={Component}
        className={`${variants[variant]} ${className}`.trim()}
      >
        {children}
      </ScrollReveal>
    );
  }

  return (
    <Component className={combinedClassName} {...props}>
      {children}
    </Component>
  );
}

function isAnimatedTag(tag: string): tag is AnimatedTag {
  return (
    tag === "h1" ||
    tag === "h2" ||
    tag === "h3" ||
    tag === "h4" ||
    tag === "p"
  );
}

function isTextTag(tag: string): tag is TextTag {
  return (
    tag === "div" ||
    tag === "h1" ||
    tag === "h2" ||
    tag === "h3" ||
    tag === "h4" ||
    tag === "p" ||
    tag === "span"
  );
}
