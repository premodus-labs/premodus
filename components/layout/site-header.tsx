"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useRef, useState, useSyncExternalStore, useEffect, type ReactNode } from "react";
import { site, siteNav } from "@/lib/constants/navigation";
import { DURATION, EASE, EASE_CSS, MOTION_QUERY } from "@/lib/design/motion";

// Pixels scrolled before the nav collapses (re-expands when you return to the top)
const SCROLL_THRESHOLD = 48;
// Grace period before the bar closes after the cursor leaves it
const CLOSE_DELAY_MS = 220;
/* -------------------------------------------------------------------------- */
/* Scroll state                                                               */
/* Works whether the page scrolls on the window OR inside a big container.    */
/* Scroll events don't bubble, so we listen in the capture phase.             */
/* -------------------------------------------------------------------------- */

const scrolledContainers = new Set<Element>();

function getScrolled() {
  if (window.scrollY > SCROLL_THRESHOLD) return true;
  for (const el of scrolledContainers) {
    if (!el.isConnected) scrolledContainers.delete(el);
  }
  return scrolledContainers.size > 0;
}

function subscribeToScroll(onChange: () => void) {
  const onScroll = (event: Event) => {
    const target = event.target;
    // only track big scrollers (app shell, <main>, body), not carousels / code blocks
    if (target instanceof Element && target.clientHeight >= window.innerHeight * 0.3) {
      if (target.scrollTop > SCROLL_THRESHOLD) scrolledContainers.add(target);
      else scrolledContainers.delete(target);
    }
    onChange();
  };
  document.addEventListener("scroll", onScroll, { capture: true, passive: true });
  return () => document.removeEventListener("scroll", onScroll, { capture: true });
}

function subscribeToMotion(onChange: () => void) {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/* -------------------------------------------------------------------------- */

function isActive(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

/** Slides its children between their natural width and zero. */
function Collapsible({
  show,
  as: Tag = "div",
  animate,
  children,
}: {
  show: boolean;
  as?: "div" | "li";
  animate: boolean;
  children: ReactNode;
}) {
  return (
    <Tag
      style={{
        display: "grid",
        gridTemplateColumns: show ? "1fr" : "0fr",
        opacity: show ? 1 : 0,
        transition: animate
          ? `grid-template-columns ${DURATION.base * 1000}ms ${EASE_CSS}, opacity ${DURATION.fast * 1000}ms ease`
          : "none",
      }}
    >
      <div style={{ minWidth: 0, overflow: "hidden" }}>{children}</div>
    </Tag>
  );
}

export function SiteHeader() {
  const pathname = usePathname() as string;
  const pillRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrolled = useSyncExternalStore(subscribeToScroll, getScrolled, () => false);
  const animate = useSyncExternalStore(
    subscribeToMotion,
    () => !window.matchMedia(MOTION_QUERY).matches,
    // SSR: assume reduced motion so the pill stays visible in HTML.
    () => false,
  );

  const [hovered, setHovered] = useState(false); // pointer over the bar
  const [focused, setFocused] = useState(false); // keyboard focus inside the bar

  // The moment scrolling starts, let go of "hovered" so the bar collapses
  // even if the cursor is parked on it. Moving the mouse re-opens it.
  const [prevScrolled, setPrevScrolled] = useState(scrolled);
  if (scrolled !== prevScrolled) {
    setPrevScrolled(scrolled);
    if (scrolled) setHovered(false);
  }

  const expanded = !scrolled || hovered || focused;

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
        key={animate ? "animated-header" : "static-header"}
        ref={pillRef}
        initial={animate ? { opacity: 0, y: -8 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: animate ? DURATION.base : 0, ease: EASE }}
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
        className="pointer-events-auto mx-auto flex h-10 w-fit max-w-full items-center rounded-xl bg-surface px-1.5 text-inverse shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
      >
        {/* Logo: collapses away too */}
        <Collapsible show={expanded} animate={animate}>
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
                <Collapsible key={item.href} as="li" show={show} animate={animate}>
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
                          duration: animate ? DURATION.fast : 0,
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