Paste everything below the line into Claude Code.

------------------------------------------------------------

Build the "Latest from Apporine" section (the Living Mosaic) and its five destination pages. Act as a senior front end engineer and motion designer at an enterprise grade agency.

READ FIRST and treat as the single source of truth:
1. CLAUDE.md
2. _brief/docs/09-latest-section-spec.md (this section, locked)
3. _brief/docs/04-design-tokens.css and the existing homepage components (reuse the Eyebrow, headline and motion building blocks)

Rules:
- Use the copy word for word. Do not invent text, claims or links.
- The cards contain no buttons. "Read more →" is a text link style, and the whole card is the link.
- Only colours from the tokens, plus the two new tokens in the spec: --ink #0B0A0D and --ivory #F7F4EE.
- Motion uses the existing Motion library only.
- Do not change the navigation or the hero.

STEPS (report after each one):
1. Copy every file from _brief/assets/videos/latest/ into public/videos/latest/.
2. Add --ink and --ivory to the design tokens and the Tailwind theme.
3. Create lib/latest.ts with the five cards (category, heading, description, link, poster, film, focal point) from the spec.
4. Remove the current conviction section from the homepage and build the Living Mosaic in its place, directly below the hero, exactly as specified for desktop, tablet and mobile.
5. Build the story page template and use it for the five destinations listed in section 8 of the spec, replacing their coming soon pages. Add the new insights route to lib/routes.ts.
6. Run npm run build and npm run lint and fix every error and warning.
7. Test at 1920x1080, 1440x900, 1280x800, 1024x768 and 390x844 with mouse, keyboard only and reduced motion. Report a pass or fail table for every item in the acceptance checklist in section 9 of the spec. Fix all failures and re test.
8. Commit with the message "Latest from Apporine: Living Mosaic and story pages" and push to the feature/corporate-website branch. Open or update the pull request to main, but do NOT merge it. Give me the preview URL.

If anything is unclear or conflicts with existing code, stop and ask me before continuing.
