# Hero section specification (build exactly this)

## 1. Structure
A full screen hero carousel with 3 slides. Each slide = background video + text block. Only one slide visible at a time. Navigation bar floats above the hero.

## 2. Size and layout
| Property | Desktop (1024px and up) | Tablet (768 to 1023px) | Mobile (under 768px) |
| --- | --- | --- | --- |
| Hero height | 100svh, minimum 720px | 100svh, minimum 680px | 100svh, minimum 640px |
| Side margin (hero text and hero controls; the navigation Falcon aligns to it) | no max width container; `padding-inline: clamp(24px, 8vw, 160px)` (about 154px at 1920px, 115px at 1440px) | same | 24px |
| Text widths | headline max `min(880px, 60vw)`; subheadline max 640px; paragraph max 34rem (about 65 characters) | same | 100% |
| Text block vertical position | vertically centred, shifted up by 4vh, below the nav (padding top 120px) | same | anchored to the bottom, padding bottom 120px (space for controls) |
| Text alignment | left | left | left |

The hero text and the hero controls use exactly the same side margin, and the navigation capsule is placed so its Falcon lands on it, so the Falcon, eyebrow, headline, paragraph, buttons and the “01 / 03” counter share one left edge. At this headline width the slide 1 headline breaks into 3 lines on desktop and tablet. (Note: `min(920px, 60vw)` was the requested value, but at 1440px and wider 920px fits “BUILDING WHAT TOMORROW’S” on one line and the headline drops to 2 lines; 880px keeps it at 3.)

## 3. Background video layer (per slide)
- `<video>` with `muted`, `playsInline`, `preload="metadata"`, `poster` set, no controls, `object-fit: cover`, `object-position: right center` on desktop, `center center` on mobile.
- Sources in order: WebM then MP4. Desktop files: `/videos/hero-0X-name.webm|mp4`. Mobile (viewport under 768px): `/videos/hero-0X-name-mobile.webm|mp4` and the mobile poster.
- The active slide's video plays from 0 when the slide becomes active. Inactive videos are paused and reset.
- Only the active and next slide load video. Others show posters only.
- Readability scrim on top of the video. Its strength is a property of each slide (`scrim` in `components/hero/slides.ts`).
  - Desktop and tablet (768px and up), left to right:
    - Slide 1: `linear-gradient(90deg, rgba(18,4,26,0.80) 0%, rgba(18,4,26,0.65) 45%, rgba(18,4,26,0.30) 60%, rgba(18,4,26,0) 72%)`
    - Slides 2 and 3: `linear-gradient(90deg, rgba(18,4,26,0.88) 0%, rgba(18,4,26,0.74) 45%, rgba(18,4,26,0.42) 60%, rgba(18,4,26,0) 78%)`
    - These are stronger than the first requested values (slide 1: 0.70 / 0.35 at 40% / 0 at 65%; slides 2 and 3: 0.82 / 0.55 at 40% / 0 at 70%), which left the right half of the paragraph below WCAG AA contrast at 1440×900 and 1280×800 (horizon glow on slide 1, bright closing frames on slides 2 and 3). The stronger values keep the subject clear on the right and pass 4.5:1 at every tested size and moment.
  - Mobile (under 768px), three layers over every video, top to bottom:
    - Top fade for the navigation: `linear-gradient(180deg, rgba(18,4,26,0.6) 0%, rgba(18,4,26,0) 20%)`
    - Bottom fade: `linear-gradient(0deg, rgba(18,4,26,0.92) 0%, rgba(18,4,26,0.55) 50%, rgba(18,4,26,0) 80%)`
    - Even overlay: `rgba(18,4,26,0.45)`; slide 3 `rgba(18,4,26,0.6)` because the wireframe bridge is very bright.
- Optional film grain: a tiled noise PNG at 3% opacity, `mix-blend-mode: overlay`, pointer events none.
- Slide 3 video is not delivered yet: show a plum gradient poster (`--plum-950` to `--plum-800`) until `hero-03-bridge` files exist.

## 4. Typography and spacing (top to bottom inside the text block)
| Element | Font | Size | Weight and settings | Line height | Letter spacing | Colour | Margin below |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Eyebrow | IBM Plex Mono | 12px | 500, uppercase | 1.3 | 0.18em | `--plum-300` | 28px |
| Eyebrow Falcon | Falcon PNG (`public/brand/falcon-clean*.png`, from assets/brand/falcon/) | 22px wide x 10px high, 10px gap before text | logo colours as supplied | | | | |
| Headline | Bricolage Grotesque | clamp(44px, 7vw, 100px) | 800, `font-variation-settings: "wdth" 75, "opsz" 96`, uppercase, max width `min(880px, 60vw)` from 768px | 0.9 | -0.015em | `--plum-50` | 28px |
| Headline accent word | Instrument Serif Italic | 1.05em of headline | 400, lowercase (text-transform none) | inherit | 0 | `--citrine` | |
| Subheadline (slide 3 only) | Instrument Sans | clamp(20px, 2vw, 28px) | 500, max width 640px, soft text shadow | 1.3 | -0.005em | `--plum-50`, accent word “tomorrow.” in Instrument Serif Italic, `--citrine` | 20px |
| Paragraph (768px and up) | Instrument Sans | clamp(16px, 1.25vw, 19px) | 400, max width 34rem, soft text shadow | 1.6 | 0 | `--plum-300` | 40px |
| Paragraph (mobile, under 768px) | Instrument Sans | 16px | 450, soft text shadow | 1.6 | 0 | `--plum-100` | 40px |

