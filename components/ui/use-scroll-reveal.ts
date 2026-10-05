"use client";

import { useCallback, useRef, type RefCallback } from "react";
import { MOTION_QUERY } from "@/lib/design/motion";

export function useScrollReveal<T extends HTMLElement>(): RefCallback<T> {
  const observerRef = useRef<IntersectionObserver | null>(null);

  return useCallback<RefCallback<T>>((element) => {
    observerRef.current?.disconnect();
    observerRef.current = null;

    if (!element) return;

    const revealImmediately = () => {
      element.dataset.motionReady = "true";
      element.dataset.inView = "true";
    };

    if (
      window.matchMedia(MOTION_QUERY).matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      revealImmediately();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        element.dataset.motionReady = "true";
        if (!entry?.isIntersecting) return;

        window.requestAnimationFrame(() => {
          if (element.isConnected) element.dataset.inView = "true";
        });
        observer.unobserve(element);
      },
      { threshold: 0.01, rootMargin: "0px 0px -5% 0px" },
    );

    observerRef.current = observer;
    observer.observe(element);

    return () => {
      observer.disconnect();
      if (observerRef.current === observer) observerRef.current = null;
    };
  }, []);
}
