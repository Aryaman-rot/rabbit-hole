# Stage 1 — Prototype Log

## 2026-09-18 — Project Foundation Setup (Next.js, Tailwind v4, Firebase scaffold, Stub Routes)

**Prompt (summarized):** Set up the real project foundation inside `rabbit-hole/`: normalize folder names (`Plans` → `plans`, `stage files` → `stage-files`), move existing research README to `docs/research-summary.md`, initialize Next.js (App Router, TypeScript, Tailwind v4) in `src/`, scaffold Firebase client config with placeholder env vars in `.env.local` (gitignored), create stub placeholder pages for `/onboarding`, `/quiz`, `/feed`, `/chat`, and `/dashboard`, write a new root `README.md` pulling the one-sentence thesis from `plan.md`, verify local dev server, and commit.

**Files touched:**
- `Plans/` → `plans/` (renamed directory)
- `stage files/` → `stage-files/` (renamed directory)
- `README.md` → `docs/research-summary.md` (moved original research summary)
- `README.md` (new, project root README with thesis, stack overview, and local run guide)
- `.env.local` (new, placeholder Firebase environment variables, gitignored)
- `.gitignore` (new, Next.js default rules ignoring `.env*`, `node_modules`, `.next`, etc.)
- `package.json` (new, initialized Next.js 16, React 19, Tailwind v4, and Firebase SDK; renamed project to `rabbit-hole`)
- `package-lock.json` (new, npm lockfile)
- `tsconfig.json` (new, TypeScript configuration with `@/*` path alias)
- `next.config.ts` (new, Next.js configuration)
- `postcss.config.mjs` (new, PostCSS config for Tailwind v4 `@tailwindcss/postcss`)
- `eslint.config.mjs` (new, ESLint flat config with Next.js core web vitals and TypeScript rules)
- `AGENTS.md` (new, generated Next.js conventions and rules)
- `CLAUDE.md` (new, pointer to AGENTS.md)
- `public/file.svg` (new, default static asset)
- `public/globe.svg` (new, default static asset)
- `public/next.svg` (new, default static asset)
- `public/vercel.svg` (new, default static asset)
- `public/window.svg` (new, default static asset)
- `src/app/favicon.ico` (new, favicon asset)
- `src/app/globals.css` (new, Tailwind CSS v4 setup using `@import "tailwindcss";` and `@theme inline`)
- `src/app/layout.tsx` (new, root layout with Geist Sans & Geist Mono fonts and Rabbit Hole metadata)
- `src/app/page.tsx` (new, home page providing navigation links to all five route stubs)
- `src/app/onboarding/page.tsx` (new, placeholder page for profile setup)
- `src/app/quiz/page.tsx` (new, placeholder page for personality questionnaire)
- `src/app/feed/page.tsx` (new, placeholder page for browse/swipe interface)
- `src/app/chat/page.tsx` (new, placeholder page for messaging)
- `src/app/dashboard/page.tsx` (new, placeholder page for score movement and weekly progress)
- `src/components/.gitkeep` (new, git placeholder ensuring `src/components/` directory is tracked)
- `src/lib/firebase.ts` (new, Firebase client SDK initialization for Auth and Firestore)
- `stage-files/stage-1-prototype.md` (new, Phase 1 stage log)

**What changed:**
- Initialized a Next.js 16 application configured with App Router, TypeScript, and Tailwind CSS v4 inside the `src/` directory layout. In Tailwind CSS v4, styling configuration lives directly in CSS (`src/app/globals.css` via `@import "tailwindcss";` and `@theme inline`) rather than a standalone `tailwind.config.js`.
- Created `src/lib/firebase.ts` which initializes the Firebase App SDK via environment variables from `.env.local` and exports `auth` (`getAuth`) and `db` (`getFirestore`). It guards against duplicate app initialization during development hot-module replacement (HMR). At this stage, it does not wire any authentication flows, database reads/writes, or UI handlers to any screen.
- Created five stub routes under `src/app/`: `/onboarding`, `/quiz`, `/feed`, `/chat`, and `/dashboard`. Each route exports a minimalist placeholder page verifying that routing and Tailwind CSS classes compile and render. The root `src/app/page.tsx` renders a navigation index to all five routes.
- Normalized project directories: renamed `Plans` to `plans` and `stage files` to `stage-files` to ensure consistent lowercase-kebab conventions across environments.
- Relocated the pre-existing 139-line research notes from `README.md` to `docs/research-summary.md` and added a clean root `README.md` featuring the core project thesis from `plan.md` §1, the architectural structure, and local startup commands.