Soft text shadow (paragraph and subheadline only, must not read as a visible shadow): `text-shadow: 0 1px 24px rgba(18,4,26,0.8)`.
| Buttons row | | gap 12px, wrap | | | | | |

Headline semantics: slide 1 headline is the page `<h1>`. Slides 2 and 3 use `<h2>`.

## 5. Buttons
| | Primary | Secondary |
| --- | --- | --- |
| Shape | pill, radius 999px, height 52px, padding 0 28px | same |
| Text | Instrument Sans 600, 15px, letter spacing 0.01em, sentence case | same |
| Colours | background `--citrine`, text `--plum-800` | transparent, 1px border `--plum-600`, text `--plum-50` |
| Hover | background `--citrine-hover`; arrow → slides 4px right, 180ms | border `--plum-300` |
| Active | background `--citrine-pressed`, scale 0.98 | scale 0.98 |
| Focus visible | 3px outline `--citrine`, offset 3px | same |
| Icon | arrow → after the label in primary only | none |
| Mobile | full width, stacked, primary first | full width |

## 6. Carousel behaviour
- Auto advance: each slide shows for 8 seconds (matches the 8 second videos), then cross fades to the next. After slide 3 it returns to slide 1.
- Cross fade: video and background opacity transition 1200ms `--ease-brand`.
- Text exit: current text fades out over 300ms.
- Text enter (starts 200ms after the cross fade begins):
  1. Eyebrow fades in, 400ms.
  2. Headline: split by line; each line rises from a clipping mask (translateY 110% to 0), 700ms, 90ms stagger.
  3. Subheadline and paragraph: fade in and move up 16px, 500ms, start 350ms after headline.
  4. Buttons: fade in and up 16px, 500ms, start 500ms after headline.
- Pause auto advance while the browser tab is hidden, and when the user presses Pause.
- Keyboard: Left and Right arrow keys change slides when the hero has focus. Swipe left and right on touch devices.

## 7. Controls (bottom of hero)
- Position: bottom 40px (desktop), 24px (mobile), using the same side margin as the hero text (section 2).
- Left group: slide counter “01 / 03” in IBM Plex Mono 12px, `--plum-300`, then three progress bars, each 48px wide, 2px high, gap 8px, background rgba(251,249,252,0.2); the active bar fills with `--citrine` from 0 to 100% over 8 seconds; completed bars stay full until the cycle restarts.
- Clicking a bar jumps to that slide.
- Right group: Pause/Play button (44 x 44px circle, 1px border `--plum-600`, icon `--plum-50`), then Previous and Next buttons (same style). Accessible names: “Pause slideshow”, “Play slideshow”, “Previous slide”, “Next slide”.

## 8. Navigation (over the hero)
The navigation is specified in `05-navigation-spec.md` (Imperial Plum glass capsule, Falcon logo with the wordmark reveal, mega panels, full screen menu under 1280px). The capsule is placed so the Falcon sits exactly on the hero side margin (section 2) at every width.

## 9. Accessibility
- Region: `<section aria-roledescription="carousel" aria-label="Apporine highlights">`. Each slide `role="group" aria-roledescription="slide" aria-label="1 of 3"`.
- Inactive slides `aria-hidden="true"` and `inert`.
- Do not announce automatic changes. When the user changes slide manually, update an `aria-live="polite"` region with the slide headline.
- `prefers-reduced-motion: reduce`: no autoplay video (show posters), no auto advance, no line reveal (simple 200ms fades). Controls still work.
- Colour contrast as in the tokens; never place body text on bright video areas (the scrim handles this).

## 10. Performance
- The first slide poster is the LCP image: preload it with `fetchpriority="high"`.
- Fonts via next/font with `display: swap`, subset latin.
- Videos: only active and next slide request video; others poster only. `preload="metadata"`.
- No layout shift from fonts or controls.

## 11. Acceptance checklist
- [ ] Exact copy from 03-content.md, curly apostrophes, no hyphens in visible text.
- [ ] Headline in Bricolage Grotesque capitals with the italic citrine accent word.
- [ ] Videos play muted, cross fade every 8 seconds, loop the slide cycle.
- [ ] Mobile shows mobile videos and bottom anchored text.
- [ ] Pause button works; reduced motion respected.
- [ ] Keyboard and swipe navigation work.
- [ ] Lighthouse: performance 90+, accessibility 100 on desktop.
- [ ] No console errors. Builds and deploys on Vercel.
