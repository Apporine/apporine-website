# Apporine website: technology stack (locked)

## Decision in one line
Next.js (React) with TypeScript, Tailwind CSS and Motion, hosted on Vercel. It is the most widely adopted modern framework for high performance company websites, scales from a one page launch to a large multi product site, and is easy to hire for.

## Why not what Accenture, Deloitte, IBM or Barclays use?
Large traditional enterprises often run their public sites on heavy enterprise CMS platforms such as Adobe Experience Manager or Sitecore. Those suit thousands of editors and cost a great deal to license and run. For a fast moving product company, the modern standard is Next.js plus a headless CMS added when content grows. We can move to any enterprise CMS later without rebuilding the front end.

## The stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js, latest stable, App Router | Server rendering, image and font optimisation, SEO, built for Vercel |
| Language | TypeScript (strict) | Fewer bugs, safer refactors, enterprise standard |
| UI library | React (bundled with Next.js) | The industry standard component model |
| Styling | Tailwind CSS, latest stable, plus CSS variables from 04-design-tokens.css | Fast, consistent, design tokens in one place |
| Motion | Motion (formerly Framer Motion) for UI; GSAP only if a scroll timeline needs it later | Smooth, accessible animation with reduced motion support |
| Fonts | next/font/google: Bricolage Grotesque, Instrument Sans, Instrument Serif, IBM Plex Mono | Self hosted automatically, no layout shift, fast |
| Video | Native HTML video, files in /public/videos for launch | Simple and fast. Move to Vercel Blob or Mux when the video library grows |
| Hosting | Vercel | Built by the makers of Next.js, global edge network, previews for every change |
| Source control | Git + GitHub (private repository) | Required for Vercel deploys and team work |
| Forms (phase 2) | Next.js Route Handlers + Resend for email + Cloudflare Turnstile for spam | No separate server needed |
| CMS (phase 2) | Sanity (headless) | Insights articles and product pages edited without code |
| Analytics | Vercel Analytics (cookieless) | Keeps the cookie banner minimal or unnecessary |
| Monitoring (phase 2) | Sentry | Error tracking in production |
| Quality | ESLint, Prettier, Playwright for tests, Lighthouse checks | Enterprise level quality bar |

## Standards
- Accessibility: WCAG 2.2 AA.
- Performance targets: Lighthouse performance 90+, accessibility 100, LCP under 2.5s on 4G.
- Security headers via next.config: Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- Right to left ready (logical CSS properties) for a future Arabic site.
- No localStorage for core functionality.
