"use client";

import { useEffect, useState } from "react";
import { MOTION_QUERY } from "@/lib/design/motion";

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOTION_QUERY);
    const onChange = () => setPrefersReducedMotion(mediaQuery.matches);
    onChange();
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return prefersReducedMotion;
}
