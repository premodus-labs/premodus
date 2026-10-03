"use client";

import { useSyncExternalStore } from "react";
import { MOTION_QUERY } from "@/lib/design/motion";

function subscribeToHydration() {
  return () => {};
}

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function useIsHydrated() {
  return useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
}

/**
 * SSR snapshot must be `true` (prefer reduced motion).
 * That keeps server HTML fully visible so a client with reduced motion
 * never hydrates into opacity:0 / translateY stuck states.
 * Clients that allow motion re-render and enable whileInView afterwards.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOTION_QUERY).matches,
    () => true,
  );
}
