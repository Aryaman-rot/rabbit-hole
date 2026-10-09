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

## Landing page spec

*(To be filled in — spec will be provided in a follow-up session. Black
background per the theme decision above.)*
