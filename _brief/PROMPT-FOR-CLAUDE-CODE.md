Paste everything below the line into Claude Code.

------------------------------------------------------------

You are building the official Apporine website, starting with the homepage hero. Act as a senior front end engineer at an enterprise grade agency.

First, read CLAUDE.md in this folder, then every file in _brief/docs in order. Treat them as the single source of truth. Do not change any copy, colour or font.

Work fully autonomously. Do not ask me for approval for installs, commands or file changes inside this project. Only stop and tell me when something genuinely needs me: a Windows administrator pop up, a browser login, or a decision about content.

Step 0, prepare this computer (Windows):
a. Check what is installed and print a table of tool, required version, installed version, status:
   - Node.js: 20.9 or newer (install the current LTS if missing or older)
   - npm: comes with Node.js
   - Git: any recent version
   - GitHub CLI (gh): any recent version
   - Vercel CLI (vercel): latest
b. Install anything missing or outdated without asking me, using winget with silent flags:
   - winget install --id OpenJS.NodeJS.LTS -e --silent --accept-package-agreements --accept-source-agreements
   - winget install --id Git.Git -e --silent --accept-package-agreements --accept-source-agreements
   - winget install --id GitHub.cli -e --silent --accept-package-agreements --accept-source-agreements
   - npm install -g vercel
c. After installing, refresh the PATH in the current session so the new tools work immediately. If a tool still is not found, tell me to restart the terminal and run claude again, then continue from where you stopped.
d. Run the version checks again and show me the final table.

Then do the following, step by step, and tell me what you did after each step:

1. Set up a new Next.js project in THIS folder (do not create a subfolder): latest stable Next.js with the App Router, TypeScript strict, Tailwind CSS, ESLint, src folder NOT used, import alias @/*. Package name: apporine-web. Keep the existing CLAUDE.md and _brief folder untouched. Add _brief to the build exclusions where relevant.
2. Install Motion (the animation library formerly called Framer Motion).
3. Copy all files from _brief/assets/videos into public/videos.
4. Add the design tokens from _brief/docs/04-design-tokens.css into app/globals.css, and map them into the Tailwind theme so classes like bg-plum-950 and text-citrine work.
5. Load the four fonts with next/font/google exactly as specified (Bricolage Grotesque with the wdth and opsz axes, Instrument Sans, Instrument Serif italic, IBM Plex Mono 500), exposed as CSS variables.
6. Build the navigation bar and the 3 slide hero carousel exactly as described in _brief/docs/02-hero-spec.md, with the copy from _brief/docs/03-content.md. Use the component structure listed in CLAUDE.md.
7. Slide 3 video does not exist yet. Build it so that adding public/videos/hero-03-bridge.mp4, .webm, -poster.webp and the mobile versions later works without code changes, and show the plum gradient fallback until then.
8. Add security headers in next.config, page metadata (title: “Apporine, enterprise products for the age of AI”, description from slide 1 paragraph), and a favicon from the gate mark.
9. Run npm run build and npm run lint, and fix every error and warning.
10. Start the dev server and check the result against the acceptance checklist at the end of 02-hero-spec.md, item by item, on desktop and mobile widths. Report each item as pass or fail, and fix any failures.
11. Initialise git, create a sensible .gitignore, and make the first commit with the message “Hero section, phase 1”.
12. Publish to GitHub: check gh auth status. If I am not logged in, run gh auth login --web and tell me to complete the login in the browser. Then create a PRIVATE repository named apporine-web with gh repo create, and push the code.
13. Deploy to Vercel: check vercel whoami. If I am not logged in, run vercel login and tell me to complete it in the browser. Then link the project (project name apporine-web), deploy a preview, check it works, then deploy to production with vercel --prod. Give me the live .vercel.app address.
14. Finish with a short summary: what was built, the live address, and anything I still need to do.

Rules: do not add libraries outside 01-tech-stack.md unless strictly needed, and tell me if you do. Never touch files outside this project folder except for installing the tools in Step 0. Never invent content. Keep the code clean, typed and commented where the logic is not obvious.
