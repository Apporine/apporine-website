# Apporine website: instructions for Claude Code

## What this is
The official website of Apporine, an enterprise product company. Phase 1 is the homepage hero only (navigation bar + 3 slide video hero). Later phases add more sections and pages.

## Read these first, in order
1. `_brief/docs/01-tech-stack.md`: the locked technology stack
2. `_brief/docs/02-hero-spec.md`: exact layout, typography, behaviour and acceptance checklist
3. `_brief/docs/03-content.md`: the exact copy. Use it word for word
4. `_brief/docs/04-design-tokens.css`: colours, fonts, motion, radius

## Assets
- Videos and posters: `_brief/assets/videos/` (copy into `public/videos/`)
- Gate mark logo: `_brief/assets/brand/gate-mark.svg`

## Non negotiable rules
- Use only the colours in the design tokens. No blue, no orange, no gradients except the readability scrim defined in the spec.
- Fonts: Bricolage Grotesque (headlines), Instrument Serif Italic (one accent word), Instrument Sans (text and buttons), IBM Plex Mono (eyebrows and labels). Load with next/font/google.
- Copy must match `03-content.md` exactly, with curly apostrophes. Never invent claims, statistics, customer logos or locations.
- No city or office location anywhere on the site.
- Accessibility WCAG 2.2 AA, reduced motion respected.
- TypeScript strict. Components small and named clearly. No unused code.
- Keep `_brief/` in the repository as the source of truth, but exclude it from the build.

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
  site-header.tsx
  hero/hero-carousel.tsx
  hero/hero-slide.tsx
  hero/hero-controls.tsx
  hero/slides.ts    slide data from 03-content.md
  icons/gate-mark.tsx
public/videos/      hero videos and posters
```
