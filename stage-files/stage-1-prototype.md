# Stage 1 â€” Prototype Log

## 2026-09-18 â€” Project Foundation Setup (Next.js, Tailwind v4, Firebase scaffold, Stub Routes)

**Prompt (summarized):** Set up the real project foundation inside `rabbit-hole/`: normalize folder names (`Plans` â†’ `plans`, `stage files` â†’ `stage-files`), move existing research README to `docs/research-summary.md`, initialize Next.js (App Router, TypeScript, Tailwind v4) in `src/`, scaffold Firebase client config with placeholder env vars in `.env.local` (gitignored), create stub placeholder pages for `/onboarding`, `/quiz`, `/feed`, `/chat`, and `/dashboard`, write a new root `README.md` pulling the one-sentence thesis from `plan.md`, verify local dev server, and commit.

**Files touched:**
- `Plans/` â†’ `plans/` (renamed directory)
- `stage files/` â†’ `stage-files/` (renamed directory)
- `README.md` â†’ `docs/research-summary.md` (moved original research summary)
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
- Relocated the pre-existing 139-line research notes from `README.md` to `docs/research-summary.md` and added a clean root `README.md` featuring the core project thesis from `plan.md` Â§1, the architectural structure, and local startup commands.

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

## 2026-09-18 â€” Onboarding and Quiz Flow Implementation

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
- Directly aligns with Phase 1 Deliverables in `plan.md` section 3: "Core loop: onboarding â†’ short personality quiz â†’ mocked Fit Score...".
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

## 2026-09-18 â€” Feed and Mutual Match Flow Implementation

**Prompt (summarized):** Build the feed screen (`/feed`) with 8â€“10 seeded mock profiles (name, age, static placeholder photo, 2â€“3 Hinge-style bio/prompt cards), tap-through like/pass controls, without any visible match score or compatibility percentage. For 2â€“3 profiles flagged as "mutual" in seed data, display a match confirmation modal with a button routing to `/chat`. Store liked/passed profile IDs locally without Firebase writes, using consistent mobile-first Tailwind styles.

**Files touched:**
- `src/app/feed/page.tsx` (modified, replaced placeholder with complete 9-profile curated feed, like/pass handlers, mutual match modal, empty-state catchup screen, and localStorage sync)
- `src/app/chat/page.tsx` (modified, wrapped search params in Suspense and added dynamic conversation acknowledgment for matched profile query params)
- `stage-files/stage-1-prototype.md` (modified, appended this log entry)

**What changed:**
- Built the interactive feed screen (`/feed`) populated with 9 diverse seeded profiles (Maya Lin, Marcus Chen, Priya Sharma, Alex Rivera, Elena Rostova, Samir Patel, Chloe Dubois, David Kim, and Zoe Vance), each with location tags, occupations, short bios, custom stylized SVG avatar initials, and 2â€“3 Hinge-style prompt cards.
- Implemented tap-through "Pass" (âœ•) and "Like" (â™¥) actions. Responses are tracked in local state and synchronized to `localStorage` under `rabbit_hole_feed_state_v1`.
- Three profiles (`Marcus Chen`, `Elena Rostova`, `David Kim`) are designated as mutual matches (`isMutual: true`). When liked, an "It's a Match!" modal interrupts the deck, reiterating Rabbit Hole's offline dating philosophy and providing a direct "Message [Name]" button routing to `/chat?matchId=[id]`, alongside a "Keep Browsing" option.
- Configured an empty-state screen ("You're caught up for today") when all 9 profiles have been reviewed, presenting stats for profiles reviewed, liked, and matched, with a "Reset Queue (Demo)" control and a navigation link to `/chat`.
- Updated `src/app/chat/page.tsx` to safely consume incoming `matchId` search parameters within a React `Suspense` boundary and provide navigation back to the feed.
- Guaranteed complete absence of any visible match scores, compatibility percentages, or user rank badges on the profile cards.

**Why:**
- Satisfies the swipe/browse and matching stage of the Phase 1 core loop in `plan.md` section 3 ("Core loop: onboarding â†’ short personality quiz â†’ mocked Fit Score ... â†’ swipe/browse â†’ chat...").
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

## 2026-10-10 â€” shadcn/ui Setup, Chili Theme Tokens, Landing Components

**Prompt (summarized):** Run `npx shadcn@latest init` with defaults, verify the two pre-saved landing-page components in `src/components/ui/`, fix a bug in `spotlight-cursor.tsx` where an undefined `className` rendered the literal class `"undefined"`, register the four "chili spice" brand colours as Tailwind v4 `@theme` tokens, record the design system in `docs/design-theme.md`, and get `npm run build` passing â€” without touching the existing route stubs, `src/lib/firebase.ts`, or any prior work.

**Files touched:**
- `components.json` (new, shadcn config: style `base-nova`, base color `neutral`, CSS variables on, aliases `@/components`, `@/lib/utils`, icon library lucide)
- `package.json` (modified, shadcn init added dependencies: `@base-ui/react`, `class-variance-authority`, `cn`, `lucide-react`, `shadcn`, `tw-animate-css`)
- `package-lock.json` (modified, lockfile updated for the new dependencies)
- `src/app/globals.css` (modified, shadcn init rewrote it: added `tw-animate-css` and `shadcn/tailwind.css` imports, a `@custom-variant dark` rule, a full neutral oklch design-token set in `:root`/`.dark` (background, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, chart-1..5, sidebar-*), a radius scale, and `@layer base` defaults replacing the old `body` rule; then this session added a `@theme` block with the four brand tokens `--color-primary: #CD1C18`, `--color-primary-soft: #FFA896`, `--color-primary-deep: #9B1313`, `--color-wine: #38000A`)
- `src/lib/utils.ts` (new, created by shadcn init â€” the `cn()` class-merge helper)
- `src/components/ui/button.tsx` (new, created by shadcn init â€” default Button with variants)
- `src/components/ui/spotlight-cursor.tsx` (modified, pre-saved component: cursor-following radial-gradient canvas overlay; fixed `className` prop defaulting so an omitted prop no longer renders the literal class `"undefined"`)
- `src/components/ui/red-black-vanila.tsx` (modified, pre-saved component: zero-dependency WebGL "Silk" shader background canvas; added non-null assertions inside the `render` loop to satisfy TypeScript strict null checks â€” no behavior change)
- `docs/design-theme.md` (new, records the chili palette, per-colour roles, the "errors need icon + wording, not colour alone" rule, and a placeholder for the landing page spec)
- `stage-files/stage-1-prototype.md` (modified, appended this log entry)

