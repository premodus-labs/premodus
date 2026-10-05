"use client";

import { useSyncExternalStore } from "react";
import { MOTION_QUERY } from "@/lib/design/motion";

function subscribe(onChange: () => void) {
  const mediaQuery = window.matchMedia(MOTION_QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOTION_QUERY).matches,
    () => true,
  );
}
