# Section: Latest from Apporine (the Living Mosaic)

This section sits directly below the hero. It REPLACES the current "conviction" section. Everything here is locked.

## 1. Content (use word for word, curly apostrophes, no hyphens in visible text)
- Eyebrow: LATEST FROM APPORINE
- Headline: What we’re building *now.* (now. in Instrument Serif Italic, citrine)
- Top right link: All news and insights → /insights

| # | Category | Heading | Description (shown on hover) | Link text | Destination |
| --- | --- | --- | --- | --- | --- |
| 1 | ANNOUNCEMENT | Introducing Relyxus | AI incident response that finds the cause and resolves the incident within the approvals you set. | Read more | /products/relyxus |
| 2 | IN DEVELOPMENT | Orion is taking shape | Our next product, engineered to the same pristine standard. | Read more | /products/orion |
| 3 | PERSPECTIVE | The cost of the problems you’ve learned to live with | Every enterprise carries losses it no longer notices. Here is how to find them, and what to do about them. | Read more | /insights/the-cost-of-the-problems-youve-learned-to-live-with |
| 4 | TRUST | Built to be examined | Our security principles, controls and assurance roadmap, open to your scrutiny. | Read more | /trust |
| 5 | CAREERS | Build what tomorrow runs on | Join the team engineering products for the world’s most demanding industries. | Read more | /careers |

## 2. Media (already processed, copy into public/videos/latest/)
| Card | Still image (poster) | Film | Focal point (object-position) |
| --- | --- | --- | --- |
| 1 | latest-01-relyxus-poster.webp | latest-01-relyxus.webm / .mp4 | 65% 50% (the citrine light) |
| 2 | latest-02-orion-poster.webp | latest-02-orion.webm / .mp4 | 55% 35% (the constellation) |
| 3 | latest-03-perspective-poster.webp | latest-03-perspective.webm / .mp4 | 50% 50% |
| 4 | latest-04-trust-poster.webp | latest-04-trust.webm / .mp4 | 45% 50% (the pavilion) |
| 5 | latest-05-careers-poster.webp | latest-05-careers.webm / .mp4 | 50% 55% |
Each poster is the exact first frame of its film, so there is no visual jump when the film starts.

## 3. Layout (desktop, 1024px and wider)
- Background: Ink, #0B0A0D (add as --ink in the tokens). This section must not be purple.
- Same fluid side margin as the hero: clamp(24px, 8vw, 160px). Padding top and bottom clamp(96px, 10vw, 160px).
- Header row: eyebrow and headline on the left; "All news and insights →" link aligned to the bottom right of the headline (Instrument Sans 500, 15px, var(--plum-200), hover var(--plum-50) with the citrine light seam underline).
- Headline: Bricolage Grotesque 800, wdth 75, opsz 96, uppercase, clamp(40px, 5.6vw, 84px), line height 0.92, var(--plum-50).
- Mosaic: 48px below the header. A single row of 5 cards, height 560px, gap 12px, using flex.
- Default state: card 1 is open (flex-grow 2.6); the other four are narrow (flex-grow 1).
- When the pointer enters any card (or it receives keyboard focus), that card opens to flex-grow 2.6 and all others become flex-grow 1. When the pointer leaves the whole mosaic, card 1 opens again. Transition: flex-grow 600ms var(--ease-brand).

