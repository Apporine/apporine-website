import type { Metadata } from "next";
import Link from "next/link";
import { gutter } from "@/components/layout";
import { Eyebrow } from "@/components/section/eyebrow";
import { ParallaxLayer } from "@/components/parallax-layer";
import { Film } from "@/components/section/film";
import { LeadParagraph } from "@/components/section/lead-paragraph";
import { displayClass, focusRingLight, lightBodyColour } from "@/components/section/tone";
import { storyFor } from "@/lib/latest";
import { routes, type RoutePath } from "@/lib/routes";

// Copy is locked: _brief/docs/09-latest-section-spec.md, section 8.
const note = "The full story is being written to our pristine standard. It will be published here soon.";
const links = [
  { label: "Back to home", href: routes.home },
  { label: "Talk to us", href: routes.contact },
];

/** Title "[Heading] · Apporine"; the card description as the meta description. */
export function storyMetadata(path: RoutePath): Metadata {
  const story = storyFor(path);
  return { title: `${story.heading} · Apporine`, description: story.description };
}

/**
 * Story page (09-latest-section-spec.md, section 8), the destination of each
 * "Latest from Apporine" card: the card's film as a 70vh banner, then a note
 * on Ivory. Content comes from lib/latest.ts.
 */
export function StoryPage({ path }: { path: RoutePath }) {
  const story = storyFor(path);

  return (
    <main>
      <section data-surface="dark" className="relative isolate flex h-[70vh] min-h-[520px] items-end overflow-hidden bg-ink">
        <div className="absolute inset-0 -z-10">
          <ParallaxLayer>
            <Film name={story.film} focalPoint={story.focalPoint} eager />
          </ParallaxLayer>
          {/* Darkens the text area only (--story-scrim in app/globals.css); the film itself is never dimmed. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-(image:--story-scrim-mobile) md:bg-(image:--story-scrim)"
          />
        </div>
        <div className={`${gutter} pb-[clamp(48px,6vw,96px)]`}>
          {/* Measures keep the text inside the darkened area, so it holds 4.5:1 over the film. */}
          <Eyebrow tone="dark" onFilm>
            {story.category}
          </Eyebrow>
          <h1
            className={`${displayClass} mb-7 text-[clamp(44px,6vw,96px)] leading-[0.9] text-plum-50 md:max-w-[min(820px,52vw)]`}
          >
            {story.heading}
          </h1>
          <LeadParagraph tone="dark" onFilm className="md:max-w-[28rem]">
            {story.description}
          </LeadParagraph>
        </div>
      </section>

      <section data-surface="light" className="bg-ivory px-6 py-[clamp(72px,8vw,128px)]">
        <div className="mx-auto max-w-[44rem]">
          <p className={`mb-8 font-sans text-lg leading-[1.6] ${lightBodyColour}`}>{note}</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  prefetch={false}
                  className={`inline-block rounded-sm font-sans text-[15px] font-semibold text-plum-800 underline decoration-plum-200 underline-offset-4 transition-colors duration-240 ease-brand hover:decoration-orchid ${focusRingLight}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
