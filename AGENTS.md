<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project structure (isolation first)

Code is split so a change in one product surface does not leak into another. Follow this map; do not invent parallel trees.

| Layer | Path | Owns | Must not |
| --- | --- | --- | --- |
| Routes | `app/` | URL segments, `page`/`layout`/`route`, metadata. Thin composition only. | Business logic, styled sections, data access, feature internals. |
| Features | `features/<name>/` | One product surface (UI, data hooks, types, copy). Insights/blog lives here. | Import from another feature. |
| Shared UI | `components/` | Primitives (`components/ui`) and site chrome (`components/layout`). | Know about a specific feature. Import from `features/`. |
| Shared lib | `lib/` | Design tokens, fonts, site-wide constants. | React feature UI. Route files. |
| Data | `database/` | Persistence and queries. | UI components. Feature-to-feature shortcuts. |
| Utils | `utils/` | Pure helpers with no React and no domain UI. | Import features, components, or Next.js route modules. |

**Import rules**

- `app/` → `features/*`, `components/layout`, `lib` (metadata/fonts only).
- `features/*` → `components/ui`, `lib`, `database`, `utils`. Never `features/<other>`.
- `components/` → `lib`, `utils`. Never `features/` or `database/`.
- Shared code moves *down* (into `components` / `lib` / `utils`), never sideways between features.
- Colocate feature-only components under that feature. Promote to `components/` only when a second feature needs the same primitive.

Insights (blog) is a feature: `features/insights/*` plus thin routes under `app/insights/`.

# Design system

Visual source of truth: Figma exports in `Premodus Labs/`. Code source of truth: `lib/design/tokens.ts` **and** `app/globals.css` (they must match). Font loading: `lib/design/fonts.ts` (Space Grotesk via `next/font/google`).

## Color

Only these fills and inks. Do not use Tailwind default palettes (`zinc`, `neutral`, `gray`, `slate`, arbitrary hex) in UI.

| Token | Value | Tailwind |
| --- | --- | --- |
| Strong — Black | `#000000` | `text-ink-strong` / `bg-surface` |
| Medium — Black 0.75 | `rgb(0 0 0 / 0.75)` | `text-ink-medium` |
| Weak — Black 0.6 | `rgb(0 0 0 / 0.6)` | `text-ink-weak` |
| Canvas | `#ffffff` | `bg-canvas` |
| Inverse | `#ffffff` on surface | `text-inverse` |

Headings and strong body use `ink-strong`. Default body uses `ink-medium`. Captions and de-emphasized lines use `ink-weak`. Header/nav sits on `surface` with `inverse` type. Do not add a dark-mode inversion unless the spec says so.

## Typography

Family: **Space Grotesk** only (`font-sans` → `--font-space-grotesk`). Weights in use: **400 regular** and **500 medium**. Do not load or apply other families (no Geist, Inter, system-ui as the designed face).

Use the named type styles, not ad-hoc `text-3xl` / `text-lg`:

| Style | Size | Weight | Class |
| --- | --- | --- | --- |
| Display | 48px | medium | `text-display` |
| Heading 1 | 40px | medium | `text-heading-1` |
| Heading 2 | 32px | medium | `text-heading-2` |
| Heading 3 | 24px | medium | `text-heading-3` |
| Heading 4 | 20px | medium | `text-heading-4` |
| Body | 16px | regular | `text-body` |
| Body bold | 16px | medium | `text-body-bold` |
| Small | 14px | regular | `text-small` |
| Small bold | 14px | medium | `text-small-bold` |
| Tiny | 12px | regular | `text-tiny` |
| Tiny bold | 12px | regular | `text-tiny-bold` |

Prefer `components/ui/text.tsx` variants (`display`, `h1`–`h4`, `body`, `body-bold`, `small`, `small-bold`, `tiny`, `tiny-bold`) over raw class soup. Line-height between lines of text is already on these styles; do not add extra `leading-*` unless matching a specific Figma component.

## Layout / spacing

- Between sections: `180px` → `gap-section` / `py-section` / `mt-section`
- Between major elements within a section: `60px` → `gap-major` / `mt-major`
- Page header padding: top `24px` (`pt-header-t`), bottom `60px` (`pb-header-b`)
- Page footer padding: `120px` top and bottom (`pt-footer` `pb-footer`)
- Page margin left/right: `40px` (`px-page`)
- Layout guide: **12 columns**, **40px** gutter (`page-grid`, `gap-gutter`)
- Otherwise spacing is multiples of **4px** (Tailwind’s default scale). Do not use 5/7/13px gaps.

Image sizes come from the component in Figma, not from a global token.

## Components

- Primary button: `components/ui/button.tsx` — `bg-surface` + `text-inverse` + `text-body-bold`. Do not restyle with random radii/colors.
- Site chrome: `components/layout/site-shell.tsx` only. Do not duplicate header/footer inside features.

## Voice (when writing copy)

See `BRANDID.MD`. Default: confident and understated; short sentences; no hype. Technical UI copy stays precise and unadorned.