## 4. Card anatomy
- Radius 20px, overflow hidden, 1px border rgba(201,179,222,0.14), background #0B0A0D.
- The whole card is one link (<a>) to its destination. Clicking anywhere on the card opens the page. No buttons inside cards.
- Layer 1, still image: the poster, object-fit cover, focal point as in the media table. A very slow zoom on the still (scale 1 to 1.06 over 12s, alternate, infinite) keeps it alive. Disabled for reduced motion.
- Layer 2, film: the video element sits above the still, opacity 0. It plays only while its card is open (hovered, focused, or card 1 in the default state) and the section is in view. When it starts: opacity 0 to 1 over 500ms. When the card closes: opacity back to 0 over 300ms, then pause and reset to 0. Videos are muted, playsInline, loop, preload="none" until the section is near the viewport, then preload="metadata".
- Layer 3, readability gradient: linear-gradient(0deg, rgba(11,10,13,0.92) 0%, rgba(11,10,13,0.55) 40%, rgba(11,10,13,0) 70%).
- Layer 4, the citrine line: a 2px line in var(--citrine) with a soft glow along the top edge of the card, drawing from left to right (scaleX 0 to 1, 500ms) when the card opens.
- Layer 5, text block at the bottom, padding 28px:
  - Category: IBM Plex Mono 500, 11px, letter spacing 0.16em, uppercase, var(--plum-200). Always visible.
  - Heading: Instrument Sans 600. Narrow card: 17px, line height 1.3, max 4 lines. Open card: 24px, line height 1.25. Font size transitions 400ms. Always visible.
  - Description: Instrument Sans 400, 15px, line height 1.55, var(--plum-100), max width 28rem. Only on the open card: it reveals with opacity 0 to 1 and translateY 12px to 0, 450ms, starting 200ms after the card begins to open. Hidden (and not focusable) on narrow cards.
  - "Read more →": text only, NOT a button. Instrument Sans 600, 15px, var(--citrine). Appears 100ms after the description with the same animation. On card hover the arrow slides 4px to the right. Only on the open card.
- Narrow cards never show the description or Read more, so they stay clean.

## 5. Tablet (768 to 1023px)
- Grid instead of the expanding row: card 1 spans the full width (height 440px), the other four sit in a 2 by 2 grid (height 360px). Each card shows category, heading, description and Read more at all times. Films play on hover for pointer devices only.

## 6. Mobile (under 768px)
- A horizontal row of cards that scrolls with snap points, each card 82% of the screen width and 480px tall, so the next card peeks in. Each card shows category, heading, description and Read more at all times. Still images only, no films (saves data and battery). Tap anywhere on a card to open its page.

## 7. Accessibility
- Each card is a single link whose accessible name is the heading, followed by the category (for example "Introducing Relyxus, Announcement").
- Keyboard: Tab moves through the cards; the focused card opens exactly as on hover; Enter opens the page. Visible 3px citrine focus ring with 4px offset, following the card radius.
- prefers-reduced-motion: no zoom on stills, no films, no flex animation (open state changes instantly), text appears with a 150ms fade.
- Contrast: all text meets 4.5:1 against the gradient.

## 8. Card destination pages
Create a reusable "story page" template and use it for the three destinations that do not have their own pages yet:
- /insights/the-cost-of-the-problems-youve-learned-to-live-with
- /trust (replaces its coming soon page)
- /careers (replaces its coming soon page)
For /products/relyxus and /products/orion, use the same template too, replacing their coming soon pages.

Story page template:
- Full width film banner, 70vh, using that card's film (poster first, then play muted, loop; reduced motion shows the poster), with the readability gradient.
- On the banner, aligned to the hero side margin: the Falcon eyebrow with the card's category, the heading as an H1 (Bricolage Grotesque, hero style, clamp(44px, 6vw, 96px)), and the description as the lead paragraph.
- Below the banner on Ivory (#F7F4EE, add as --ivory), a centred reading column of max width 44rem with the note: "The full story is being written to our pristine standard. It will be published here soon." in Instrument Sans 18px, colour #4A3456, then two links: "Back to home" and "Talk to us" (/contact).
- Page title: "[Heading] · Apporine". Meta description: the card description.
- Keep all page content in one data file (lib/latest.ts) so each page can later be expanded with full content without changing the template.

## 9. Acceptance checklist
- [ ] The section appears directly below the hero and the old conviction section is removed.
- [ ] Background is Ink (#0B0A0D), not purple.
- [ ] Card 1 is open by default; hovering any card opens it and narrows the rest smoothly; leaving the mosaic returns to card 1.
- [ ] On the open card only: the film fades in and plays, the citrine line draws, the description and "Read more →" (text, not a button) reveal.
- [ ] The whole card is clickable and leads to its page; all five pages load with their film banner.
- [ ] No visual jump between still and film.
- [ ] Tablet grid and mobile swipe row work, with stills only on mobile.
- [ ] Keyboard and reduced motion behave as specified.
- [ ] Copy matches this document exactly.
- [ ] Build and lint pass. Lighthouse accessibility 100 on desktop.