**Why:**
- Aligns directly with `plan.md` section 3 Phase 1 Deliverables: establishing the Next.js + Tailwind + Firebase base stack before building domain features.
- Adheres to `plan.md` section 2 Decision 4 (deferring ML/biometrics and complex backend machinery) and the anti-scope-creep constraint: setting up structural foundations only, intentionally avoiding premature feature UI, mock scoring algorithms, or live authentication logic.

**Result:**
- `npm run dev` started cleanly with Turbopack in ~1.2s.
- HTTP requests to `/`, `/onboarding`, `/quiz`, `/feed`, `/chat`, and `/dashboard` all returned HTTP 200 with complete rendered HTML.
- Confirmed that `.env.local` is strictly ignored by git via `.gitignore` (`.gitignore:34:.env*`).
- Note on bootstrapping: because the repository root directory name contains a space (`d:\rabbit hole`), `create-next-app` required scaffolding into a temporary directory `nextapp-temp` before copying into the project root and configuring `package.json` name to `"rabbit-hole"`.

**Open questions:**
- A real Firebase project has not been created in the Firebase console yet. Real Auth and Firestore operations remain blocked until project credentials are generated and populated into `.env.local`.

---

## 2026-09-18 — Onboarding and Quiz Flow Implementation

**Prompt (summarized):** Build the onboarding flow with 2-3 static slides pitching "we reward real dates, not swiping" and a "Get Started" button routing to `/quiz`. Build the personality quiz with 8 short IPIP-10-style questions, one per screen with tap-through, capturing answers in local component state and logging them to the console upon completion without Firebase writes. Style both mobile-first and cleanly with Tailwind within Phase 1 constraints.

**Files touched:**
- `src/app/onboarding/page.tsx` (modified, replaced placeholder with interactive 3-slide pitch and navigation)
- `src/app/quiz/page.tsx` (modified, replaced placeholder with 8-question IPIP-10 personality questionnaire, Likert scale selection, completion state, and console logger)
- `stage-files/stage-1-prototype.md` (modified, appended this log entry)

**What changed:**
- Replaced the `/onboarding` stub with an interactive client-side 3-slide flow. Slide 1 highlights the predatory retention incentives of incumbent dating apps ("Dating apps monetize staying single"). Slide 2 introduces Rabbit Hole's core premise ("We reward you for leaving the app" with real dates as the core currency). Slide 3 emphasizes mutual accountability and anti-ghosting without leaderboards or toxic streaks. Each slide includes a slide counter, progress pill indicators, "Skip" and "Back" controls, and a prominent "Get Started" call-to-action on the final slide that directs the user to `/quiz`.
- Replaced the `/quiz` stub with a mobile-first, one-question-per-screen personality test featuring 8 IPIP-10-style items mapped to the Big Five traits (Extraversion, Agreeableness, Conscientiousness, Emotional Stability, Openness). Users tap a 5-point Likert response ("Disagree strongly" to "Agree strongly") which stores their response in React state and auto-advances through the deck with a dynamic progress bar and "Previous" button. Upon answering Question 8, answers are logged to the browser console (`console.log`), and a completion screen renders showing a breakdown grid of all captured responses along with routing buttons to `/feed` or `/`.
- Maintained clean, responsive Tailwind styling without implementing complex design tokens or unnecessary dependencies.

**Why:**
- Directly aligns with Phase 1 Deliverables in `plan.md` section 3: "Core loop: onboarding → short personality quiz → mocked Fit Score...".
- Adheres strictly to council constraints in `plan.md` section 2 and `plans/council-notes.md`: no public leaderboard, no unmitigated streaks, no biometric UI or face-embedding fields, and no exposed numerical score.
- Defers Firebase persistence and algorithm calculations to keep the prototype iterative and decoupled until the real Firebase project and data schemas are ready.

**Result:**
- Both flows were verified end-to-end using an automated browser subagent.
- The onboarding flow successfully progressed through Slide 1, Slide 2, and Slide 3, and clicking "Get Started" navigated immediately to `/quiz`.
- The quiz successfully recorded responses across all 8 screens, emitted `Quiz completed. Captured answers: {1: 5, 2: 5, 3: 4, 4: 1, 5: 5, 6: 1, 7: 5, 8: 5}` to the console, and rendered the completion grid properly.

