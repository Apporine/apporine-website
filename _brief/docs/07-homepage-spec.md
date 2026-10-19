# Homepage specification (sections 3 to 13)

Sections 1 (navigation) and 2 (hero) are already built. Build sections 3 to 13 below them, in this order. Copy lives in 08-homepage-content.md and must be used word for word.

## Global system (applies to every section)

### Layout
- Side margin: the same fluid margin as the hero, padding-inline clamp(24px, 8vw, 160px) on desktop and 24px on phones, so every section's left edge lines up with the hero headline.
- Section vertical padding: clamp(96px, 12vw, 176px) top and bottom. Mobile: 88px.
- Max content width inside the margin: none for visuals; text blocks follow the widths given per section.

### Background rhythm
| Section | Background token |
| --- | --- |
| 3 Conviction | --plum-950 |
| 4 Two ways | --plum-50 (Pearl) |
| 5 Products | --plum-900 |
| 6 How we build | --plum-50 |
| 7 What we build | --plum-100 (Lilac Mist) |
| 8 Industries | --plum-950 |
| 9 Trust | --plum-800 with a blueprint grid |
| 10 People | --plum-50 |
| 11 Insights | --plum-100 |
| 12 Invitation | full bleed film |
| 13 Footer | --plum-950 |

### Typography (reuse the hero system)
| Element | Style |
| --- | --- |
| Eyebrow | IBM Plex Mono 500, 12px, letter spacing 0.18em, uppercase, preceded by the Falcon at 22px wide (falcon-clean). On dark: --plum-300. On light: --plum-600 |
| Section headline (H2) | Bricolage Grotesque 800, wdth 75, opsz 96, uppercase, clamp(40px, 5.6vw, 84px), line height 0.92, letter spacing -0.015em. On dark: --plum-50. On light: --plum-800 |
| Accent word | Instrument Serif Italic, lowercase, 1.05em. On dark: --citrine. On light: --orchid |
| Lead paragraph | Instrument Sans 400, clamp(17px, 1.35vw, 20px), line height 1.6, max width 36rem. On dark: --plum-300. On light: #4A3456 |
| Card title | Instrument Sans 600, 22px |
| Card body | Instrument Sans 400, 16px, line height 1.6 |
| Small labels | IBM Plex Mono 500, 11px, 0.16em, uppercase |
| Buttons | As the hero: primary citrine on dark; on light sections the primary button is --plum-800 with --citrine text; secondary is a transparent pill with a 1px border |

### Motion system
- Library: Motion (already installed). No other animation libraries.
- Default entrance for any block: opacity 0 to 1 and translateY 24px to 0, 700ms, var(--ease-brand), triggered once when 20% of the block is in view. Stagger siblings by 80ms.
- Headlines: each line rises from a clipping mask (as in the hero), 700ms, 90ms stagger.
- Hover transitions: 240ms var(--ease-brand).
- prefers-reduced-motion: all entrances become 200ms fades, no pinning, no parallax, no tilt, no scroll scrubbing, films show their posters.
- Never animate layout properties that cause jank; animate transform and opacity only.

### Media rules
- Films: muted, loop, playsInline, autoplay only while in view (IntersectionObserver), preload none until near the viewport, poster always set.
- Placeholders: where real media is not ready, use the placeholder described in the section, never stock photography and never AI generated people.

### Content configuration
Create lib/site.ts holding editable values used across the homepage and footer:
- company: legal name, registration number, registered office, place of registration, contact email. All are empty for now; anything empty is not rendered.
- assurance: the list of assurance items with their status (see section 9).
- people: the people cards (see section 10).
- insights: the article list (empty for now).
- social: LinkedIn URL (empty for now).

---

## Section 3: The conviction
- Purpose: in five seconds, show how Apporine thinks.
- Layout: text only, left aligned, generous space. Eyebrow, then the headline at a larger size than other sections: clamp(48px, 7vw, 112px), max width 15ch per line feel (max-width min(1100px, 80vw)). Below it, the paragraph (max width 40rem), 40px gap.
- Signature line: a 1px citrine line with a soft glow draws from the left margin to the right margin above the eyebrow when the section enters (900ms).
- Motion: scroll scrubbed word reveal on the headline. Each word starts at 18% opacity and reaches 100% as the section scrolls from 80% to 35% of the viewport. The citrine accent word reaches full colour last. Use Motion's useScroll and useTransform.
- Background: --plum-950 with the same subtle film grain as the hero (3%).

## Section 4: Two ways to work with us
- Layout: eyebrow, headline and lead paragraph left aligned. Then two equal cards side by side (gap 24px); stacked on mobile.
- Card: radius 28px, background --plum-950, overflow hidden, min height 560px.
  - Top 55%: a living film inset (object-fit cover). Card A uses /videos/hero-02-armillary-mobile, Card B uses /videos/hero-03-bridge-mobile, with their posters. A gradient from transparent to --plum-950 blends the film into the card.
  - Bottom: small label (mono), card title in Bricolage Grotesque uppercase 36px with accent word, body text --plum-300, button.
