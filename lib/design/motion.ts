/**
 * Shared motion timings. Anime.js v4 easings are named strings
 * (`outExpo`, `outCubic`). Keep durations in milliseconds.
 */
export const motion = {
  easeOut: "outExpo",
  easeIn: "inCubic",
  easeOutSoft: "outCubic",
  revealMs: 800,
  revealY: 32,
  /** Start the reveal once ~15% of the element has entered the viewport. */
  /** Start when the element's top reaches 85% of the viewport. */
  revealEnter: "top 85%",
  staggerMs: 120,
  heroHeadingMs: 700,
  heroButtonMs: 520,
  heroY: 24,
  imageScaleFrom: 1.06,
  /** Track height / sticky stage per service. */
  serviceViewport: "100svh",
  serviceFadeMs: 420,
  serviceHoldMs: 900,
  serviceY: 28,
  serviceScaleFrom: 0.97,
  /** Artwork parallax as a percentage of the image box. */
  parallaxY: "5%",
} as const;

export const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
