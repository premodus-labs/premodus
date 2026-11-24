"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { usePrefersReducedMotion } from "@/components/ui/use-prefers-reduced-motion";
import { site, siteNav } from "@/lib/constants/navigation";

const MOBILE_VIEWPORT = "(max-width: 767px)";

function subscribeToMobileViewport(onChange: () => void) {
  const mediaQuery = window.matchMedia(MOBILE_VIEWPORT);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getIsMobileViewport() {
  return window.matchMedia(MOBILE_VIEWPORT).matches;
}

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroOutOfView, setHeroOutOfView] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const mobileViewport = useSyncExternalStore(
    subscribeToMobileViewport,
    getIsMobileViewport,
    () => false,
  );
  const mobileHomeHeader = animatedHomeHeader && mobileViewport;
  const animateHomeColors = animatedHomeHeader && !mobileViewport;
  const headerInverse = inverse || (mobileHomeHeader && heroOutOfView);
  const { scrollY } = useScroll();
  const items = [
    siteNav[0],
    siteNav[1],
    siteNav[2],
    siteNav[3],
  ];

  useEffect(() => {
    if (!mobileHomeHeader) return;

    const heroVisual = document.querySelector("[data-home-hero-visual]");
    if (!heroVisual) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry) {
        setHeroOutOfView(
          entry.boundingClientRect.top < 0 && entry.intersectionRatio < 0.5,
        );
      }
    }, { threshold: [0.5] });
    observer.observe(heroVisual);
    return () => observer.disconnect();
  }, [mobileHomeHeader]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (previous === undefined) return;
    const direction = latest - previous;

    if (latest < 80 || direction < -8) {
      setHidden(false);
    } else if ((!animatedHomeHeader || mobileHomeHeader) && direction > 8) {
      setHidden(true);
    } else if (animatedHomeHeader && !mobileHomeHeader) {
      const servicesProgress = Number.parseFloat(
        document.documentElement.style.getPropertyValue(
          "--home-services-progress",
        ),
      );

      if (direction > 8 && servicesProgress > 0) {
        setHidden(true);
      }
    }
  });

  const shouldHide = hidden && !menuOpen;

  return (
    <motion.header
      data-home-hero-header={animatedHomeHeader ? "" : undefined}
      className={`sticky top-0 z-50 h-[60px] transition-colors duration-200 ${
        headerInverse
          ? "bg-surface text-inverse"
          : "bg-canvas text-ink-strong"
      }`}
      style={
        animateHomeColors
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
            headerInverse ? "focus-visible:outline-inverse" : "focus-visible:outline-ink-strong"
          }`}
        >
          {animateHomeColors ? (
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
              src={headerInverse ? "/brand/premodus-logo-paper.svg" : "/brand/premodus-logo-ink.svg"}
              alt={site.name}
              width={177}
              height={16}
              className="h-4 w-[177px] shrink-0 object-contain"
            />
          )}
        </Link>
        <button
          type="button"
          className={`rounded px-2 py-2 text-small md:hidden ${
            headerInverse ? "text-inverse" : "text-ink-strong"
          }`}
          aria-expanded={menuOpen}
          aria-controls="mobile-primary-navigation"
          onClick={() =>
            setMenuOpen((open) => {
              if (!open) setHidden(false);
              return !open;
            })
          }
          style={
            animateHomeColors
              ? {
                  color:
                    "color-mix(in srgb, var(--ink-weak), var(--inverse) var(--home-hero-ink-progress, 0%))",
                }
              : undefined
          }
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
        <nav className="hidden md:block" aria-label="Primary">
          <ul className="flex h-full items-center gap-4 md:gap-8 lg:gap-20">
            {items.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`block whitespace-nowrap px-2 py-2 text-body-medium ${
                      headerInverse ? "text-inverse/75" : "text-ink-weak"
                    } focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      headerInverse ? "focus-visible:outline-inverse" : "focus-visible:outline-ink-strong"
                    } md:px-0`}
                    style={
                      animateHomeColors
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
      {menuOpen ? (
        <nav
          id="mobile-primary-navigation"
          aria-label="Primary"
          className="absolute inset-x-0 top-full border-t border-rule/25 px-4 pb-4 shadow-lg md:hidden"
          style={{
            backgroundColor: animateHomeColors
              ? "color-mix(in srgb, var(--canvas), var(--surface) var(--home-hero-ink-progress, 0%))"
              : headerInverse
                ? "var(--surface)"
                : "var(--canvas)",
          }}
        >
          <ul className="flex flex-col">
            {items.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`block border-b border-rule/25 py-3 text-body-medium ${
                      headerInverse ? "text-inverse/75" : "text-ink-weak"
                    }`}
                    style={
                      animateHomeColors
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
      ) : null}
    </motion.header>
  );
}
