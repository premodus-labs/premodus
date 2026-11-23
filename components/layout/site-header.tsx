"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { usePrefersReducedMotion } from "@/components/ui/use-prefers-reduced-motion";
import { site, siteNav } from "@/lib/constants/navigation";

function isActive(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({
  variant = "default",
}: {
  variant?: "default" | "inverse";
}) {
  const pathname = usePathname() as string;
  const inverse = variant === "inverse";
  const animatedHomeHeader = pathname === "/" && !inverse;
  const [hidden, setHidden] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollY } = useScroll();
  const items = [
    siteNav[0],
    siteNav[1],
    siteNav[2],
    siteNav[3],
  ];

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!animatedHomeHeader) {
      setHidden(false);
      return;
    }

    const previous = scrollY.getPrevious();
    if (previous === undefined) return;
    const direction = latest - previous;
    const servicesProgress = Number.parseFloat(
      document.documentElement.style.getPropertyValue(
        "--home-services-progress",
      ),
    );

    if (latest < 80 || direction < -8) {
      setHidden(false);
    } else if (direction > 8 && servicesProgress > 0) {
      setHidden(true);
    }
  });

  const shouldHide = animatedHomeHeader && hidden;

  return (
    <motion.header
      data-home-hero-header={animatedHomeHeader ? "" : undefined}
      className={`sticky top-0 z-50 h-[60px] ${
        inverse
          ? "bg-surface text-inverse"
          : "bg-canvas text-ink-strong"
      }`}
      style={
        animatedHomeHeader
          ? {
              backgroundColor:
                "color-mix(in srgb, var(--canvas), var(--surface) var(--home-hero-ink-progress, 0%))",
            }
          : undefined
      }
      animate={{ y: shouldHide ? "-100%" : "0%" }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: "easeOut" }}
      onFocusCapture={() => setHidden(false)}
    >
      <div className="mx-auto flex h-full w-full items-center justify-between px-4 md:px-[80px]">
        <Link
          href="/"
          aria-label={site.name}
          className={`flex h-full items-center focus-visible:outline-2 focus-visible:outline-offset-[-2px] ${
            inverse ? "focus-visible:outline-inverse" : "focus-visible:outline-ink-strong"
          }`}
        >
          {animatedHomeHeader ? (
            <span className="relative block h-4 w-[177px] shrink-0">
              <Image
                src="/brand/premodus-logo-ink.svg"
                alt={site.name}
                width={177}
                height={16}
                className="absolute inset-0 h-4 w-[177px] object-contain"
                style={{ opacity: "var(--home-hero-ink-logo-opacity, 1)" }}
              />
              <Image
                src="/brand/premodus-logo-paper.svg"
                alt=""
                aria-hidden="true"
                width={177}
                height={16}
                className="absolute inset-0 h-4 w-[177px] object-contain"
                style={{ opacity: "var(--home-hero-paper-logo-opacity, 0)" }}
              />
            </span>
          ) : (
            <Image
              src={inverse ? "/brand/premodus-logo-paper.svg" : "/brand/premodus-logo-ink.svg"}
              alt={site.name}
              width={177}
              height={16}
              className="h-4 w-[177px] shrink-0 object-contain"
            />
          )}
        </Link>
        <nav aria-label="Primary">
          <ul className="flex h-full items-center gap-4 md:gap-20">
            {items.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`block whitespace-nowrap px-2 py-2 text-body-medium ${
                      inverse ? "text-inverse/75" : "text-ink-weak"
                    } focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      inverse ? "focus-visible:outline-inverse" : "focus-visible:outline-ink-strong"
                    } md:px-0`}
                    style={
                      animatedHomeHeader
                        ? {
                            color:
                              "color-mix(in srgb, var(--ink-weak), var(--inverse) var(--home-hero-ink-progress, 0%))",
                          }
                        : undefined
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </motion.header>
  );
}