- Hover: card lifts translateY(-6px); the film brightens (filter brightness 1.08); a 2px citrine line draws along the top edge of the card from left to right (500ms).
- Whole card is clickable (the button is the accessible link; the card uses a stretched link pattern).

## Section 5: Our products
- Layout: eyebrow, headline, lead paragraph. Below: a product switcher with two tabs, "Relyxus" and "Orion" (Orion shows a small mono chip "IN DEVELOPMENT"). Tabs follow the WAI-ARIA tabs pattern with arrow key support.
- The product theatre: a two column layout. Left (5 of 12 columns): product name in Bricolage Grotesque 800 uppercase 64px, category label, description, then three pillars (for Relyxus) and the buttons. Right (7 of 12 columns): a large glass frame (radius 24px, 1px border rgba(201,179,222,0.25), background rgba(46,10,58,0.5), inner padding 14px) that holds the product visual.
- 3D tilt: on pointer devices, the frame tilts toward the cursor, maximum 6 degrees on each axis, with perspective 1200px and a soft moving highlight. Resets smoothly on leave. Disabled for reduced motion and touch.
- Relyxus visual: a real product screenshot at public/products/relyxus/screen-1.png. Until that file exists, show a placeholder made in code: a dark interface skeleton (sidebar, header bar, three status rows, one highlighted incident row with a citrine left border) drawn with divs, clearly abstract, no fake numbers or text.
- Orion visual: the Orion constellation drawn in SVG inside the frame: the main stars as small citrine dots with a soft glow, joined by thin rgba(245,230,99,0.5) lines; stars twinkle very gently (opacity 0.7 to 1, staggered, 3 to 5 seconds). Accurate shape of the Orion constellation (Betelgeuse, Bellatrix, the three belt stars Alnitak, Alnilam, Mintaka, Saiph and Rigel).
- Switching tabs: the left text cross fades (200ms); the frame content cross fades and slightly scales (0.98 to 1, 400ms).
- Pillars (Relyxus only): three rows, each with a small citrine number (01, 02, 03 in mono), a title and one line. Thin --plum-700 divider between rows.

## Section 6: How we build
- Layout desktop: the section is tall (300vh) with a sticky inner stage (100vh). Left: eyebrow, headline, lead paragraph. Right: the four steps stacked vertically, joined by a vertical 2px line in --plum-200.
- Scroll interaction: as the user scrolls through the section, a citrine segment fills the vertical line from step 01 to step 04. Each step becomes active when the fill reaches it: its number turns citrine on --plum-800 background chip, the title darkens to --plum-800 and the body fades from 45% to 100% opacity.
- Step anatomy: number chip (mono 13px, 36px circle), title (Instrument Sans 600, 24px), body (16px, max width 30rem).
- Mobile and reduced motion: no pinning; the four steps are a simple vertical list, all fully visible, with a static line.

## Section 7: What we build
- Layout: eyebrow, headline, lead paragraph. Then a grid of six tiles: 3 columns on desktop, 2 on tablet, 1 on mobile, gap 16px.
- Tiles 1 to 5 (capabilities): radius 24px, background rgba(251,249,252,0.65) with backdrop blur 12px, border 1px --plum-200, padding 32px, min height 260px. Contents: a custom monoline icon (48px, 1.5px stroke, --plum-800, drawn as inline SVG), title, body.
- Hover: tile lifts 4px, border turns --orchid, the icon strokes draw in again (stroke-dashoffset animation 700ms) and a small arrow appears top right.
- Tile 6 (the invitation tile): background --plum-800, text --plum-50, title in Bricolage uppercase 28px with accent, body, and the citrine "Start building" button.
- Icons (simple, geometric, custom, no icon library): Enterprise platforms = three stacked rounded layers; AI agents and automation = a node with three connected smaller nodes; Web and mobile apps = a laptop outline with a phone overlapping; Cloud and DevOps = a cloud outline over a looping arrow; Data and integration = two circles joined by a line with a small diamond in the middle.

## Section 8: Industries
- Layout desktop: eyebrow, headline, lead paragraph on top. Below, a two column interaction: left (5 of 12) the list of six industries; right (7 of 12) the detail panel.
- List items: Bricolage Grotesque 800 uppercase clamp(28px, 3vw, 44px), --plum-50 at 35% opacity; the active item is 100% opacity with a citrine dot before it and the light seam underline. Activated on hover and focus (desktop) or tap.
- Detail panel: radius 28px, height 520px, overflow hidden. Background: the visual for that industry (for now reuse posters: Financial services and Telecommunications = hero-01 poster; Insurance and Logistics = hero-03 poster; Energy and utilities and Retail = hero-02 poster), darkened with a gradient. On top, at the bottom of the panel: two labelled blocks, "THE COSTLY PROBLEM" and "WHAT WE BUILD" (mono labels, text 18px --plum-50), and a link "Explore [industry]".
- Switching industries: the panel content cross fades with a 300ms blur to sharp transition.
- Mobile: an accordion; each open item shows the two blocks and the link, no image.

