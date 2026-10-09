"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion } from "motion/react";
import { site, siteNav } from "@/lib/constants/navigation";
import { DURATION, EASE } from "@/lib/design/motion";
import { usePrefersReducedMotion } from "@/components/ui/use-prefers-reduced-motion";

const SCROLL_THRESHOLD = 48;
const CLOSE_DELAY_MS = 220;

function isActive(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

/** Slides its children between their natural width and zero. */
function Collapsible({
  show,
  as: Tag = "div",
  prefersReducedMotion,
  children,
}: {
  show: boolean;
  as?: "div" | "li";
  prefersReducedMotion: boolean;
  children: ReactNode;
}) {
  const Component = Tag === "li" ? motion.li : motion.div;

  return (
    <Component
      initial={false}
      animate={{
        gridTemplateColumns: show ? "1fr" : "0fr",
        opacity: show ? 1 : 0,
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : DURATION.base,
        ease: EASE,
      }}
      style={{ display: "grid" }}
    >
      <div style={{ minWidth: 0, overflow: "hidden" }}>{children}</div>
    </Component>
  );
}

export function SiteHeader() {
  const pathname = usePathname() as string;
  const pillRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrolledRef = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false); // pointer over the bar
  const [focused, setFocused] = useState(false); // keyboard focus inside the bar

  const keepExpanded = pathname === "/about" || pathname.startsWith("/about/");

  useEffect(() => {
    if (keepExpanded) return;

    const updateScrollState = () => {
      const nextScrolled = window.scrollY > SCROLL_THRESHOLD;
      if (scrolledRef.current === nextScrolled) return;
      scrolledRef.current = nextScrolled;
      setScrolled(nextScrolled);
      if (nextScrolled) setHovered(false);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, [keepExpanded]);

  const expanded = keepExpanded || !scrolled || hovered || focused;

  // Tapping outside closes the bar (touch screens have no "hover out")
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!pillRef.current?.contains(event.target as Node)) setHovered(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const open = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setHovered(true);
  };

  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setHovered(false), CLOSE_DELAY_MS);
  };

  // On the home page there's no matching nav item, so a "Home" label stands in.
  // It only appears while collapsed, so the expanded bar matches the other pages.
  const items =
    pathname === "/"
      ? [{ href: "/", label: "Home" }, ...siteNav]
      : siteNav;

  return (
    // Sticky wrapper is click-through; only the bar itself catches pointer events.
    <header className="pointer-events-none sticky top-0 z-50 px-page pt-header-t pb-header-b">
      <motion.div
        ref={pillRef}
        initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : DURATION.base,
          ease: EASE,
        }}
        onPointerEnter={open}
        onPointerMove={(e) => {
          if (e.pointerType !== "touch") open();
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== "touch") closeSoon();
        }}
        onFocus={(e) => {
          // Only keyboard focus keeps it open. A mouse click leaves focus on the
          // clicked link, which would otherwise pin the bar open forever.
          let keyboard = true;
          try {
            keyboard = e.target.matches(":focus-visible");
          } catch {
            /* very old browsers: treat as keyboard focus */
          }
          if (keyboard) setFocused(true);
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
        }}
        className="site-header-enter pointer-events-auto mx-auto flex h-10 w-fit max-w-full items-center rounded-xl bg-surface px-1.5 text-inverse shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
      >
        {/* Logo: collapses away too */}
        <Collapsible show={expanded} prefersReducedMotion={prefersReducedMotion}>
          <Link
            href="/"
            aria-label={site.name}
            className="flex h-7 items-center rounded-lg px-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span className="block size-4 rounded-[4px] bg-inverse" />
          </Link>
        </Collapsible>

        <nav aria-label="Primary">
          <ul className="flex items-center">
            {items.map((item) => {
              const active = isActive(pathname, item.href);
              const isHomeLabel = item.href === "/" && item.label === "Home";
              const show = isHomeLabel ? !expanded : expanded || active;

              return (
                <Collapsible
                  key={item.href}
                  as="li"
                  show={show}
                  prefersReducedMotion={prefersReducedMotion}
                >
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    tabIndex={show ? undefined : -1}
                    className={`relative block whitespace-nowrap rounded-lg px-2 py-1 text-tiny text-inverse transition-[background-color,color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                      active ? "bg-white/15" : "hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                    {active ? (
                      <motion.span
                        layoutId="primary-nav-active"
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-2 bottom-0 h-px bg-inverse"
                        transition={{
                          duration: prefersReducedMotion ? 0 : DURATION.fast,
                          ease: EASE,
                        }}
                      />
                    ) : null}
                  </Link>
                </Collapsible>
              );
            })}
          </ul>
        </nav>
      </motion.div>
    </header>
  );
}