**Open questions:**
- How should the 8 personality dimension scores be mathematically weighted when computing the initial mock Fit Score in upcoming Phase 1 steps?
- When Firebase Auth is wired up, should the quiz answers be temporarily stored in localStorage to survive the sign-up/login redirect, or will authentication precede the quiz?

---

## 2026-09-18 — Feed and Mutual Match Flow Implementation

**Prompt (summarized):** Build the feed screen (`/feed`) with 8–10 seeded mock profiles (name, age, static placeholder photo, 2–3 Hinge-style bio/prompt cards), tap-through like/pass controls, without any visible match score or compatibility percentage. For 2–3 profiles flagged as "mutual" in seed data, display a match confirmation modal with a button routing to `/chat`. Store liked/passed profile IDs locally without Firebase writes, using consistent mobile-first Tailwind styles.

**Files touched:**
- `src/app/feed/page.tsx` (modified, replaced placeholder with complete 9-profile curated feed, like/pass handlers, mutual match modal, empty-state catchup screen, and localStorage sync)
- `src/app/chat/page.tsx` (modified, wrapped search params in Suspense and added dynamic conversation acknowledgment for matched profile query params)
- `stage-files/stage-1-prototype.md` (modified, appended this log entry)

**What changed:**
- Built the interactive feed screen (`/feed`) populated with 9 diverse seeded profiles (Maya Lin, Marcus Chen, Priya Sharma, Alex Rivera, Elena Rostova, Samir Patel, Chloe Dubois, David Kim, and Zoe Vance), each with location tags, occupations, short bios, custom stylized SVG avatar initials, and 2–3 Hinge-style prompt cards.
- Implemented tap-through "Pass" (✕) and "Like" (♥) actions. Responses are tracked in local state and synchronized to `localStorage` under `rabbit_hole_feed_state_v1`.
- Three profiles (`Marcus Chen`, `Elena Rostova`, `David Kim`) are designated as mutual matches (`isMutual: true`). When liked, an "It's a Match!" modal interrupts the deck, reiterating Rabbit Hole's offline dating philosophy and providing a direct "Message [Name]" button routing to `/chat?matchId=[id]`, alongside a "Keep Browsing" option.
- Configured an empty-state screen ("You're caught up for today") when all 9 profiles have been reviewed, presenting stats for profiles reviewed, liked, and matched, with a "Reset Queue (Demo)" control and a navigation link to `/chat`.
- Updated `src/app/chat/page.tsx` to safely consume incoming `matchId` search parameters within a React `Suspense` boundary and provide navigation back to the feed.
- Guaranteed complete absence of any visible match scores, compatibility percentages, or user rank badges on the profile cards.

**Why:**
- Satisfies the swipe/browse and matching stage of the Phase 1 core loop in `plan.md` section 3 ("Core loop: onboarding → short personality quiz → mocked Fit Score ... → swipe/browse → chat...").
- Upholds council decisions in `plan.md` section 2: no visible numerical match scores, no global rankings or comparative metrics, and no biometric processing. Matches are presented purely as mutual human interest rather than algorithmic percentage grades.
- Keeps persistence in localStorage to facilitate iterative testing without premature database writes.

**Result:**
- Tested end-to-end via an automated browser subagent through all 9 profiles:
  - Verified Maya Lin's card renders without any visible score or compatibility percentage.
  - Verified clicking "Pass" advances to Marcus Chen.
  - Verified clicking "Like" on Marcus Chen triggers the "It's a Match!" confirmation screen.
  - Verified clicking "Message Marcus Chen" routes to `/chat?matchId=marcus-2` and displays the active conversation header.
  - Verified returning to feed and clicking through the remaining cards, including triggering and dismissing a match with Elena Rostova.
  - Verified that exhausting the queue renders the empty deck screen ("You're caught up for today") showing 9 reviewed, 2 liked, and 2 matches.

**Open questions:**
- When real Firestore integration is introduced, how will mutual matches be coordinated across two different user documents (e.g. subcollections vs top-level match documents)?
- In the next iteration of the chat screen, should conversations have an inactivity or date-proposal countdown to discourage lingering in digital pen-pal mode?

---

## 2026-10-10 — shadcn/ui Setup, Chili Theme Tokens, Landing Components

**Prompt (summarized):** Run `npx shadcn@latest init` with defaults, verify the two pre-saved landing-page components in `src/components/ui/`, fix a bug in `spotlight-cursor.tsx` where an undefined `className` rendered the literal class `"undefined"`, register the four "chili spice" brand colours as Tailwind v4 `@theme` tokens, record the design system in `docs/design-theme.md`, and get `npm run build` passing — without touching the existing route stubs, `src/lib/firebase.ts`, or any prior work.

