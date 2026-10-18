# Navigation specification (locked, build exactly this)

Locked decisions: Imperial Plum glass capsule · citrine "Start building" button with a "Talk to us" text link · Falcon logo with letter reveal on hover, no underline · mega panels with the feature film card on the LEFT.

## 1. Capsule (desktop, 1280px and wider)
| Property | Value |
| --- | --- |
| Position | fixed, top 20px, z-index above the hero |
| Left and right | calc(clamp(24px, 8vw, 160px) - 27px): the 1px border plus 26px padding put the Falcon exactly on the hero content edge. Under 768px: 12px from each screen edge |
| Height | 72px |
| Shape | border-radius 999px |
| Padding | 0 12px 0 26px (visually; from 1280px the right padding is 26px with the right side group pulled 14px outwards, so the items centre on the capsule itself). Under 768px: 1px border + 11px padding on both sides, so the Falcon sits on the 24px hero margin |
| Background | rgba(46,10,58,0.62) |
| Glass | backdrop-filter: blur(22px) saturate(160%) (include -webkit- prefix) |
| Border | 1px solid rgba(165,59,239,0.42) |
| Shadow | inset 0 1px 0 rgba(239,230,246,0.14), 0 0 0 1px rgba(122,31,184,0.12), 0 0 44px rgba(122,31,184,0.28), 0 18px 50px rgba(0,0,0,0.45) |
| When a panel is open, or after scrolling 80px | background rgba(46,10,58,0.86), 300ms |
| Scroll behaviour | after 120px, scrolling down hides the capsule (translateY(-140%), 350ms); scrolling up shows it again. Never hide while a panel or the mobile menu is open, or while focus is inside the nav |

## 2. Layout inside the capsule
- Left: logo link (section 3).
- Centre: five menu items, absolutely centred in the capsule: Products, What we build, Industries, Insights, Company. Each is a button with a 10px chevron that rotates 180° when its panel is open.
- Item text: Instrument Sans 500, 15px, colour var(--plum-50) at 85% opacity, 100% on hover or open. Padding 12px 14px. Gap 6px. Between 1280px and 1439px: padding 12px 10px, gap 2px, so the items clear the right side buttons.
- Right: "Talk to us" text link (Instrument Sans 500, 15px, var(--plum-50), padding 10px 14px) then the primary button "Start building →".
- Primary button: height 48px, padding 0 22px, radius 999px, background var(--citrine), text var(--plum-800), Instrument Sans 600, 14px. Hover var(--citrine-hover), arrow slides 4px right in 180ms. Active var(--citrine-pressed), scale 0.98. Focus 3px citrine outline, offset 3px.

## 3. Logo, the Falcon, with the wordmark reveal
Assets in /public/brand/: falcon-clean.png (1x, 2x, 3x) and wordmark-o.png (1x, 2x, 3x). Never use the old falcon.png files with the dark fringe.

Default state: only the Falcon, height 36px desktop, 28px mobile, width auto.

Hover and keyboard focus choreography (desktop, pointer devices only):
1. 0ms, Falcon lifts: transform translateY(-2px) scale(1.07); filter brightness(1.15) drop-shadow(0 0 12px rgba(245,230,99,0.45)); 450ms var(--ease-brand).
2. 50ms, light sweep: a diagonal highlight (linear-gradient 105deg, transparent 35%, rgba(255,252,220,0.95) 50%, transparent 65%) passes across the Falcon from right to left over 800ms. It is clipped to the Falcon shape with CSS mask-image using falcon-clean@2x.png.
3. 60ms, the wordmark container opens: max-width 0 to 260px, margin-left 0 to 16px, 500ms var(--ease-brand), overflow hidden.
4. 120ms, the letters arrive one by one: A, P, P, [O], R, I, N, E.
   - Letters: Instrument Sans 600, 18px, colour var(--plum-50).
   - Letter spacing of the whole word animates from 0.5em to 0.24em over 600ms.
   - Each letter goes from opacity 0, translateY(8px), blur(6px) to opacity 1, none, none over 400 to 500ms, starting at 120ms + index × 40ms.
