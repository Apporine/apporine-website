import { ButtonLink } from "@/components/button-link";
import { slides } from "@/components/hero/slides";
import { gutter } from "@/components/layout";
import { Eyebrow } from "@/components/section/eyebrow";
import { Film } from "@/components/section/film";
import { LeadParagraph } from "@/components/section/lead-paragraph";
import { Reveal } from "@/components/section/reveal";
import { deferredRendering, sectionPadding } from "@/components/section/section";
import { SectionHeadline } from "@/components/section/section-headline";
import { anchors, routes } from "@/lib/routes";
import type { TextSegment } from "@/lib/text";

// Copy is locked: _brief/docs/08-homepage-content.md, section 12.
const eyebrow = "START BUILDING";
const headline: TextSegment[] = [{ text: "Bring us the problem that costs you " }, { text: "most.", accent: true }];
const paragraph =
  "Tell us where your business loses money, time or trust. We will show you what we would build, and how we would prove it.";

// The same readability scrim as hero slide 3 (02-hero-spec.md, section 3).
const heroSlide3 = slides.find((slide) => slide.video === "hero-03-bridge");
const DESKTOP_SCRIM = heroSlide3?.scrim.desktop;
const MOBILE_SCRIM = [
  "linear-gradient(180deg, rgba(18,4,26,0.6) 0%, rgba(18,4,26,0) 20%)",
  "linear-gradient(0deg, rgba(18,4,26,0.92) 0%, rgba(18,4,26,0.55) 50%, rgba(18,4,26,0) 80%)",
  `linear-gradient(${heroSlide3?.scrim.mobileOverlay}, ${heroSlide3?.scrim.mobileOverlay})`,
].join(", ");

/** Barely visible halo that lifts body copy off the film, as in the hero. */
const SOFT_TEXT_SHADOW = "[text-shadow:0_1px_24px_rgba(18,4,26,0.8)]";

/**
 * Section 12 (07-homepage-spec.md): full bleed bridge film (playing only
 * while in view) behind the closing invitation.
 */
export function Invitation() {
  return (
    <section aria-labelledby="invitation-title" className={`relative isolate flex min-h-[90vh] items-center overflow-hidden bg-plum-950 ${deferredRendering}`}>
      <div className="absolute inset-0 -z-10">
        <Film name="hero-03-bridge" mobileName="hero-03-bridge-mobile" className="object-center md:object-right" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-(image:--scrim-mobile) md:bg-(image:--scrim-desktop) md:rtl:-scale-x-100"
          style={{ "--scrim-mobile": MOBILE_SCRIM, "--scrim-desktop": DESKTOP_SCRIM } as React.CSSProperties}
        />
      </div>

      <div className={`${gutter} ${sectionPadding}`}>
        <Reveal>
          <Eyebrow tone="dark">{eyebrow}</Eyebrow>
        </Reveal>
        <SectionHeadline
          id="invitation-title"
          tone="dark"
          segments={headline}
          className="mb-7 text-[clamp(48px,7vw,100px)] leading-[0.9] md:max-w-[min(880px,60vw)]"
        />
        <Reveal>
          <LeadParagraph tone="dark" className={`mb-10 max-w-[34rem] ${SOFT_TEXT_SHADOW}`}>
            {paragraph}
          </LeadParagraph>
        </Reveal>
        <Reveal className="flex flex-col gap-3 md:flex-row md:flex-wrap">
          <ButtonLink href={anchors.start} variant="primary" className="w-full md:w-auto">
            Start building
          </ButtonLink>
          <ButtonLink href={routes.contact} variant="secondary" className="w-full md:w-auto">
            Talk to us
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