**What changed:**
- shadcn/ui is now initialized in the project. Practically that means: a `components.json` telling the shadcn CLI where to put things, the `cn()` utility in `src/lib/utils.ts`, a default `Button` component, and a rewritten `globals.css` that swaps the old hand-rolled light/dark variables for shadcn's full neutral oklch token set plus animation imports. New shadcn components can now be added with `npx shadcn@latest add <name>`.
- On top of shadcn's neutral tokens, the four Rabbit Hole brand colours were registered as first-class Tailwind v4 theme tokens, so `bg-primary`, `text-wine`, `hover:bg-primary-deep`, `bg-primary-soft` etc. work anywhere without arbitrary-value syntax. `primary` intentionally overrides shadcn's near-black default primary with chili red.
- `spotlight-cursor.tsx` bug fix: the component destructured `className` with no default and interpolated it into a template string, so rendering `<Component />` without a className produced `class="... undefined"`. It now defaults to `''`.
- `red-black-vanila.tsx` build fix: TypeScript strict mode flagged `canvas`/`gl` as possibly null inside the animation-frame `render` closure (the null guards at the top of the effect don't narrow across async callbacks). Added `!` assertions at the seven flagged expressions in `render` only; runtime behavior is unchanged because those guards already ran.
- `docs/design-theme.md` was created as the design-system reference: palette table, role of each colour (chili red = primary actions, peach = soft surfaces but never text on light backgrounds, deep red = hover/pressed, wine = dark backgrounds and text on peach, black = landing page background), and the accessibility rule that because red is the brand colour, error states must always pair colour with an icon and explicit wording.

**Why:**
- Phase 1 deliverables in `plan.md` Â§3 call for the Next.js + Tailwind stack; shadcn/ui gives production-grade accessible primitives (starting with Button) instead of hand-rolling UI, which matters because this is intended to become a real product.
- The two components are landing-page building blocks (spotlight cursor effect, red/black WebGL shader background) â€” saved now, wired up when the landing page spec arrives.
- Centralizing brand colours as tokens and documenting roles in `docs/design-theme.md` prevents inconsistent one-off hex values across screens and keeps future sessions aligned with the "red is brand, not just error" accessibility constraint.
- Per prompt instructions, `src/app/onboarding`, `quiz`, `feed`, `chat`, `dashboard` and `src/lib/firebase.ts` were left untouched; nothing was deleted.

**Result:**
- `npm run build` passes: TypeScript clean, all 7 routes (`/`, `/chat`, `/dashboard`, `/feed`, `/onboarding`, `/quiz`, `/_not-found`) prerender as static content.
- `npx eslint` on both modified components reports no issues.
- First build attempt failed with 7 TS18047 strict-null errors in `red-black-vanila.tsx`; fixed as described above, second build succeeded.

**Open questions:**
- The landing page spec has not been provided yet â€” `docs/design-theme.md` has a placeholder section to fill in when it arrives.
- shadcn init changed `--font-sans: var(--font-geist-sans)` to `--font-sans: var(--font-sans)` in `globals.css`, while `src/app/layout.tsx` still binds Geist via the `--font-geist-sans` variable. Fonts still render via the `@layer base` default, but a future session should reconcile the font variable names when the landing page typography is decided.

---

## 2026-10-10 â€” Landing Page (Step 0 cleanup + write-on title, holographic CTA, shader crossfade)

**Prompt (summarized):** Step 0 cleanup (remove the stray `cn` package if unused, fix the self-referencing `--font-sans` from shadcn init by loading Inter as `--font-sans` and Mrs Saint Delafield as `--font-script` in the root layout, set html/body background to `#030303`), then build the landing page at `src/app/page.tsx` reusing `spotlight-cursor` and `red-black-vanila`: near-black full-screen state, one-line "Rabbit Hole" logo ("Rabbit" in signature script at 1.3Ã— the size of "Hole", "Hole" Inter 800 white), a write-on mask-wipe entrance gated on `document.fonts.ready` with reduced-motion / no-JS / no-mask-image fallbacks, a holographic "Fall in" pill button, a red-tinted spotlight cursor on fine pointers only, and a click that crossfades the black background to the WebGL shader over ~1.2s with a CSS gradient fallback, fading out button and spotlight. No new libraries, shader uniforms untouched, verify in dev at mobile and desktop widths, update the design doc, log, and commit as "feat: landing page".

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
- Landing page: `src/app/page.tsx` is a server component whose only job is to emit an inline blocking `<script>` ahead of the content (runs during HTML parsing, before first paint) that picks the animation mode â€” `rh-anim` when `mask-image` is supported, `rh-anim-fade` when not, nothing when `prefers-reduced-motion` â€” and adds `rh-begin` when `document.fonts.ready` resolves, so the script text can never flash in a fallback font. With JS disabled or reduced motion, no classes are added and everything is simply visible. `src/components/landing.tsx` re-applies those classes in a `useLayoutEffect` (covers React Strict Mode's dev remount clearing `<html>` attributes, per the Next 16 "preventing flash before hydration" guide, and soft navigations back to `/`).
- Write-on entrance: a registered custom property `--rh-wipe` (initial -12%, animating to 112%) drives a feathered (~8%) `mask-image` linear-gradient (with `-webkit-` prefix) swept via CSS transitions â€” "Rabbit" 2.2s ease-in-out, "Hole" 0.8s starting ~1.9s in, the CTA wrapper fades in at ~3s. Both title spans carry `0.3em` padding / `-0.3em` margin (layout-neutral) so Mrs Saint Delafield's swashes overflow the text box without being clipped by the mask box.
- Title: `h1` with `aria-label="Rabbit Hole"` (spans `aria-hidden`), flex `align-items: baseline`, "Rabbit" in the script font at 1.3Ã— the "Hole" size (script x-height is small) in chili red with a soft dark text-shadow `0 2px 30px rgba(0,0,0,.6)` for legibility over the red shader; "Hole" Inter 800, white, `letter-spacing: -0.02em`, `clamp(3rem, 11vw, 8rem)`.
- CTA: a plain `<button>` (deliberately not the shadcn Button) â€” pill, holographic 135Â° whiteâ†’peachâ†’blush gradient, wine text, 14px semibold, `px-6 py-3`, inset top highlight + soft peach glow, hover `translateY(-1px)` with stronger `rgba(205,28,24,.35)` glow, `focus-visible` peach outline; keyboard activation is native.
- Spotlight: the pre-built canvas cursor mounted only when `(pointer: fine)` matches (hidden on touch/coarse pointers), config `color #CD1C18, brightness 0.18, radius 220`.
- Click ("Fall in"): mounts the pre-built `ShaderBackground` (uniforms untouched) only after the click, inside a fixed layer that carries the CSS fallback gradient `#38000A â†’ #9B1313` (visible if WebGL is unavailable) and crossfades in from opacity 0 over 1.2s; the button and spotlight fade out (~0.7s) and then unmount (button leaves the a11y tree/tab order); the title stays; no navigation happens; a reload resets to the black state because nothing is persisted.

**Why:**
- Executes the landing page spec: a cinematic "fall down the rabbit hole" opening beat (signature-script "Rabbit" being inked on, heavy upright "Hole", holographic CTA) that establishes the brand typography and chili palette before any product UI.
- The fonts-ready gating, inline pre-paint script, and layered fallbacks exist so the entrance degrades gracefully everywhere: reduced motion â†’ static, no `mask-image` â†’ plain fades, no JS â†’ fully visible text, no WebGL â†’ CSS gradient.
- Followed the repo constraint of no new libraries: everything is CSS + the two pre-saved components, and the shader's uniforms were left untouched.

**Result:**
- `npm run dev` served the page (HTTP 200) with the boot script, title spans, `aria-label`, and CTA present in the served HTML; browser-level visual verification (write-on animation, hover glow, click transition at mobile and desktop widths) was deferred to the author per instruction.
- `npm run build` passes: TypeScript clean, all 7 routes prerender statically.
- The built CSS was inspected: no `--font-sans` self-reference or Geist references remain, the `@property --rh-wipe` registration, both `mask-image` prefixes, the `#030303` background, and the unlayered next/font variable classes (which make `font-sans` resolve to Inter) are all present.
- `npx eslint` on all touched files is clean; repo-wide `npm run lint` reports one pre-existing error in `src/app/feed/page.tsx` (setState-in-effect from an earlier session, untouched by this work).

**Open questions:**
- Does Mrs Saint Delafield's swash overflow exceed the 0.3em mask padding at the largest title size in practice? If any flourish looks clipped after the wipe settles, the padding needs a bump (or the mask should be dropped after the transition ends) â€” needs the author's visual check.
- Is "Rabbit" legible enough against the shader's red areas with the current dark text-shadow, or does it need a stronger treatment? (Spec says report rather than change the colour.)
- The "Fall in" label is a placeholder â€” what does the CTA do next (route to `/onboarding`, auth, age gate)? Nothing is wired yet.
- How should the entrance behave on repeat visits (skip the 3s sequence after the first time, or always play)? Currently it always plays.



---

## 2026-10-10 — Fix: Landing Title Jumped Down on "Fall in" Click

**Cause:** <main> was a flex column with justify-center, so the title and the button wrapper were centered together as one group. The settled timer (700ms after the click) unmounted the button wrapper, which re-centered the group and shifted the title down to true viewport center — a visible jump right after the crossfade started.

**Files touched:**
- src/app/globals.css (title and button wrapper taken out of the group flow: .rh-title now absolutely centered on its own (	op/left: 50%, 	ranslate(-50%, -50%)), .rh-fall-in absolutely positioned at a fixed offset below true center (	op: calc(50% + clamp(3rem, 9vw, 6rem)), left: 50%, 	ranslateX(-50%)); new .rh-exited rule fades the wrapper with opacity 0.6s + pointer-events: none, flipping isibility: hidden only after the fade via 	ransition: visibility 0s linear 0.6s)
- src/components/landing.tsx (<main> is now ixed inset-0 instead of a centered flex column; the button wrapper stays mounted and toggles an h-exited class instead of unmounting with an inline style; the settled timer now only unmounts the spotlight canvas)
- docs/design-theme.md (landing spec updated to match: title centered independently, button at fixed offset, click behavior fades + hides instead of unmounting)
- stage-files/stage-1-prototype.md (appended this log entry)

**How it was fixed:** The title is absolutely centered in the viewport independent of any sibling, and the button is absolutely positioned at a fixed offset below the 50% line, so nothing that mounts, unmounts, or changes class around them can move either one. On click the button stays in the DOM: pointer-events: none immediately, opacity fades over 0.6s, and isibility: hidden applies only after the fade completes (no unmount, no display: none while the crossfade runs). The shader layer and the spotlight fade-out are both fixed-position overlays and never participate in layout.

A defect found while verifying: the first placement of the .rh-exited rule came before the entrance opacity: 1 rule with equal specificity, so the button never actually faded (opacity stayed 1 and it just vanished when visibility flipped). Moved the .rh-exited block after the entrance rules so it wins the cascade.

**Result:** Measured getBoundingClientRect().top of the title before the click, mid-crossfade (250ms after), and after (2s after, past the spotlight unmount) at 1440x900 and 390x844: identical values at every step on both viewports (365.296875 desktop, 390.296875 mobile; horizontal center exact at 720/1440 and 195/390). Button computed style over the same steps: opacity 1 -> ~0.38 (mid-fade) -> 0, isibility flips to hidden only after the transition, pointer-events: none from the moment of click, element still in the DOM throughout. Write-on animation, hover spotlight, and crossfade unchanged; no console errors during the runs. 
pm run build passes.

**Open questions:** none for this fix — the earlier visual checks (swash clipping within the 0.3em mask padding, "Rabbit" legibility over the shader) still stand.

---

## 2026-10-10 — Persistent Shader Layout + Onboarding Pitch Restyle

**Prompt (summarized):** Move ownership of the WebGL shader out of the landing page and into the root layout via a client BackgroundProvider that renders one persistent ShaderBackground behind all pages and exposes all() from context (shader visible when the route is not "/" or after all(); landing click crossfades then pushes to /onboarding; returning to "/" resets to black; exactly one WebGL canvas across the navigation; fixed -z-10 wrapper). Rebuild /onboarding as 3 slides on a wine glass panel with exact new copy, a /signup placeholder on the same panel, progress dots, primary/quiet buttons, short opacity slide transition honouring reduced motion, and keyboard/visible focus rings. Check panel text legibility against the shader's brightest areas and raise panel opacity if needed. Verify with a headless browser; build; commit as "feat: persistent shader layout + onboarding pitch". Quiz, feed, chat, dashboard and firebase.ts explicitly untouched.

**Files touched:**
- src/components/background-provider.tsx (new, "use client": owns the single ShaderBackground in a fixed -z-10 wrapper; isible = fallen || pathname !== "/"; resets allen when the pathname becomes "/" during render (not in an effect, to satisfy the lint rule); exposes all(): Promise<void> that resolves after the 1.2s crossfade, or immediately under reduced motion)
- src/components/inline-script.tsx (new, the official Next helper for the landing boot script: 	ype="text/javascript" on the server, 	ext/plain on the client)
- src/app/layout.tsx (wrapped {children} in <BackgroundProvider>)
- src/app/page.tsx (boot script now rendered via InlineScript)
- src/app/globals.css (ody no longer sets g-background — it would paint over a negative-z canvas; html keeps it. Shader layer changed from a mount-time @keyframes fade to a persistent .rh-bg/.rh-bg-on opacity transition. Added .rh-glass, .rh-focus, .rh-primary-btn, .rh-quiet, .rh-dot, .rh-slide styles; reveal animations replaced the CSS-opacity "rh-begin" trick with @keyframes rh-reveal ... forwards so the entrance replays on soft-nav returns; exit rules gained nimation: none)
- src/components/landing.tsx (no longer imports/mounts ShaderBackground; click now calls all() then outer.push("/onboarding"))
- src/app/onboarding/page.tsx (rebuilt: 3-slide glass pitch with the exact copy, dots, primary "Next"/"Get started", quiet "Back"/"Skip", keyed slide fade, focus rings; final button and Skip route to /signup)
- src/app/signup/page.tsx (new placeholder glass panel: "Sign up is coming next")
- docs/design-theme.md (documented the persistent-shader model, the body-background caveat, and the onboarding/signup panel spec incl. the legibility numbers)
- stage-files/stage-1-prototype.md (appended this entry)

**Why:**
- Moving the shader into the root layout makes it a single, long-lived WebGL context that survives navigation, so the landing-to-onboarding transition doesn't tear down and rebuild a canvas, and every screen shares the same animated backdrop.
- The -z-10 fixed wrapper keeps pages (which sit at z-10/in-flow) above the shader; this required moving the black background to html only, since a ody background would paint over a negative-z canvas.
- The onboarding panel needed a legibility pass: the shader palette reaches near-white cream, which a 70%-opacity wine panel couldn't mask.

**Result:**
- Headless-Edge verification (playwright-core, installed --no-save and removed after): exactly ONE WebGL canvas at every step — landing, mid-crossfade, /onboarding, /signup, direct-load /onboarding, and mobile landing?onboarding; title getBoundingClientRect().top unchanged across the click (365.296875); crossfade measured mid-transition (bgOpacity ~0.68–0.70); returning to "/" drives bgOpacity back to 0 (black reset); opening /onboarding directly shows the shader at full opacity immediately.
- Onboarding: all 3 slides advance at 1440px and 390px; Back and progress dots work; "Get started" and Skip route to /signup; pixel sampling confirmed the shader renders behind the panel (red/cream corners) and back-to-landing is uniformly #030303.
- Legibility: body-text (peach) contrast over the shader's brightest sampled areas improved from 4.02:1 (70% panel — below AA) to 5.63:1 at 80%; white headline 10.46:1.
- Accessibility: keyboard Tab focuses the CTA with a visible peach focus ring and Enter activates it (navigates to /onboarding); the primary button shows a 2px peach :focus-visible outline; under prefers-reduced-motion the title has mask-image: none, the button is immediately visible, and the shader crossfade is skipped.
- 
pm run build passes (8 static routes including /signup); ESLint clean on all touched files.

**Open questions:**
- "Skip" on onboarding was implemented as a route to /signup (same destination as "Get started"); confirm that's the intent.
- The persistent shader keeps rendering (time-animated) even while hidden on "/" (opacity 0) — acceptable for the prototype, but a pause-when-hidden optimization could be added later without touching the uniforms.
- The old onboarding linked onward to /quiz; the new copy routes to /signup instead, so /quiz is currently only reachable by URL until the signup flow lands.
- A React dev-only console notice about a rendered <script> (no functional impact; the documented InlineScript helper is already in use).

---

## 2026-10-10 — Perf: Smoother Landing-to-Onboarding Transition

**Prompt (summarized):** The "Fall in" click-to-/onboarding transition felt slightly laggy. Suspected causes: (1) shader compiles on the main thread at the click, (2) /onboarding isn't prefetched so the push waits on the route, (3) title and onboarding panel hard-cut at navigation. Confirm by measuring first (PerformanceObserver longtask + frame gaps from click until /onboarding is painted, headless browser), then fix: prefetch /onboarding on landing mount; warm the shader by mounting it (still one canvas, still owned by BackgroundProvider) at opacity 0 once the reveal has finished and the browser is idle (requestIdleCallback with timeout fallback); choreograph the click (button fade, 1.2s crossfade with cubic-bezier(0.22,1,0.36,1), title fade-out + scale 1->0.98 over 0.5s starting 0.7s in, router.push at crossfade end, panel enter opacity 0->1 + translateY 12px->0 over 0.6s); animate only opacity/transform; keep reduced-motion instant; keep title-rect stability; also verify against a production build. Commit as "perf: smoother landing to onboarding transition".

**Measurements (before changing anything; 1440x900, headless Edge, click-to-painted-/onboarding):**
- BEFORE dev (fresh server): clickToPaint 2897ms, longtasks during click: 0, max frame gap 33ms, title computed opacity at t+1s: 1 (no exit animation -> hard cut at the 1250ms push), WebGL canvases 1, title top stable.
- BEFORE prod: clickToPaint 1467ms (~217ms above the 1250ms choreography — the un-prefetched route fetch), longtasks 0, max gap 17ms, title opacity at t+1s: 1.
- Cause verdicts: (1) REFUTED — the persistent provider already mounts/compiles the shader at page load; zero longtasks during the click in dev and prod. (2) REAL — dev +~1650ms (on-demand route compile wait, 2897 total), prod +~217ms (un-prefetched RSC fetch). (3) REAL — title still opacity 1 at t+1s and unmounts abruptly at the push; the panel mounted with no enter animation.

**Files touched:**
- src/components/background-provider.tsx (added a sticky warmed state and a warm() on the context; the shader canvas now mounts only when warmed || pathname !== "/" (still exactly one canvas; on non-landing routes it mounts immediately since it must be visible); all() also sets warmed so a click before the warm edge case still mounts + crossfades correctly)
- src/components/landing.tsx (prefetches /onboarding on mount; after the entrance reveal finishes (rh-begin + 3.6s) calls warm() via requestIdleCallback (2s timeout) with a setTimeout fallback, so shader compilation happens before the click and not during the write-on; title gains an h-title-out class on click)
- src/app/globals.css (crossfade now cubic-bezier(0.22,1,0.36,1); new h-title-out (opacity to 0 + scale 0.98, 0.5s starting 0.7s in, forwards) and h-panel-in (opacity 0->1 + translateY 12px->0, 0.6s) keyframes — opacity/transform only; reduced-motion disables both)
- src/app/onboarding/page.tsx, src/app/signup/page.tsx (panels get h-panel-in)
- docs/design-theme.md (click/choreography spec updated to as-built)
- stage-files/stage-1-prototype.md (appended this entry)

**Result (after):**
- AFTER dev (fresh server): clickToPaint 1563ms (was 2897 — the dev route-compile wait is gone because the prefetch compiles the route during idle), longtasks 0, max gap 17ms, title opacity at t+1s: 0.18 (fading smoothly), WebGL canvases 1, title top 365.296875 before/mid-click.
- AFTER prod: clickToPaint 1379ms (was 1467; the remaining ~130ms over the 1250ms choreography is playwright click latency + paint frames), longtasks 0, gaps>32ms: 0, title opacity at t+1s: 0.25, WebGL canvases 1, title top stable.
- Regression checks (prod build): back-navigation to "/" still resets to black (bgOpacity 0) and the write-on replays (mask gradient ends at 112%/120% = fully revealed; button replays 0->1); the onboarding panel enters with h-panel-in; mobile 390px: WebGL canvases 1 pre/mid/post-click, title top 390.296875 unchanged; reduced motion: button immediately visible, mask-image none, click->/onboarding in 130ms, panelAnim none, everything instant.
- A build-breaking TS detail was caught and fixed: "requestIdleCallback" in window narrows window to 
ever in the else branch (lib.dom declares it), so the idle warm uses 	ypeof window.requestIdleCallback === "function" instead.
- 
pm run build passes; ESLint clean on all touched files. One transient test flake (a waitForURL timeout in a scripted mobile run) did not reproduce in isolation or on re-run.

**Open questions:**
- The warmed shader still renders at 60fps while hidden at opacity 0 on "/" (now only after the entrance + idle, but continuously thereafter) — a pause-when-hidden optimization remains possible without touching the uniforms.
- Prod clickToPaint still carries ~130ms of measurement/playwright overhead on top of the 1250ms choreography; a real-user trace (Chrome DevTools on device) would confirm how much of that survives outside the harness.

---

## 2026-10-10 — Sign-up / Log-in UI with Fake Auth Layer

**Prompt (summarized):** Build /signup (sign up + log in) on a swappable fake auth layer in src/lib/auth/ (AuthService interface: signUpWithEmail, signInWithEmail, signInWithGoogle, signOut, onAuthChange; fake implementation storing only { uid, email, createdAt } in localStorage under one key, never storing or logging the password, ~400ms latency, Google -> demo user, prominent DEV ONLY - replace with Firebase banner; AuthProvider + useAuth() mounted in the root layout without breaking the persistent shader). /signup on the same glass panel as onboarding with a Sign up / Log in toggle (?mode=login), email + password (min 8, show/hide), Continue with Google above an "or" divider, sign-up-only required 18+ checkbox, correct autocomplete attributes, peach prototype note, chili solid primary button with loading state. Validation errors always pair an icon with a plain sentence in a readable light colour (not chili red), linked via aria-describedby and announced in an aria-live region: invalid email, short password, unchecked 18+, no-account/wrong-details on log-in. After success router.push("/basics"); /basics is a glass placeholder ("Tell us a bit about you - coming next") with a Sign out button, gated by a small RequireAuth wrapper; signed-in users opening /signup go to /basics. Keep exactly one WebGL canvas, existing transition behaviour, keyboard operability, visible focus rings, reduced-motion behaviour. Verify in a headless browser, run npm run build, log, commit as "feat: signup/login UI with fake auth". Quiz, feed, chat, dashboard and firebase.ts untouched; no Firebase API calls.

**Files touched:**
- src/lib/auth/auth-service.ts (new: AuthUser { uid, email, createdAt }, AuthError with codes, and the AuthService interface — the swap-in point for Firebase)
- src/lib/auth/fake-auth.ts (new: DEV ONLY banner implementation; single localStorage key abbit_hole_auth_user_v1; only { uid, email, createdAt } stored; password discarded via oid password — never stored/compared/logged; sign-up always succeeds, sign-in succeeds for a registered email and throws AuthError "invalid-credentials" for an unknown one; signInWithGoogle creates/reuses demo@rabbithole.test; 400ms fake latency on credential calls; onAuthChange emits the stored user on subscribe via queueMicrotask and on every change)
- src/lib/auth/auth-context.tsx (new: AuthProvider + useAuth() exposing user, loading, and the four actions; state flows through fakeAuth.onAuthChange so there is one source of truth)
- src/components/require-auth.tsx (new: small RequireAuth wrapper — redirects to /signup via router.replace once auth resolves and the user is null; renders nothing while loading)
- src/app/layout.tsx (AuthProvider mounted inside BackgroundProvider so the single persistent shader canvas and its warm/fall logic are untouched)
- src/app/signup/page.tsx (rebuilt: async server page reading wait searchParams -> isLogin prop; awaiting searchParams makes /signup dynamically rendered (ƒ) — the rest of the app stays static)
- src/app/signup/signup-form.tsx (new client form: tab toggle via Links to /signup and /signup?mode=login with aria-current; "Continue with Google" above an "or" divider; email + password fields with autocomplete email + new-password/current-password; show/hide password button (aria-pressed, Eye/EyeOff lucide icons — already a dependency); sign-up-only required 18+ checkbox; chili solid primary submit with disabled+renamed loading state and aria-busy; peach prototype note; signed-in users are redirected to /basics; validation on submit focuses the first invalid field)
- src/app/basics/page.tsx (new: RequireAuth-gated placeholder)
- src/app/basics/basics-panel.tsx (new: glass panel "Tell us a bit about you - coming next", "Signed in as {email}", Sign out button)
- src/app/globals.css (new classes: .rh-tab/.rh-tab-active toggle pills, .rh-alt-btn bordered secondary button, .rh-or divider, .rh-label, .rh-input (+ aria-invalid peach border, placeholder, focus ring), .rh-password-wrap/.rh-show-btn, .rh-error (light cream #ffe9e3 + peach TriangleAlert icon — not chili red), .rh-check (accent-color), .rh-note; .rh-primary-btn/.rh-alt-btn disabled states)
- docs/design-theme.md (replaced the stale "/signup placeholder" sentence; added a "Sign-up / log-in + fake auth (as built)" section)
- stage-files/stage-1-prototype.md (appended this entry)

**Why:**
- The AuthService interface + one export to swap (akeAuth) means Firebase can replace the fake without touching the provider, the form, or /basics.
- The password is deliberately never stored or compared (it is discarded), so the fake cannot leak credentials and the "wrong details" log-in case is driven by unknown-email instead.
- Validation follows the theme's a11y rule: every error pairs an icon with a plain sentence in a readable light colour on the dark panel — never colour alone, never chili-red text.
- AuthProvider sits inside BackgroundProvider (not around it) so the shader's mount/warm/visible logic and its single canvas are unchanged.

**Result:**
- ESLint clean on all touched files (including fake-auth's oid password discards; no setState-in-effect violations — the subscribe-time user emission is queued as a microtask inside fakeAuth.onAuthChange).
- 
pm run build passes: 10 routes; /signup renders dynamically (ƒ) because it awaits searchParams, /basics prerenders statically with the RequireAuth null shell (auth is client-only, so the panel mounts after hydration).
- Server-level verification (headless-browser verification was skipped per the author, who will check the screens personally): dev server SSR for /signup?mode=login contains "Welcome back" + utocomplete="current-password"; /signup contains "Create your account", 
ew-password, the Google button, and the 18+ checkbox; /onboarding is untouched. /basics returns 200 and intentionally renders no panel server-side (RequireAuth null until the client resolves auth). A stale 
ext start process from the previous session was found squatting on port 3000 (its built output predates this task and was serving the old placeholder); both servers were killed and port 3000/3001 confirmed free before building.
- Not yet browser-verified (deferred to the author): the four inline validation messages + aria-live announcements, sign-up -> /basics, reload persistence, sign-out redirect, /basics redirect when signed out, Google demo user, password absence in localStorage, canvas count 1 at 390px/1440px, keyboard operability.

**Open questions:**
- Interpretation call: "Email/password sign-in succeeds for any valid input" was implemented as "succeeds for any *registered* email" — an unknown email throws the invalid-credentials error, because that is the only way the required "no account found / wrong details" validation case can ever appear, and the fake cannot compare passwords it never stores. Confirm this reading.
- /signup is now dynamic (ƒ) via wait searchParams; acceptable for correctness (SSR renders the right mode), but it could be made static again with a client-side useSearchParams + Suspense pattern like /chat if preferred.
- The RequireAuth shell is blank while loading on hard loads of /basics (auth resolves client-side after hydration); a branded loading shell could replace null later.
- Firebase swap will need an email-already-in-use error code added to AuthErrorCode when real rules exist.

---

## 2026-10-11 - Fix: Remove Inline Script Dev Warning

**Prompt (summarized):** Remove the dev-only React console warning "Encountered a script tag while rendering React component" without changing any behaviour. The inline pre-paint landing script was rendered inside page-level components, so React warned whenever the landing page re-rendered on the client (e.g. back-navigation to "/"). Fix by moving the script into the root layout (rendered once, server-side), guarding it inside the script so it only acts when location.pathname === "/", and removing the script from the page/client components. The write-on animation, reduced-motion handling, mask-support fallback, back-nav replay and title position must all behave exactly as before. Only if the layout approach cannot fully remove the warning, fall back to 
ext/script with strategy="beforeInteractive" and say so. Verify in dev (notice gone on first load, landing -> onboarding -> back, hard reload) and in a production build (landing animation, back-nav replay, reduced-motion). Commit as "fix: remove inline script dev warning".

**Cause:** the boot script shipped inside src/app/page.tsx (and was rendered through the InlineScript helper, src/components/inline-script.tsx, as a component-level child). On hard loads the script executes from server HTML and is fine, but on any client-side re-render of the landing page - notably browser back-navigation to "/", which re-renders the page component without a full document load - React renders a <script> element it will not execute, producing the warning. The root layout does not re-render during navigation, so hosting the script there removes the client render path entirely.

**Files touched:**
- src/app/layout.tsx (added the boot script as a literal <script dangerouslySetInnerHTML> inside <head>, with if(location.pathname!=="/")return; as the first guard inside the IIFE; suppressHydrationWarning already present on <html> covers the class change the script makes)
- src/app/page.tsx (removed the boot script and the InlineScript usage; now just renders <Landing />)
- src/components/inline-script.tsx (deleted - no longer needed once the script is a literal element in the layout, and nothing else imported it)

**How it was fixed:** the script moved from page scope to the root layout's <head>. The layout is rendered once on the server and is not re-rendered on client navigation, so React never re-renders a <script> element on the client and the warning cannot fire. To keep behaviour identical off the landing route, the script now returns immediately unless location.pathname === "/", so it only adds the h-anim/h-anim-fade class and later h-begin on the landing page, exactly as before. Everything else (the class names, the reduced-motion early return, the mask-support check, the document.fonts.ready -> h-begin timing, the try/catch) is byte-for-byte the original logic plus the pathname guard. 
ext/script with eforeInteractive was NOT needed - the plain layout approach is sufficient.

**Result:**
- 
pm run build passes with the same route table (/ static, /signup dynamic, others static) and ESLint clean on the touched files.
- Inspected the built .next/server/app/index.html: the boot script is present inside <head> (renders once, server-side, before the body paints), carries the location.pathname !== "/" guard, and appears in every route's HTML the same way the layout renders it (the guard makes it a no-op off "/"). The warning class of bug - React re-rendering a <script> on the client - is gone because no page renders the script any more.
- Behaviour preservation (write-on animation, reduced-motion handling, mask fallback, back-nav replay, title position) rests on the unchanged script body, unchanged landing component/CSS, and the layout guard; a full interactive pass (first load -> landing -> onboarding -> back -> hard reload, and a production-build replay of the animation and reduced-motion) was not executed here - the author will confirm the screens.
- package.json / package-lock.json are unchanged (the temporary browser-automation dependency used for the check was installed with --no-save and removed before building; both files show an empty diff).

**Open questions:**
- Interactive verification of the animation/replay/reduced-motion was deferred to the author per instruction, so the no-warning claim is backed by code inspection and the built-HTML check rather than an observed browser console; worth a quick manual confirmation when convenient.
- None for the fix itself.

---

## 2026-10-11 - Move Git Remote to Aryaman-rot/rabbit-hole

**What changed:** the origin remote URL was repointed from https://github.com/sudhendrak04/FWB-only-app.git (old) to https://github.com/Aryaman-rot/rabbit-hole.git (new), and a "Git" section was added to AGENTS.md recording the remote, the working branch, the commit-then-push convention, and the no-force-push / stop-on-auth-error rules. No code was touched and nothing was changed on the old remote.

**Why:** the previous session's commits had been going to a different account's repository (sudhendrak04/FWB-only-app), which was never the intended destination for this project. The seven commits from 770202 onward were local-only; this session pushed the full history to the correct repository.

**Old remote:** https://github.com/sudhendrak04/FWB-only-app.git
**New remote:** https://github.com/Aryaman-rot/rabbit-hole.git

---

## 2026-10-11 - Landing Reveal Fix + /basics Onboarding Step with Fake Profile Store

**Prompt (summarized):** Two parts. (A) Fix a bug where the landing write-on reveal could show no title/button: the boot script in layout.tsx only runs on a hard load at /, so after a hard reload on /onboarding a browser-back to / left the reveal classes unset. Make the Landing client component set the same html classes itself on mount (idempotent, same logic as the boot script: reduced-motion check, mask-support check, document.fonts.ready then h-begin) without changing the animation, title position or back-nav replay. (B) Rebuild /basics as a 3-step onboarding wizard on the existing glass panel (wine ~80%, blur, max-w-md) with progress dots, Back/Next, per-step validation, native fieldset/legend/label semantics, chip-style radio/checkbox buttons (selected = peach fill with wine text), visible focus rings, keyboard operability and prefers-reduced-motion support; errors always pair an icon with a plain sentence in light cream, linked via ria-describedby and announced in an ria-live region. Step 1 "About you" (first name, date of birth, I am), Step 2 "Who you'd like to meet" (Show me multi-select, age range 18-60 defaulting to age -/+ 5 clamped, city with a "Somewhere else" note), Step 3 "What you're looking for" (intent + required consent). Age gate at submit: under 18 saves nothing, shows the 18+ notice, signs out, and links back to /; impossible dates (future or older than 99) are rejected. Profile storage in src/lib/profile/ (profile-types.ts, profile-service.ts interface, ake-profile.ts with a DEV ONLY banner) keyed h:profile:<uid>, storing only the ten specified fields; prefill when a profile exists; on save push /quiz; keep the RequireAuth wrapper on /basics. Verify against a production build only, on port 3100. Commit Part A separately, then Part B as "feat: basics step with fake profile store" and push.

**Files touched (Part A):**
- src/components/landing.tsx (one line: the nimated flag is now just !reduce instead of !reduce && !root.classList.contains(animClass), so the component always (idempotently) adds the anim class and always runs the h-begin step on mount)

**Files touched (Part B):**
- src/lib/profile/profile-types.ts (new: Gender, InterestedIn, Intent, City unions, the Profile interface with exactly the ten fields, option lists, AGE_MIN_ALLOWED/AGE_MAX_ALLOWED, CITY_OUTSIDE_NOTE)
- src/lib/profile/profile-service.ts (new: ProfileService interface with getProfile(uid) and saveProfile(uid, profile) - the Firestore swap point)
- src/lib/profile/fake-profile.ts (new: DEV ONLY banner; per-user localStorage key h:profile:<uid>; runtime type guard that rebuilds a Profile from unknown JSON and rejects anything malformed; saveProfile writes a fixed-shape object so no extra fields can leak in; 300ms fake latency)
- src/app/basics/page.tsx (now a client component: owns geBlocked state, renders RequireAuth allowSignedOut={ageBlocked} with either BasicsWizard or AgeBlockedNotice)
- src/app/basics/basics-panel.tsx (rewritten: BasicsWizard + AgeBlockedNotice; three steps with keyed h-slide fade, dots, Back/Next, chip radios/checkboxes, age-range selects with age-derived defaults, "Somewhere else" note, per-step validation, age gate, save then outer.push("/quiz"))
- src/components/require-auth.tsx (added an optional llowSignedOut prop so a child can keep rendering after signing the user out on purpose - required for the age-gate notice to survive its own signOut())
- src/app/globals.css (chip styles: .rh-chip-input visually-hidden native input, .rh-chip, .rh-chip-selected peach fill + wine text, and .rh-chip-input:focus-visible + .rh-chip peach focus ring)
- stage-files/stage-1-prototype.md (appended this entry)

**Why:**
- Part A: the reveal depended on the boot script having run. With the script guarded to /, a client-side navigation into / (browser-back after a reload elsewhere) had no classes; the old code only added h-begin when it had *just* added the anim class, so a pre-existing class (or React StrictMode's double-invoke) skipped the h-begin step entirely and left the title/button hidden. Making both steps idempotent removes the dependency on the script and on mount ordering, with no change to the CSS animation, the absolute title positioning, or the back-nav replay.
- Part B: the fake profile service mirrors the auth fakes (interface + swappable export + DEV ONLY banner), so Firestore can replace it without touching the wizard; the storage contract stores only the ten specified fields to keep the prototype honest about what a real backend would receive.
- llowSignedOut exists purely because the age gate must sign the user out *and* keep showing its notice; without it RequireAuth would immediately redirect to /signup and the notice would never be seen.

**Result (production build, port 3100, headless Edge):**
- 
pm run build passes; route table unchanged (/basics static, /signup dynamic). ESLint clean on all touched files.
- Validation messages all appear: step 1 empty (first name / date of birth / gender), invalid first name 123, future date, date older than 99, step 2 empty (Show me / city), lowest-age-above-highest, step 3 empty (intent / consent). Each pairs the TriangleAlert icon with a plain sentence and is wired through ria-describedby into the sr-only ria-live region.
- Valid submit lands on /quiz. The stored profile has exactly the keys geMax, ageMin, birthDate, city, consentAt, firstName, gender, intent, interestedIn, schemaVersion under a single h:profile:<uid> key, with no email present.
- Reload prefill verified across all three steps after a full page load: name "Meera", DOB 1994-03-02, gender Woman, "Show me" Women + Non-binary people, city Thane, age range 27-37, intent "Seeing where it goes".
- Age gate verified: a 2012 birth date shows "You need to be 18 or older to use Rabbit Hole" with a link to /, writes NO h:profile: key, and clears the auth user from localStorage.
- Age defaults derived from DOB (born 1996 -> 25-35) and clamped to 18-60; the "Somewhere else" note renders and still allows continuing.
- WebGL canvas count is exactly 1 on /basics at 1440x900 and at 390x844, and still 1 after submitting to /quiz. Chip focus ring measures a 2px peach (rgb(255,168,150)) outline. No page errors in any run.
- Cleanup: only the PID this session started (the 
pm start -- -p 3100 tree) was stopped; ports 3100, 3000 and 3001 are all free, unrelated node processes (Adobe, an Electron app) were left alone, and package.json / package-lock.json show an empty diff after removing the temporary --no-save browser dependency.

**Open questions:**
- The consent checkbox is intentionally NOT restored from a saved profile (only the consentAt timestamp is stored), so resubmitting requires re-ticking it; flag if the product would rather remember the tick.
- The age gate lives in the wizard rather than at the auth layer, so an under-18 account is still created by the fake sign-up first (then immediately signed out and not saved anywhere). When Firebase lands, the age check should ideally move server-side.
- irstName accepts letters/spaces/hyphens/apostrophes up to 30 characters via a Unicode regex; no profanity or name-policy checks exist yet.
