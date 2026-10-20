import Link from "next/link";
import { ButtonLink } from "@/components/button-link";
import { Eyebrow } from "@/components/section/eyebrow";
import { LeadParagraph } from "@/components/section/lead-paragraph";
import { Reveal } from "@/components/section/reveal";
import { Section } from "@/components/section/section";
import { SectionHeadline } from "@/components/section/section-headline";
import { SegmentText } from "@/components/section/segment-text";
import { displayClass, focusRingLight, lightBodyColour } from "@/components/section/tone";
import { anchors, routes } from "@/lib/routes";
import type { TextSegment } from "@/lib/text";
import { CapabilityIconSvg, type CapabilityIcon } from "./capability-icons";

// Copy is locked: _brief/docs/08-homepage-content.md, section 7.
const eyebrow = "WHAT WE BUILD";
const headline: TextSegment[] = [{ text: "From core platforms to intelligent " }, { text: "agents.", accent: true }];
const paragraph = "Whatever the problem needs, built to the standard of our own products.";

const capabilities: { icon: CapabilityIcon; title: string; body: string }[] = [
  { icon: "platforms", title: "Enterprise platforms", body: "Core systems your business runs on, built to last a decade." },
  { icon: "agents", title: "AI agents and automation", body: "Intelligence that does real work, inside the guardrails you set." },
  { icon: "apps", title: "Web and mobile apps", body: "Products your customers and teams choose to use." },
  { icon: "cloud", title: "Cloud and DevOps", body: "Infrastructure built to stay up, scale and recover." },
  { icon: "data", title: "Data and integration", body: "Every system connected. Every number you can trust." },
];

const invitation = {
  title: [{ text: "Something else in " }, { text: "mind?", accent: true }] as TextSegment[],
  body: "Tell us the problem worth solving. We will tell you what we would build.",
  button: { label: "Start building", href: anchors.start },
};

const tile = "relative flex h-full min-h-[260px] flex-col rounded-[24px] p-8";

/**
 * Section 7 (07-homepage-spec.md): five glass capability tiles and the
 * invitation tile. Each capability links to What we build, like the same
 * items in the navigation and footer; the whole tile is the link's hit area.
 */
export function WhatWeBuild() {
  return (
    <Section labelledBy="what-we-build-title" background="bg-plum-100" surface="light">
      <Reveal>
        <Eyebrow tone="light">{eyebrow}</Eyebrow>
      </Reveal>
      <SectionHeadline id="what-we-build-title" tone="light" segments={headline} />
      <Reveal>
        <LeadParagraph tone="light">{paragraph}</LeadParagraph>
      </Reveal>

      <ul className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((capability, index) => (
          <Reveal key={capability.title} as="li" index={index}>
            <div
              data-cursor="open"
              className={`${tile} group border border-plum-200 bg-[rgba(251,249,252,0.65)] backdrop-blur-[12px] transition-[translate,border-color] duration-240 ease-brand hover:-translate-y-1 hover:border-orchid has-focus-visible:border-orchid motion-reduce:hover:translate-y-0`}
            >
              <CapabilityIconSvg icon={capability.icon} />
              {/* Small arrow, top right, on hover. */}
              <span
                aria-hidden="true"
                className="absolute end-8 top-8 -translate-x-1 font-sans text-xl text-plum-800 opacity-0 transition-[opacity,translate] duration-240 ease-brand group-hover:translate-x-0 group-hover:opacity-100 group-has-focus-visible:translate-x-0 group-has-focus-visible:opacity-100 rtl:-scale-x-100"
              >
                →
              </span>
              <h3 className="mt-auto pt-10 font-sans text-[22px] leading-[1.3] font-semibold text-plum-800">
                <Link
                  href={routes.build}
                  prefetch={false}
                  className={`rounded-sm after:absolute after:inset-0 after:rounded-[24px] after:content-[''] ${focusRingLight}`}
                >
                  {capability.title}
                </Link>
              </h3>
              <p className={`mt-2 font-sans text-base leading-[1.6] ${lightBodyColour}`}>{capability.body}</p>
            </div>
          </Reveal>
        ))}

        <Reveal as="li" index={capabilities.length}>
          <div data-surface="dark" className={`${tile} items-start bg-plum-800 text-plum-50`}>
            <h3 className={`${displayClass} text-[28px] leading-[0.95] text-plum-50`}>
              <SegmentText segments={invitation.title} tone="dark" />
            </h3>
            <p className="mt-3 mb-8 font-sans text-base leading-[1.6] text-plum-50">{invitation.body}</p>
            <ButtonLink href={invitation.button.href} variant="primary" className="mt-auto">
              {invitation.button.label}
            </ButtonLink>
          </div>
        </Reveal>
      </ul>
    </Section>
  );
}
