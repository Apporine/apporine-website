Paste everything below the line into Claude Code.

------------------------------------------------------------

Build the final Apporine navigation. Act as a senior front end engineer at an enterprise grade agency. Quality bar: pixel perfect, fully accessible, no shortcuts.

READ FIRST, in this order, and treat them as the single source of truth:
1. CLAUDE.md
2. _brief/docs/05-navigation-spec.md (exact visual and behaviour specification)
3. _brief/docs/06-navigation-content.md (exact words and links)
4. _brief/docs/04-design-tokens.css and _brief/docs/02-hero-spec.md (existing tokens and hero)

Do not change any hero copy, colours, fonts or videos. Do not invent any text, claims or links beyond the two docs.

STEPS (report what you did after each one):
1. Inspect the current navigation and logo code (including any earlier Falcon logo work) and tell me in 3 lines what exists now.
2. Assets: copy falcon-clean.png, falcon-clean@2x.png, falcon-clean@3x.png, wordmark-o.png, wordmark-o@2x.png and wordmark-o@3x.png from _brief/assets/brand/falcon/ into public/brand/. Stop using the old falcon.png files anywhere (they have a dark fringe). wordmark-full-reference.png is for visual reference only: open it to see exactly how the ring O with the Falcon must look; do not place it on the site.
3. Create lib/routes.ts with every route from section 7 of the spec, and lib/navigation.ts holding all panel content from 06-navigation-content.md as typed data.
4. Build the coming soon page template and create every route listed in section 7 of the spec with it. Every navigation link must lead to a real page.
5. Rebuild the desktop capsule exactly as specified: Imperial Plum glass, alignment with the hero content edge, centred items, Talk to us link and citrine Start building button, scroll hide and show behaviour.
6. Build the Falcon logo with the full hover and focus choreography from section 3. The O in APPORINE must be the wordmark-o image (violet ring with the Falcon inside), exactly as in the official logo: no citrine ring, no outline, no recolouring, no underline. Nothing else in the capsule may move during the reveal.
7. Build the light seam (section 4).
8. Build the five mega panels (section 5): feature card with its film on the LEFT, link columns, hover intent, morphing between panels, backdrop dim, Escape and outside click to close, films loading only on first open.
9. Build the mobile and tablet menu (section 6) with focus trap, Escape, scroll lock.
10. Accessibility and reduced motion exactly as section 8.
11. Run npm run build and npm run lint and fix every error and warning.
12. Test on the dev server at 1920x1080, 1440x900, 1280x800, 1024x768 and 390x844. Go through the acceptance checklist in section 10 of the spec item by item, including keyboard only navigation, and report a pass or fail table. Fix every fail and re test.
13. Update CLAUDE.md with a short section describing the navigation, the routes config and the coming soon template.
14. Commit with the message "Navigation: Imperial Plum capsule, Falcon reveal, mega panels" and push to GitHub so Vercel redeploys. Give me the live URL.

If anything in the spec is technically impossible or conflicts with existing code, stop and explain the conflict and your proposed solution before continuing. Never silently change the design.
