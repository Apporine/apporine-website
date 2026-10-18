import type { Metadata } from "next";
import { AccentText } from "@/components/accent-text";
import { ButtonLink } from "@/components/button-link";
import { Falcon } from "@/components/brand-marks";
import { gutter } from "@/components/layout";
import { comingSoonPages, routes, type RoutePath } from "@/lib/routes";
import type { TextSegment } from "@/lib/text";

// Copy is locked: _brief/docs/05-navigation-spec.md, section 7.
const headline: TextSegment[] = [
  { text: "This page is being engineered " },
  { text: "pristine.", accent: true },
];
const paragraph =
  "We’re building this page to the same standard as everything we make. It will be ready soon.";

/** Page title for a placeholder route: "<name> · Apporine". */
export function comingSoonMetadata(path: RoutePath): Metadata {
  const page = comingSoonPages.find((entry) => entry.path === path);
  return { title: page ? `${page.name} · Apporine` : "Apporine" };
}

/** Placeholder for every destination that is not built yet (spec section 7). */
export function ComingSoon() {
  return (
    <main className="relative isolate flex min-h-[max(100svh,640px)] overflow-hidden bg-plum-950">
      {/* Decorative: the monolith poster, 35% opacity, right aligned. */}
      <picture>
        <source media="(max-width: 767px)" srcSet="/videos/hero-01-monolith-mobile-poster.webp" type="image/webp" />
        <img
          src="/videos/hero-01-monolith-poster.webp"
          alt=""
          decoding="async"
          className="absolute inset-0 -z-10 size-full object-cover object-right opacity-35"
        />
      </picture>

      <div className={`${gutter} flex flex-col justify-end pt-[140px] pb-[120px] md:justify-center`}>
        <p className="mb-7 flex items-center gap-2.5 font-mono text-xs leading-[1.3] font-medium tracking-[0.18em] text-plum-300 uppercase">
          <Falcon width={22} height={10} className="h-[10px] w-[22px] shrink-0 object-contain" />
          APPORINE
        </p>
        <h1 className="mb-7 max-w-[min(880px,60vw)] font-display text-[clamp(40px,6vw,80px)] leading-[0.9] font-extrabold tracking-[-0.015em] text-plum-50 uppercase [font-variation-settings:'wdth'_75,'opsz'_96] max-md:max-w-none">
          <AccentText segments={headline} />
        </h1>
        <p className="mb-10 max-w-[34rem] font-sans text-base leading-[1.6] font-[450] text-plum-100 md:text-[clamp(16px,1.25vw,19px)] md:font-normal md:text-plum-300">
          {paragraph}
        </p>
        <div>
          <ButtonLink href={routes.home} variant="primary">
            Back to home
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