5. The O is NOT a typed letter. It is the image wordmark-o.png: the exact violet ring with the Falcon inside, cut from the official logo. Height 1.3em (about 23px), vertically centred on the capital letters, margin 0 0.2em. It arrives at its stagger time (index 3) by scaling from 0.6 to 1 and fading in, with a short glow pulse: filter drop-shadow(0 0 10px rgba(165,59,239,0.6)) easing to drop-shadow(0 0 3px rgba(165,59,239,0.4)) over 600ms. No citrine ring, no extra outline, no recolouring.
6. No underline under the word.
Exit: everything reverses together in 300ms.
- The reveal must not move the centred menu items or the right side buttons.
- Between 1280px and 1359px the centred items leave no room for the word: there the Falcon lifts and glows only (no sweep, no word).
- Accessibility: link aria-label "Apporine, home"; the word is aria-hidden.
- Touch devices and prefers-reduced-motion: no reveal animation; reduced motion users get a simple 200ms fade if they focus the logo.

## 4. The light seam (signature detail)
A 2px citrine bar with glow (box-shadow 0 0 10px rgba(245,230,99,0.6)), radius 2px, 14px above the capsule bottom, under the hovered or open item. It slides between items (left and width, 320ms var(--ease-brand)) and fades out when nothing is hovered or open. Width = item width minus its side padding (28px; 20px between 1280px and 1439px).

## 5. Mega panels
| Property | Value |
| --- | --- |
| Open | mouse rests on an item for 120ms, or the item receives keyboard focus, or click/tap |
| Switch | moving to another item swaps content instantly with a 140ms cross fade, without closing; panel height animates 280ms |
| Close | 260ms after the pointer leaves both the capsule and the panel; Escape key; click outside |
| Position | fixed, top 102px, same left and right as the capsule |
| Panel | background var(--plum-50), radius 28px, padding 12px, shadow 0 30px 80px rgba(18,4,26,0.55), opens with opacity 0 to 1 and translateY(-10px) to 0, 240ms |
| Backdrop | the page behind dims with rgba(18,4,26,0.5), 300ms |
| Layout | CSS grid: 300px feature card on the LEFT, then the link columns |

Feature card (left):
- Radius 20px, min height 360px, padding 22px, content aligned to the bottom.
- Background: a silent looping film (video muted, loop, playsInline, autoplay only while the panel is open, preload none until first open), object-fit cover.
- Readability overlay: linear-gradient(0deg, rgba(18,4,26,0.95) 0%, rgba(18,4,26,0.7) 50%, rgba(18,4,26,0.15) 85%).
- Eyebrow: IBM Plex Mono 11px, letter spacing 0.16em, uppercase, var(--plum-200).
- Title: Bricolage Grotesque 800, wdth 75, opsz 96, uppercase, 30px, line height 0.95, var(--plum-50); accent word in Instrument Serif Italic, lowercase, var(--citrine).
- Line: Instrument Sans 14px, var(--plum-100).
- Button: citrine, height 40px, padding 0 18px.
- Films for now (reuse existing files, to be replaced later by dedicated films): Products → /videos/hero-02-armillary-mobile; What we build → /videos/hero-03-bridge-mobile; Industries → /videos/hero-01-monolith-mobile; Insights → /videos/hero-02-armillary-mobile; Company → /videos/hero-01-monolith-mobile. Use the matching mobile posters.

Link columns:
- Grid: repeat(auto-fit, minmax(220px, 1fr)), gap 8px 28px, padding 14px 18px 10px.
- Column heading: IBM Plex Mono 11px, 0.16em, uppercase, var(--plum-600), 12px padding below, 1px var(--plum-200) bottom border, 6px margin below. Empty heading keeps the spacing.
- Link: block, padding 11px 12px, negative margin 0 -12px, radius 12px. Title Instrument Sans 600 15px var(--plum-800). Description 13.5px #5E4A6E, 2px above. Hover and focus: background var(--plum-100).
- A link marked "muted" is not clickable and its title uses var(--plum-400).

