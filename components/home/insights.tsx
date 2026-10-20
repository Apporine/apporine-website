import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/section/eyebrow";
import { LeadParagraph } from "@/components/section/lead-paragraph";
import { Reveal } from "@/components/section/reveal";
import { Section } from "@/components/section/section";
import { SectionHeadline } from "@/components/section/section-headline";
import { focusRingLight, labelClass, lightBodyColour } from "@/components/section/tone";
import { routes } from "@/lib/routes";
import type { Article } from "@/lib/site";
import type { TextSegment } from "@/lib/text";

// Copy is locked: _brief/docs/08-homepage-content.md, section 11.
const eyebrow = "INSIGHTS";
const headline: TextSegment[] = [{ text: "Thinking that holds up in " }, { text: "production.", accent: true }];
const paragraph = "Field notes on engineering, AI in production and the problems that cost industries most.";
const allInsights = { label: "All insights", href: routes.insights };

/** Articles shown; the section appears only when there are at least this many. */
export const INSIGHTS_SHOWN = 3;

function ArrowLink({ href, children, stretched = false }: { href: string; children: string; stretched?: boolean }) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={`group/link inline-flex items-center gap-2 rounded-sm ${focusRingLight} ${
        stretched ? "after:absolute after:inset-0 after:content-['']" : ""
      }`}
    >
      {children}
      <span aria-hidden="true" className="inline-block transition-transform duration-[180ms] ease-brand group-hover/link:translate-x-1 rtl:-scale-x-100">
        →
      </span>
    </Link>
  );
}

/** Section 11 (07-homepage-spec.md): the three latest articles. Rendered only from three articles up. */
export function Insights({ articles }: { articles: Article[] }) {
  return (
    <Section labelledBy="insights-title" background="bg-plum-100" surface="light">
      <Reveal>
        <Eyebrow tone="light">{eyebrow}</Eyebrow>
      </Reveal>
      <SectionHeadline id="insights-title" tone="light" segments={headline} />
      <Reveal>
        <LeadParagraph tone="light">{paragraph}</LeadParagraph>
      </Reveal>

      <ul className="mt-14 grid gap-6 md:mt-20 md:grid-cols-3">
        {articles.slice(0, INSIGHTS_SHOWN).map((article, index) => (
          <Reveal key={article.href} as="li" index={index}>
            <article data-cursor="open" className="relative">
              <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-[24px] bg-plum-200">
                <Image src={article.cover} alt={article.coverAlt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              <p className={`${labelClass} mb-3 text-plum-600`}>{article.category}</p>
              <h3 className="mb-3 font-sans text-[22px] leading-[1.3] font-semibold text-plum-800">
                <ArrowLink href={article.href} stretched>
                  {article.title}
                </ArrowLink>
              </h3>
              <p className={`font-sans text-[15px] ${lightBodyColour}`}>{article.readingTime}</p>
            </article>
          </Reveal>
        ))}
      </ul>

      <Reveal className="mt-12 font-sans text-[15px] font-semibold text-plum-800">
        <ArrowLink href={allInsights.href}>{allInsights.label}</ArrowLink>
      </Reveal>
    </Section>
  );
}
