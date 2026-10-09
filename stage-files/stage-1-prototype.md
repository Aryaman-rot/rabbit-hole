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