## 6. Mobile and tablet (under 1280px)
- Capsule: Falcon left (28px), "Menu" button right (44px high pill, 1px rgba(201,179,222,0.35) border, text var(--plum-50)). Menu items, Talk to us and Start building are hidden in the capsule.
- Menu opens a full screen overlay: background var(--plum-950); top row Falcon and a "Close" button; then the five items as an accordion, each item title in Bricolage Grotesque 800 wdth 75, uppercase, 32px; expanding shows that panel's links (title and description, Instrument Sans). Feature cards are not shown on mobile.
- Pinned at the bottom: "Talk to us" (secondary pill) and "Start building" (citrine pill), full width, stacked.
- Focus is trapped inside the open menu; Escape closes it; page scrolling is locked while open.
- Opening: fade and slide 16px, 300ms; reduced motion: instant.

## 7. Routes and the "coming soon" template
All menu destinations must work. Create a reusable coming soon page template and use it for every route that is not built yet:
- Background var(--plum-950) with the hero-01-monolith poster at 35% opacity, right aligned.
- Eyebrow: Falcon 22px + "APPORINE" (IBM Plex Mono, as in the hero).
- Headline (Bricolage Grotesque, hero style, smaller: clamp(40px, 6vw, 80px)): "This page is being engineered *pristine.*"
- Paragraph: "We’re building this page to the same standard as everything we make. It will be ready soon."
- Button: "Back to home" (citrine) → /
- Page title: the destination name plus " · Apporine".
Routes to create with this template: /products, /products/relyxus, /build, /industries, /industries/financial-services, /industries/insurance, /industries/telecommunications, /industries/energy-and-utilities, /industries/logistics, /industries/retail-and-ecommerce, /insights, /insights/engineering-notes, /insights/ai-in-production, /insights/operational-resilience, /insights/industry-perspectives, /company, /company/leadership, /careers, /press, /contact.
Anchors (#pristine, #how-we-partner, #how-we-choose, #start) point to their parent page.
Put every route path in one config file (for example lib/routes.ts) so pages can be built later without touching the navigation.

## 8. Accessibility
- nav element with aria-label "Main".
- Each menu item: button with aria-expanded and aria-controls pointing to its panel.
- Panel: role="region", aria-label equal to the item name.
- Full keyboard support: Tab moves through items, Enter or Space opens, Escape closes and returns focus to the item, Tab enters the panel links.
- Visible focus rings everywhere (3px citrine on dark, 3px var(--orchid-deep) on the Pearl panel).
- prefers-reduced-motion: no seam slide, no reveal, no scroll hide, fades of 200ms or less.

## 9. Performance
- Panel films load only when a panel is first opened.
- Falcon and wordmark-o images use next/image with width and height set (no layout shift).
- No new libraries unless strictly needed; Motion is already available.

## 10. Acceptance checklist
- [ ] Capsule colours, border and glow exactly as specified; looks plum, not black.
- [ ] Falcon left edge aligns with the hero headline left edge at 1920, 1440 and 1280 widths.
- [ ] Logo hover: lift, light sweep, letters one by one, the violet ring O with the Falcon inside appears in place of the O, no underline, no citrine ring, nothing else moves.
- [ ] Light seam slides between items.
- [ ] Every panel opens on hover and keyboard, morphs when switching, closes on leave and Escape, card on the left with its film.
- [ ] Copy matches 06-navigation-content.md exactly.
- [ ] Mobile menu works, with focus trap and scroll lock.
- [ ] Every link leads to a real page (built or coming soon). No 404s.
- [ ] Build and lint pass with no warnings. Lighthouse accessibility 100 on desktop.

## 11. Build decisions (agreed during the build, October 2026)
- Breakpoint: the full capsule needs about 1300px (five centred items 600px, Talk to us plus Start building 259px). It shows from 1280px with the tighter item spacing in section 2; under 1280px the Falcon and Menu capsule with the full screen menu is used.
- Phones: capsule 12px from the screen edges; the hero mobile side margin is 24px (02-hero-spec.md), so the Falcon and the hero text share one edge.
- Hover intent: a panel opened by hover or keyboard focus stays open on the first click of its item; a second click closes it. Focus leaving the navigation closes a panel opened by keyboard or click.
- Muted links ("More in development") are announced as unavailable links (aria-disabled), so they read as inactive rather than as plain text.
- Reduced motion: panel films show their poster only, as the hero does.
- Routes: every path lives in lib/routes.ts; each unbuilt destination has its own static app/<path>/page.tsx rendering the coming soon template, so unknown paths return a real 404.
