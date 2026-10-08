/**
 * Premodus Labs design tokens.
 * Canonical values from the Figma spec (`Premodus Labs/`).
 * Keep `app/globals.css` in sync with this file.
 */

export const colors = {
  ink: {
    strong: "#000000",
    medium: "rgb(0 0 0 / 0.75)",
    weak: "rgb(0 0 0 / 0.6)",
  },
  canvas: "#ffffff",
  surface: "#000000",
  inverse: "#ffffff",
  accentPink: "#F4C4D0",
} as const;

export const font = {
  family: "Space Grotesk",
  weight: {
    regular: 400,
    medium: 500,
  },
} as const;

/** Type scale — size in px, weight matches Figma exactly. */
export const type = {
  display: { size: 48, weight: 500 },
  heading1: { size: 40, weight: 500 },
  heading2: { size: 32, weight: 500 },
  heading3: { size: 24, weight: 500 },
  heading4: { size: 20, weight: 500 },
  body: { size: 16, weight: 400 },
  bodyBold: { size: 16, weight: 500 },
  small: { size: 14, weight: 400 },
  smallBold: { size: 14, weight: 500 },
  tiny: { size: 12, weight: 400 },
  /** Figma: "Tiny bold — 12px, regular" */
  tinyBold: { size: 12, weight: 400 },
} as const;

export const space = {
  /** Between sections */
  section: 180,
  /** Between major elements within a section */
  major: 60,
  /** Page left/right margin; 12-column gutter */
  page: 40,
  headerTop: 24,
  headerBottom: 60,
  footerY: 120,
  columnCount: 12,
  columnGap: 40,
  /** Default increment when a Figma value is not listed */
  unit: 4,
} as const;
