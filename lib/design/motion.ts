/** Shared motion timings. */
export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_CSS = "cubic-bezier(0.22, 1, 0.36, 1)";

export const DURATION = {
  fast: 0.24,
  base: 0.4,
  slow: 0.8,
} as const;

export const TEXT_STAGGER = 0.04;

export const MOTION = {
  revealMs: 800,
  revealY: 32,
  /** Start the reveal once ~15% of the element has entered the viewport. */
  /** Start when the element's top reaches 85% of the viewport. */
  revealEnter: "top 85%",
  staggerMs: 120,
  heroY: 24,
  imageScaleFrom: 1.06,
  /** Track height / sticky stage per service. */
  serviceViewport: "100svh",
  serviceFadeMs: 420,
  serviceHoldMs: 2400,
  modelScrollStiffness: 80,
  modelScrollDamping: 24,
  modelScrollMass: 0.6,
  modelHoldStart: 0.15,
  modelAssemblyEnd: 0.85,
  modelPartStagger: 0.04,
  serviceY: 28,
  serviceScaleFrom: 0.97,
  /** Artwork parallax as a percentage of the image box. */
  parallaxY: "5%",
} as const;

export const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
