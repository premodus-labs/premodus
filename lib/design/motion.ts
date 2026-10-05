/** Shared Motion timings and scroll-driven model tuning. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.24,
  base: 0.4,
  slow: 0.8,
} as const;

export const TEXT_STAGGER = 0.04;

export const MOTION = {
  modelScrollStiffness: 80,
  modelScrollDamping: 24,
  modelScrollMass: 0.6,
  modelPartStagger: 0.35,
  modelPartAssemblyWindow: 0.65,
} as const;

export const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