## Section 9: Built to be examined
- Background: --plum-800 with a faint blueprint grid (1px lines every 64px in rgba(201,179,222,0.06)) and a slow scanning citrine line (2px, 8% opacity) that sweeps top to bottom every 8 seconds. Static for reduced motion.
- Layout: eyebrow, headline, lead paragraph left; then two parts.
- Part A, four principles: a 2 by 2 grid of cards (radius 24px, background rgba(18,4,26,0.45), border 1px rgba(165,59,239,0.3), padding 32px), each with a small citrine line icon, title and body.
- Part B, the assurance roadmap: a table like list. Columns: item, what it means, status. Status is a pill: "In place" (citrine background, plum text), "In progress" (transparent, 1px citrine border, citrine text), "Planned" (transparent, 1px --plum-400 border, --plum-300 text). Rows come from lib/site.ts so statuses can be updated without code changes.
- Buttons: "Visit the Trust centre" (primary) → /trust, and "Request our security pack" (secondary) → /contact?topic=security.
- Rule: never display any certification logo or badge. Text and statuses only.

## Section 10: The people
- Layout: eyebrow, headline, lead paragraph. Then a row of people cards (2 now, able to grow to 4), then the founder quote.
- Card: portrait 4:5 (radius 24px), name (Instrument Sans 600, 22px), role (mono label), short bio (16px), LinkedIn link if provided.
- Portrait rule: real photographs only, from public/people/. Until a photo exists, show a monogram tile: --plum-800 background, initials in Bricolage Grotesque 800 64px --plum-50, a thin citrine ring. Never use AI generated faces or stock photos.
- Hover on portrait: subtle zoom 1.03 and a citrine line under the name.
- Founder quote: large Instrument Serif Italic, clamp(28px, 3vw, 44px), --plum-800, max width 44rem, with the name below in mono.
- Cards and quote come from lib/site.ts.

## Section 11: Insights
- Render this section only if lib/site.ts has at least 3 published articles. Until then it does not appear on the page at all.
- When shown: eyebrow, headline, lead paragraph, then three cards (cover image 16:10, category label, title Instrument Sans 600 22px, reading time, arrow link) and a "All insights" link.

## Section 12: The invitation
- Full bleed section, min height 90vh, background film: /videos/hero-03-bridge (desktop) and hero-03-bridge-mobile (mobile), starting from its poster, with the same left readability scrim as the hero slide 3.
- Content left aligned and vertically centred: eyebrow, headline at hero scale clamp(48px, 7vw, 100px), paragraph, two buttons (Start building primary, Talk to us secondary).
- Motion: headline line reveal; the film plays only while in view.

## Section 13: Footer
Four layers, top to bottom:
1. Statement band: Falcon (48px) and the line in Instrument Serif Italic 28px; right side the Start building button. Bottom border 1px --plum-700.
2. Link grid: five columns (Products, What we build, Industries, Company, Trust), headings in mono labels --plum-400, links Instrument Sans 15px --plum-200, hover --plum-50 with the light seam. Two columns on tablet, accordion on mobile.
3. Legal row: copyright line, the company details sentence (only rendered when company details in lib/site.ts are filled), LinkedIn icon link (only if URL set), and legal links.
4. Monumental wordmark: the word APPORINE across the full width at the very bottom, Bricolage Grotesque 800 uppercase, font size about 19vw, colour --plum-900 on --plum-950 (subtle), with the O replaced by wordmark-o.png scaled to the cap height at 35% opacity. Gentle parallax: the wordmark rises 40px as the footer enters. Decorative only (aria-hidden).

## New routes to add (use the existing coming soon template)
/trust, /security, /privacy, /cookies, /terms, /accessibility, /products/orion. Add them to lib/routes.ts. Also add public/.well-known/security.txt with: Contact: https://[site]/security, Expires: one year from today in ISO format, Preferred-Languages: en, Canonical: the security.txt URL.

## Acceptance checklist
- [ ] All copy matches 08-homepage-content.md exactly, with curly apostrophes and no hyphens in visible text.
- [ ] Every section's left edge aligns with the hero headline at 1920, 1440, 1280 and 390 widths.
- [ ] Backgrounds follow the rhythm table; no section uses colours outside the tokens.
- [ ] Section 3 word reveal, section 5 tilt and tabs, section 6 pinned progress, section 8 industry switching, section 9 statuses all work, with keyboard support.
- [ ] Reduced motion: no pinning, tilt, scrubbing or parallax; content fully readable.
- [ ] No certification logos, no client logos, no invented numbers, no AI faces, no stock photos.
- [ ] Insights section hidden while fewer than 3 articles exist.
- [ ] Footer company details hidden while empty.
- [ ] All new routes resolve; security.txt is served.
- [ ] Lighthouse on desktop: performance 90+, accessibility 100, best practices 100, SEO 100. No console errors.