**Files touched:**
- `components.json` (new, shadcn config: style `base-nova`, base color `neutral`, CSS variables on, aliases `@/components`, `@/lib/utils`, icon library lucide)
- `package.json` (modified, shadcn init added dependencies: `@base-ui/react`, `class-variance-authority`, `cn`, `lucide-react`, `shadcn`, `tw-animate-css`)
- `package-lock.json` (modified, lockfile updated for the new dependencies)
- `src/app/globals.css` (modified, shadcn init rewrote it: added `tw-animate-css` and `shadcn/tailwind.css` imports, a `@custom-variant dark` rule, a full neutral oklch design-token set in `:root`/`.dark` (background, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, chart-1..5, sidebar-*), a radius scale, and `@layer base` defaults replacing the old `body` rule; then this session added a `@theme` block with the four brand tokens `--color-primary: #CD1C18`, `--color-primary-soft: #FFA896`, `--color-primary-deep: #9B1313`, `--color-wine: #38000A`)
- `src/lib/utils.ts` (new, created by shadcn init — the `cn()` class-merge helper)
- `src/components/ui/button.tsx` (new, created by shadcn init — default Button with variants)
- `src/components/ui/spotlight-cursor.tsx` (modified, pre-saved component: cursor-following radial-gradient canvas overlay; fixed `className` prop defaulting so an omitted prop no longer renders the literal class `"undefined"`)
- `src/components/ui/red-black-vanila.tsx` (modified, pre-saved component: zero-dependency WebGL "Silk" shader background canvas; added non-null assertions inside the `render` loop to satisfy TypeScript strict null checks — no behavior change)
- `docs/design-theme.md` (new, records the chili palette, per-colour roles, the "errors need icon + wording, not colour alone" rule, and a placeholder for the landing page spec)
- `stage-files/stage-1-prototype.md` (modified, appended this log entry)

