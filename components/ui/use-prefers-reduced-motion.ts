"use client";

import { useSyncExternalStore } from "react";
import { MOTION_QUERY } from "@/lib/design/motion";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOTION_QUERY).matches,
    () => false,
  );
}
