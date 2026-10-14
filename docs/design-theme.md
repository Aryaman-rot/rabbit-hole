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

## Design bar (applies to every screen, always)

This is the standing bar for all UI work in this repo. If a screen doesn't meet
it, the screen is wrong — not the bar. Tokens live in `:root` in
`src/app/globals.css` (`--rh-hairline`, `--rh-radius-*`, `--rh-ease`,
`--rh-error-ink`) so rules stay consistent across screens.

**Character.** Premium and restrained — a private members' club, not a SaaS
dashboard. Restraint is the point: few borders, few fills, generous space.

**No browser-default control may ever be visible.** Date pickers, `<select>`
dropdowns, checkboxes, radios and number spinners must be custom-styled or
replaced entirely. Prefer replacing with purpose-built controls (see
`src/components/form/`): `Field` / `FieldGroup`, `ChipRadioGroup` /
`ChipCheckGroup`, `DateOfBirthInput`, `AgeRangeInput`. Native inputs stay
underneath for semantics, keyboard and screen readers, but are visually
replaced.

**Surfaces.** Hairline borders `rgba(255,255,255,.10)` (never peach outlines on
idle fields), a subtle inner top highlight, soft long shadows
(`0 18px 44px -30px rgba(0,0,0,.9)`), and a consistent radius scale: `10px`
small, `14px` controls, `20px` panels, `9999px` pills.

**Type.** Inter throughout. Headings tight (`letter-spacing: -0.02em`). Labels
are 12px, uppercase, `0.08em` tracking, peach at ~80% opacity. Body copy
15–16px with generous line-height (1.5–1.6).

**Space.** 4px spacing grid, generous whitespace. One clear primary action per
screen.

**Motion.** 150–250ms, `cubic-bezier(0.22, 1, 0.36, 1)`. Press-scale `0.98`.
Animate opacity and transform only — never width, height, top/left, or colour
of layout-affecting properties. `prefers-reduced-motion` must collapse all of
it to instant.

**Colour discipline.** Chili red only for the single primary action. Peach for
selected/active accents. Errors are never red text: an icon plus a plain
sentence, in light cream.

**Focus.** Elegant and consistent: 2px peach (`#FFA896`) outline with an offset.
Visible on every interactive element.

**Browser noise.** Autofill must be styled to our own surface (no yellow/blue
browser wash). Peach caret (`caret-color`) and selection colour. Thin
scrollbars.

**Copy.** Short and warm. No exclamation marks, no emojis.

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
crossfades in over the black page in 1.2s with `cubic-bezier(0.22, 1, 0.36, 1)`.
The shader is visible on any route other than "/" and after `fall()`; returning
to "/" fades it back to the black state and the landing write-on replays.

Transition choreography (landing → `/onboarding`): the landing prefetches
`/onboarding` on mount, and warms the shader by mounting the (still single,
hidden) canvas via `warm()` once the entrance reveal has finished plus an
idle callback — so shader compilation happens before the click, never during
it. On click: button fades (0.6s), shader crossfades (1.2s), the title fades
out with a 0.98 scale (0.5s starting 0.7s in, opacity+transform only), the
push happens at the end of the crossfade, and the onboarding/signup panel
enters with opacity + `translateY(12px → 0)` over 0.6s (`.rh-panel-in`) — no
hard cuts. Under `prefers-reduced-motion` everything is instant (no animation).
The title position never shifts: it's absolutely centered and only
opacity/transform are animated. Reload resets to the black state (no
persistence).

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
slide's button reads "Get started" and routes to `/signup`. All controls are
real buttons/links with a visible peach focus ring (`.rh-focus:focus-visible`,
2px outline).

## Sign-up / log-in + fake auth (as built)

Auth lives in `src/lib/auth/`: an `AuthService` interface (`auth-service.ts`
with `AuthUser` = `{ uid, email, createdAt }` and an `AuthError` code), a fake
implementation (`fake-auth.ts`, headed by a prominent **DEV ONLY — replace
with Firebase** banner), and `AuthProvider`/`useAuth()` (`auth-context.tsx`)
mounted in the root layout *inside* `BackgroundProvider`, so the single
persistent shader is untouched. Fake rules: one localStorage key
(`rabbit_hole_auth_user_v1`) stores only `{ uid, email, createdAt }`; the
password is never stored, compared, or logged (discarded via `void password`);
sign-up always succeeds; sign-in succeeds for any *registered* email and
throws `invalid-credentials` for an unknown email; "Continue with Google"
signs in `demo@rabbithole.test`; every call has a ~400ms latency so the UI
feels real. Swap the `fakeAuth` export for a Firebase-backed service with the
same shape — that's the contract the rest of the app consumes.

`/signup` (one page, mode via `?mode=login`, so it renders dynamically):
glass panel with a Sign up / Log in tab toggle (links, `aria-current`),
"Continue with Google" above an "or" divider, then email + password fields
(`autocomplete` = `email` + `new-password`/`current-password`), a show/hide
password button (`aria-pressed`), the sign-up-only required "I'm 18 or older"
checkbox (`accent-color` chili), and the solid chili primary button with a
loading state. Under the form, a small peach note: "Prototype: no real
accounts yet. Please don't use a real password."

Validation: every error pairs a `TriangleAlert` icon with a plain sentence in
light cream (`#ffe9e3` — deliberately NOT chili-red text; invalid fields get a
peach border, but the icon + sentence carry the meaning, never colour alone).
Errors link via `aria-describedby` + `aria-invalid`, and a visually hidden
`aria-live="polite"` region announces the first current message. Cases: invalid
email, password under 8 chars, unchecked 18+ box, and "We couldn't find an
account with those details." on log-in.

`/basics` is the post-auth placeholder ("Tell us a bit about you - coming
next" + "Sign out"), gated by a small `RequireAuth` wrapper
(`src/components/require-auth.tsx`) that redirects to `/signup` when signed
out. Signed-in users who open `/signup` are redirected to `/basics`.