**What changed:**
- shadcn/ui is now initialized in the project. Practically that means: a `components.json` telling the shadcn CLI where to put things, the `cn()` utility in `src/lib/utils.ts`, a default `Button` component, and a rewritten `globals.css` that swaps the old hand-rolled light/dark variables for shadcn's full neutral oklch token set plus animation imports. New shadcn components can now be added with `npx shadcn@latest add <name>`.
- On top of shadcn's neutral tokens, the four Rabbit Hole brand colours were registered as first-class Tailwind v4 theme tokens, so `bg-primary`, `text-wine`, `hover:bg-primary-deep`, `bg-primary-soft` etc. work anywhere without arbitrary-value syntax. `primary` intentionally overrides shadcn's near-black default primary with chili red.
- `spotlight-cursor.tsx` bug fix: the component destructured `className` with no default and interpolated it into a template string, so rendering `<Component />` without a className produced `class="... undefined"`. It now defaults to `''`.
- `red-black-vanila.tsx` build fix: TypeScript strict mode flagged `canvas`/`gl` as possibly null inside the animation-frame `render` closure (the null guards at the top of the effect don't narrow across async callbacks). Added `!` assertions at the seven flagged expressions in `render` only; runtime behavior is unchanged because those guards already ran.
- `docs/design-theme.md` was created as the design-system reference: palette table, role of each colour (chili red = primary actions, peach = soft surfaces but never text on light backgrounds, deep red = hover/pressed, wine = dark backgrounds and text on peach, black = landing page background), and the accessibility rule that because red is the brand colour, error states must always pair colour with an icon and explicit wording.

**Why:**
- Phase 1 deliverables in `plan.md` §3 call for the Next.js + Tailwind stack; shadcn/ui gives production-grade accessible primitives (starting with Button) instead of hand-rolling UI, which matters because this is intended to become a real product.
- The two components are landing-page building blocks (spotlight cursor effect, red/black WebGL shader background) — saved now, wired up when the landing page spec arrives.
- Centralizing brand colours as tokens and documenting roles in `docs/design-theme.md` prevents inconsistent one-off hex values across screens and keeps future sessions aligned with the "red is brand, not just error" accessibility constraint.
- Per prompt instructions, `src/app/onboarding`, `quiz`, `feed`, `chat`, `dashboard` and `src/lib/firebase.ts` were left untouched; nothing was deleted.

**Result:**
- `npm run build` passes: TypeScript clean, all 7 routes (`/`, `/chat`, `/dashboard`, `/feed`, `/onboarding`, `/quiz`, `/_not-found`) prerender as static content.
- `npx eslint` on both modified components reports no issues.
- First build attempt failed with 7 TS18047 strict-null errors in `red-black-vanila.tsx`; fixed as described above, second build succeeded.

**Open questions:**
- The landing page spec has not been provided yet — `docs/design-theme.md` has a placeholder section to fill in when it arrives.
- shadcn init changed `--font-sans: var(--font-geist-sans)` to `--font-sans: var(--font-sans)` in `globals.css`, while `src/app/layout.tsx` still binds Geist via the `--font-geist-sans` variable. Fonts still render via the `@layer base` default, but a future session should reconcile the font variable names when the landing page typography is decided.

---

## 2026-10-10 — Landing Page (Step 0 cleanup + write-on title, holographic CTA, shader crossfade)

**Prompt (summarized):** Step 0 cleanup (remove the stray `cn` package if unused, fix the self-referencing `--font-sans` from shadcn init by loading Inter as `--font-sans` and Mrs Saint Delafield as `--font-script` in the root layout, set html/body background to `#030303`), then build the landing page at `src/app/page.tsx` reusing `spotlight-cursor` and `red-black-vanila`: near-black full-screen state, one-line "Rabbit Hole" logo ("Rabbit" in signature script at 1.3× the size of "Hole", "Hole" Inter 800 white), a write-on mask-wipe entrance gated on `document.fonts.ready` with reduced-motion / no-JS / no-mask-image fallbacks, a holographic "Fall in" pill button, a red-tinted spotlight cursor on fine pointers only, and a click that crossfades the black background to the WebGL shader over ~1.2s with a CSS gradient fallback, fading out button and spotlight. No new libraries, shader uniforms untouched, verify in dev at mobile and desktop widths, update the design doc, log, and commit as "feat: landing page".

**Files touched:**
- `package.json` (modified, removed the directly-installed `cn` package that shadcn init had added; nothing imported it)
- `package-lock.json` (modified, `cn@0.4.0` removed; `clsx` and `tailwind-merge` recorded as direct dependencies)
- `src/lib/utils.ts` (modified, `cn()` now implemented with `clsx` + `tailwind-merge` instead of re-exporting the `cn` package)
- `src/components/ui/button.tsx` (modified, imports `cn` from `@/lib/utils` instead of the removed `cn` package)
- `src/app/layout.tsx` (modified, Inter as `--font-sans` and Mrs_Saint_Delafield (weight 400) as `--font-script`, both variables on `<html>`, Geist bindings removed, `suppressHydrationWarning` added because the landing boot script mutates `<html>`'s class before hydration)
- `src/app/globals.css` (modified, self-referencing `--font-sans: var(--font-sans)` and dead `--font-mono: var(--font-geist-mono)` mappings removed; background `#030303` + `color-scheme: dark` on `:root`, `bg-background` on html; landing styles appended: `@property --rh-wipe`, title/CTA/shader classes, wipe transitions, reduced-motion overrides)
- `src/app/page.tsx` (modified, replaced the scaffold nav index with the landing page: an inline pre-paint boot script plus the `Landing` client component)
- `src/components/landing.tsx` (new, the interactive landing page: fonts-ready gating, fine-pointer spotlight mounting, click-to-enter state machine, title + CTA markup)
- `docs/design-theme.md` (modified, replaced the landing-spec placeholder with the spec as actually built)
- `stage-files/stage-1-prototype.md` (modified, appended this log entry)

**What changed:**
- Step 0: `npm ls` showed `cn@0.2.6` only as a transitive dependency of the `shadcn` CLI itself (via `@shadcn/registry`), so it stays; the directly-installed `cn@0.4.0` was gone from `package.json`, nothing in `src/` imported `"cn"` anymore, and `src/lib/utils.ts` provides the standard clsx + tailwind-merge `cn()`.
- Font fix: the root layout now binds Inter (all weights, variable font) as `--font-sans` and Mrs Saint Delafield (weight 400, non-variable) as `--font-script`, both applied on `<html>`. The self-referencing `@theme inline` mapping was deleted rather than re-added, so no CSS variable references itself; the `font-sans` utility still resolves to Inter because next/font's generated variable class is unlayered and therefore beats Tailwind's `@layer theme` `:root` default on the html element (verified in the built CSS).
- Landing page: `src/app/page.tsx` is a server component whose only job is to emit an inline blocking `<script>` ahead of the content (runs during HTML parsing, before first paint) that picks the animation mode — `rh-anim` when `mask-image` is supported, `rh-anim-fade` when not, nothing when `prefers-reduced-motion` — and adds `rh-begin` when `document.fonts.ready` resolves, so the script text can never flash in a fallback font. With JS disabled or reduced motion, no classes are added and everything is simply visible. `src/components/landing.tsx` re-applies those classes in a `useLayoutEffect` (covers React Strict Mode's dev remount clearing `<html>` attributes, per the Next 16 "preventing flash before hydration" guide, and soft navigations back to `/`).
- Write-on entrance: a registered custom property `--rh-wipe` (initial -12%, animating to 112%) drives a feathered (~8%) `mask-image` linear-gradient (with `-webkit-` prefix) swept via CSS transitions — "Rabbit" 2.2s ease-in-out, "Hole" 0.8s starting ~1.9s in, the CTA wrapper fades in at ~3s. Both title spans carry `0.3em` padding / `-0.3em` margin (layout-neutral) so Mrs Saint Delafield's swashes overflow the text box without being clipped by the mask box.
- Title: `h1` with `aria-label="Rabbit Hole"` (spans `aria-hidden`), flex `align-items: baseline`, "Rabbit" in the script font at 1.3× the "Hole" size (script x-height is small) in chili red with a soft dark text-shadow `0 2px 30px rgba(0,0,0,.6)` for legibility over the red shader; "Hole" Inter 800, white, `letter-spacing: -0.02em`, `clamp(3rem, 11vw, 8rem)`.
- CTA: a plain `<button>` (deliberately not the shadcn Button) — pill, holographic 135° white→peach→blush gradient, wine text, 14px semibold, `px-6 py-3`, inset top highlight + soft peach glow, hover `translateY(-1px)` with stronger `rgba(205,28,24,.35)` glow, `focus-visible` peach outline; keyboard activation is native.
- Spotlight: the pre-built canvas cursor mounted only when `(pointer: fine)` matches (hidden on touch/coarse pointers), config `color #CD1C18, brightness 0.18, radius 220`.
- Click ("Fall in"): mounts the pre-built `ShaderBackground` (uniforms untouched) only after the click, inside a fixed layer that carries the CSS fallback gradient `#38000A → #9B1313` (visible if WebGL is unavailable) and crossfades in from opacity 0 over 1.2s; the button and spotlight fade out (~0.7s) and then unmount (button leaves the a11y tree/tab order); the title stays; no navigation happens; a reload resets to the black state because nothing is persisted.

**Why:**
- Executes the landing page spec: a cinematic "fall down the rabbit hole" opening beat (signature-script "Rabbit" being inked on, heavy upright "Hole", holographic CTA) that establishes the brand typography and chili palette before any product UI.
- The fonts-ready gating, inline pre-paint script, and layered fallbacks exist so the entrance degrades gracefully everywhere: reduced motion → static, no `mask-image` → plain fades, no JS → fully visible text, no WebGL → CSS gradient.
- Followed the repo constraint of no new libraries: everything is CSS + the two pre-saved components, and the shader's uniforms were left untouched.

**Result:**
- `npm run dev` served the page (HTTP 200) with the boot script, title spans, `aria-label`, and CTA present in the served HTML; browser-level visual verification (write-on animation, hover glow, click transition at mobile and desktop widths) was deferred to the author per instruction.
- `npm run build` passes: TypeScript clean, all 7 routes prerender statically.
- The built CSS was inspected: no `--font-sans` self-reference or Geist references remain, the `@property --rh-wipe` registration, both `mask-image` prefixes, the `#030303` background, and the unlayered next/font variable classes (which make `font-sans` resolve to Inter) are all present.
- `npx eslint` on all touched files is clean; repo-wide `npm run lint` reports one pre-existing error in `src/app/feed/page.tsx` (setState-in-effect from an earlier session, untouched by this work).

**Open questions:**
- Does Mrs Saint Delafield's swash overflow exceed the 0.3em mask padding at the largest title size in practice? If any flourish looks clipped after the wipe settles, the padding needs a bump (or the mask should be dropped after the transition ends) — needs the author's visual check.
- Is "Rabbit" legible enough against the shader's red areas with the current dark text-shadow, or does it need a stronger treatment? (Spec says report rather than change the colour.)
- The "Fall in" label is a placeholder — what does the CTA do next (route to `/onboarding`, auth, age gate)? Nothing is wired yet.
- How should the entrance behave on repeat visits (skip the 3s sequence after the first time, or always play)? Currently it always plays.


