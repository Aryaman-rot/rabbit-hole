# Rabbit Hole — Design Theme ("Chili Spice")

Source of truth for brand colour. The tokens below are defined in
`src/app/globals.css` inside a Tailwind v4 `@theme` block and are usable as
utilities (`bg-primary`, `text-wine`, `border-primary-soft`, etc.).

## Palette

| Token          | Hex       | Name      | Tailwind utility prefix |
| -------------- | --------- | --------- | ----------------------- |
| `primary`      | `#CD1C18` | Chili red | `*-primary`             |
| `primary-soft` | `#FFA896` | Peach     | `*-primary-soft`        |
| `primary-deep` | `#9B1313` | Deep red  | `*-primary-deep`        |
| `wine`         | `#38000A` | Wine      | `*-wine`                |

Landing page background: **black** (`#000000`), not wine.

## Colour roles

- **Chili red `#CD1C18` (primary)** — primary actions: CTA buttons, key links,
  active states. Note: `primary` overrides shadcn's default near-black primary.
- **Peach `#FFA896` (primary-soft)** — soft surfaces only (backgrounds, cards,
  pills, highlights). **Never use peach as text colour on light backgrounds** —
  contrast fails.
- **Deep red `#9B1313` (primary-deep)** — hover and pressed states for primary
  actions.
- **Wine `#38000A` (wine)** — dark surface backgrounds, and the text colour to
  use *on* peach surfaces.
- **Black** — landing page background.

## Accessibility rule: red ≠ only-error-cue

Chili red is the brand colour, so users cannot rely on colour alone to spot
errors (red doesn't read as "wrong" here, and error red would clash with
brand red). Every error/destructive state must pair colour with **an icon and
explicit wording** (e.g. warning icon + "We couldn't save your answer"), never
a bare red field or red text.

## Landing page spec (as built)

Fonts: `Inter` bound to `--font-sans` (all weights, variable) and
`Mrs_Saint_Delafield` (weight 400) bound to `--font-script`, both applied as
variables on `<html>` in `src/app/layout.tsx`. No `@theme` remapping — the
`font-sans` utility resolves to Inter because the unlayered next/font class
beats Tailwind's `@layer theme` default on the html element. Background:
`#030303` on html and body (`--background`), `color-scheme: dark` — no white
flash.

Title (`src/app/page.tsx` + `src/components/landing.tsx`): one-line logo, an
`h1` with `aria-label="Rabbit Hole"` (spans `aria-hidden`), absolutely centered
in the viewport on its own (`top/left: 50%`, `translate(-50%, -50%)`,
independent of the button), flex `align-items: baseline`, gap ≈ 8% of the Hole
size. "Rabbit" in
`var(--font-script)` at 1.3× the Hole size, chili red (`--color-primary`), with
a soft dark `text-shadow: 0 2px 30px rgba(0,0,0,.6)` so the thin strokes stay
legible over the red shader. "Hole" in Inter 800, white, `letter-spacing:
-0.02em`, `clamp(3rem, 11vw, 8rem)`.

Entrance (write-on, no plain fade): an inline pre-paint script in `page.tsx`
adds `rh-anim` (mask supported) or `rh-anim-fade` (fallback) to
`<html>` unless `prefers-reduced-motion`; `rh-begin` is added when
`document.fonts.ready` resolves, so the script never flashes in a fallback
font. With JS disabled, or reduced motion, everything is simply visible.
The wipe animates a registered custom property `--rh-wipe` (-12% → 112%)
through a feathered (~8%) `mask-image` linear-gradient (with `-webkit-`
prefix): "Rabbit" 2.2s ease-in-out, "Hole" 0.8s starting ~1.9s in, button
fades in at ~3s. Masked spans carry `0.3em` padding / `-0.3em` margin so the
script's swashes overflow the mask box without shifting layout. If
`mask-image` is unsupported the same elements cross-fade in instead.

CTA: plain `<button>` (not the shadcn Button) labelled "Fall in" (placeholder),
pill, `linear-gradient(135deg, rgba(255,255,255,.9), rgba(255,168,150,.9) 50%,
rgba(255,230,222,.9))`, wine text, 14px/600, `px-6 py-3`, inset top highlight
plus soft peach glow; hover lifts 1px with glow `rgba(205,28,24,.35)`;
`focus-visible` gets a peach (`--color-primary-soft`) outline. Keyboard works
natively (real button). The wrapper is absolutely positioned at a fixed offset
below true center (`top: calc(50% + clamp(3rem, 9vw, 6rem))`) so it never
affects the title's position; on click it fades out
(`opacity` + `pointer-events: none`, then `visibility: hidden` after the
transition — never unmounted or `display: none`).

Hover: the pre-built spotlight cursor canvas mounts only on fine pointers,
config `color #CD1C18, brightness 0.18, radius 220`.

Click: the CTA calls `fall()` on the root `BackgroundProvider`
(`src/components/background-provider.tsx`), which owns ONE persistent
`ShaderBackground` for the whole app (uniforms untouched) inside a fixed
`-z-10` wrapper with the CSS fallback gradient `#38000A → #9B1313`
(`--color-wine` → `--color-primary-deep`) that shows if WebGL fails. The layer
crossfades in over the black page in 1.2s (`opacity` transition). The shader is
visible on any route other than "/" and after `fall()`; returning to "/" fades
it back to the black state. The landing click awaits the crossfade, then pushes
to `/onboarding`. Button fades out and hides (visibility, still mounted); the
spotlight fades and unmounts; the title stays exactly where it was until the
push. Reload resets to the black state (no persistence).

Note: `body` no longer sets `bg-background` — a body background paints over a
negative-z canvas. The black comes from `html` alone, behind the shader layer.

## Onboarding pitch + signup placeholder (as built)

Panel (`.rh-glass`, both `/onboarding` and `/signup`): wine `rgba(56, 0, 10,
0.8)` with `backdrop-filter: blur(12px)`, a soft peach border
(`rgba(255, 168, 150, 0.22)`), `border-radius: 1.5rem`, `max-w-md`, centered,
mobile-first. Opacity started at 70% but was **raised to 80% for legibility**:
measured over the shader's brightest (near-cream `#FFF7E5`) areas, peach body
text fell to 4.02:1 contrast at 70%, and reaches 5.63:1 at 80% (white headline
10.46:1). Keep the panel at 0.8 or higher — the shader's palette reaches
near-white, so anything more transparent puts body text below AA.

Onboarding: three slides with a short opacity fade (`.rh-slide`, 0.25s, none
under reduced motion). Headline is Inter bold white; body copy is peach
(`text-primary-soft`). Progress dots (`.rh-dot`, peach; active one elongates),
"Next" is a solid chili-red pill with white text (`.rh-primary-btn`, deep red on
hover), "Back" and "Skip" are quiet peach text buttons (`.rh-quiet`). Final
slide's button reads "Get started" and routes to `/signup`, which is a
placeholder glass panel reading "Sign up is coming next". All controls are real
buttons/links with a visible peach focus ring (`.rh-focus:focus-visible`,
2px outline).
