import Link from "next/link";
import { Eyebrow } from "@/components/section/eyebrow";
import { Reveal } from "@/components/section/reveal";
import { Section } from "@/components/section/section";
import { SectionHeadline } from "@/components/section/section-headline";
import { focusRing } from "@/components/section/tone";
import { latestSection, latestStories } from "@/lib/latest";
import { LatestMosaic } from "./latest-mosaic";

const { eyebrow, headline, allLink, readMore } = latestSection;

/** "All news and insights →", with the light seam underline on hover and focus. */
function AllLink() {
  return (
    <Link
      href={allLink.href}
      prefetch={false}
      className={`group relative inline-flex items-center gap-2 rounded-sm py-1.5 font-sans text-[15px] font-medium whitespace-nowrap text-plum-200 transition-colors duration-240 ease-brand hover:text-plum-50 ${focusRing}`}
    >
      {allLink.label}
      <span aria-hidden="true" className="inline-block rtl:-scale-x-100">
        →
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0.5 h-0.5 origin-left scale-x-0 rounded-[2px] bg-citrine shadow-[0_0_10px_rgba(245,230,99,0.6)] transition-transform duration-240 ease-brand group-hover:scale-x-100 group-focus-visible:scale-x-100 rtl:origin-right"
      />
    </Link>
  );
}

/**
 * Latest from Apporine (09-latest-section-spec.md): directly below the hero,
 * on Ink. The header row, then the Living Mosaic 48px below.
 */
export function Latest() {
  return (
    <Section labelledBy="latest-title" background="bg-ink" surface="dark" padding="py-[clamp(96px,10vw,160px)]">
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
        <div>
          <Reveal>
            <Eyebrow tone="dark">{eyebrow}</Eyebrow>
          </Reveal>
          <SectionHeadline
            id="latest-title"
            tone="dark"
            segments={headline}
            className="max-w-[min(1100px,80vw)] text-[clamp(40px,5.6vw,84px)] leading-[0.92] max-md:max-w-none"
          />
        </div>
        <Reveal>
          <AllLink />
        </Reveal>
      </div>

      <Reveal className="mt-12">
        <LatestMosaic stories={latestStories} readMore={readMore} />
      </Reveal>
    </Section>
  );
}
