Paste everything below the line into Claude Code.

------------------------------------------------------------

Build the full Apporine homepage below the existing hero, plus the new routes. Act as a senior front end engineer and motion designer at an enterprise grade agency. The standard is a site that a bank's procurement and security teams would respect: precise, calm, fast and accessible.

READ FIRST, in this order, and treat them as the single source of truth:
1. CLAUDE.md
2. _brief/docs/07-homepage-spec.md (layout, backgrounds, motion and behaviour for sections 3 to 13)
3. _brief/docs/08-homepage-content.md (every word, and the items founders must confirm)
4. _brief/docs/04-design-tokens.css, 02-hero-spec.md and 05-navigation-spec.md (existing system)

Absolute rules:
- Use the copy word for word. Never invent text, numbers, claims, client names, logos, testimonials or certifications.
- Never use stock photos or AI generated people. Use the placeholders the spec describes.
- Only colours from the design tokens. Only the four existing fonts.
- Motion uses the existing Motion library only. Ask me before adding any other dependency.
- Do not change the navigation or the hero.

STEPS (report after each one):
1. Create lib/site.ts with the company, assurance, people, insights and social data from the docs (empty values stay empty and are not rendered).
2. Add the new routes (/trust, /security, /privacy, /cookies, /terms, /accessibility, /products/orion) using the coming soon template, update lib/routes.ts, and add public/.well-known/security.txt as specified.
3. Build shared building blocks first: Section wrapper (margins, padding, background), Eyebrow (with the Falcon), SectionHeadline (line reveal, accent word), LeadParagraph, Reveal (entrance animation), and the reduced motion handling.
4. Build sections 3 to 13 in order, each as its own component in components/home/, exactly as specified.
5. Wire the homepage in app/page.tsx: hero, then sections 3 to 13. Section 11 must not render while there are fewer than 3 articles.
6. Run npm run build and npm run lint and fix every error and warning.
7. Test on the dev server at 1920x1080, 1440x900, 1280x800, 1024x768 and 390x844, with mouse, keyboard only and reduced motion turned on. Go through the acceptance checklist at the end of 07-homepage-spec.md and report a pass or fail table. Fix all failures and re test.
8. Run Lighthouse on the homepage (desktop and mobile) and report the four scores. Fix anything below the targets.
9. List clearly, at the end, the founder confirmation items from 08-homepage-content.md that are still open, and any media files I still need to provide, with the exact file paths.
10. Commit with the message "Homepage sections 3 to 13 and new routes" and push to GitHub so Vercel redeploys. Give me the live URL.

If anything in the spec is unclear, technically impossible or conflicts with existing code, stop and ask me before continuing. Never silently change the design.
