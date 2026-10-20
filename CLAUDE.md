# Apporine website: instructions for Claude Code

## What this is
The official website of Apporine, an enterprise product company. Phase 1 is the homepage hero only (navigation bar + 3 slide video hero). Later phases add more sections and pages.

## Read these first, in order
1. `_brief/docs/01-tech-stack.md`: the locked technology stack
2. `_brief/docs/02-hero-spec.md`: exact layout, typography, behaviour and acceptance checklist
3. `_brief/docs/03-content.md`: the exact hero copy. Use it word for word
4. `_brief/docs/04-design-tokens.css`: colours, fonts, motion, radius
5. `_brief/docs/05-navigation-spec.md` and `06-navigation-content.md`: the navigation and its exact copy (these replace the Navigation section of 03-content.md)

## Assets
- Videos and posters: `_brief/assets/videos/` (copy into `public/videos/`)
- Logo, the Falcon: `_brief/assets/brand/falcon/`: falcon-clean.png and wordmark-o.png (1x, 2x, 3x), copied to `public/brand/`. Never use the old falcon.png files (dark fringe). `wordmark-full-reference.png` is reference only, never placed on the site. Favicon and app icons live in `app/` and `public/brand/icon-*.png`.

## Non negotiable rules
- Use only the colours in the design tokens. No blue, no orange, no gradients except the readability scrim defined in the spec.
- Fonts: Bricolage Grotesque (headlines), Instrument Serif Italic (one accent word), Instrument Sans (text and buttons), IBM Plex Mono (eyebrows and labels). Load with next/font/google.
- Copy must match `03-content.md` exactly, with curly apostrophes. Never invent claims, statistics, customer logos or locations.
- No city or office location anywhere on the site.
- Accessibility WCAG 2.2 AA, reduced motion respected.
- TypeScript strict. Components small and named clearly. No unused code.
- Keep `_brief/` in the repository as the source of truth, but exclude it from the build.

## Navigation
- `components/site-header.tsx` (in the root layout, so it is on every page): the Imperial Plum glass capsule. From 1280px: Falcon, five centred items opening mega panels (`components/nav/mega-panel.tsx`, feature film card on the left), the light seam, Talk to us and Start building. Under 1280px: Falcon and Menu, opening the full screen accordion (`components/nav/mobile-menu.tsx`). It hides on scroll down and returns on scroll up.
- Logo: `components/nav/nav-logo.tsx`. The hover and focus reveal (lift, light sweep, letters one by one, the ring O image) is plain CSS in `app/globals.css` (“Navigation logo”). The word sits in the capsule’s left column, so nothing else moves.
- Panel content is typed data in `lib/navigation.ts`, word for word from 06-navigation-content.md. Edit the copy there, not in components.
- Capsule placement is in `components/nav/styles.ts`: the Falcon always lands on the hero side margin (`components/layout.ts`).

## Routes and the coming soon template
- Every path is in `lib/routes.ts` (`routes`, `anchors`). Link to pages through it, never with a hard coded string.
- Pages not built yet are listed in `comingSoonPages` with their title name. Each has a small `app/<path>/page.tsx` rendering `components/coming-soon.tsx` (monolith poster at 35%, Falcon eyebrow, “This page is being engineered *pristine.*”, Back to home), titled “<name> · Apporine”.
- To build a real page: replace its `app/<path>/page.tsx` and remove its entry from `comingSoonPages`. The navigation needs no change. Unknown paths return a real 404.
- The five "Latest from Apporine" destinations (Relyxus, Orion, the cost of problems insight, Trust, Careers) use the story page template, `components/story-page.tsx` (spec 09-latest-section-spec.md section 8). Their content is in `lib/latest.ts`, which also feeds the homepage mosaic (`components/home/latest/`).

## Commands
- `npm run dev`: local development at http://localhost:3000
- `npm run build`: production build (must pass before any deploy)
- `npm run lint`: lint

## Project structure (target)
```
app/
  layout.tsx        fonts, metadata, global styles
  page.tsx          homepage (hero for now)
  globals.css       tokens + base styles
components/
  site-header.tsx   navigation capsule, panels, seam
  nav/              logo, mega panel, feature card, mobile menu
  coming-soon.tsx   placeholder page template
  hero/hero-carousel.tsx
  hero/hero-slide.tsx
  hero/hero-controls.tsx
  hero/slides.ts    slide data from 03-content.md
  brand-marks.tsx   Falcon and ring O images (next/image)
lib/
  routes.ts         every page path
  navigation.ts     navigation content
public/videos/      hero videos and posters
```
