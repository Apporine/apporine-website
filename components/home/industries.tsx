"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { EASE_BRAND } from "@/components/hero/hero-motion";
import { Chevron } from "@/components/nav/chevron";
import { Eyebrow } from "@/components/section/eyebrow";
import { LeadParagraph } from "@/components/section/lead-paragraph";
import { REDUCED_FADE_S, useReducedMotion } from "@/components/section/motion";
import { Reveal } from "@/components/section/reveal";
import { Section } from "@/components/section/section";
import { SectionHeadline } from "@/components/section/section-headline";
import { displayClass, focusRing, labelClass } from "@/components/section/tone";
import { routes } from "@/lib/routes";
import type { TextSegment } from "@/lib/text";

// Copy is locked: _brief/docs/08-homepage-content.md, section 8.
const eyebrow = "INDUSTRIES";
const headline: TextSegment[] = [
  { text: "We build for industries where one bad hour can cost " },
  { text: "millions.", accent: true },
];
const paragraph = "We go where reliability is not a feature but the business itself.";
const problemLabel = "THE COSTLY PROBLEM";
const buildLabel = "WHAT WE BUILD";

type Industry = {
  id: string;
  name: string;
  problem: string;
  build: string;
  link: { label: string; href: string };
  /** Panel visual; reuses the hero posters for now. */
  poster: string;
};

const MONOLITH = "/videos/hero-01-monolith-poster.webp";
const ARMILLARY = "/videos/hero-02-armillary-poster.webp";
const BRIDGE = "/videos/hero-03-bridge-poster.webp";

const industries: Industry[] = [
  {
    id: "financial-services",
    name: "Financial services",
    problem: "Payment outages, fraud and manual reviews that slow every transaction.",
    build: "Resilient payment operations, fraud intelligence and automated compliance workflows.",
    link: { label: "Explore financial services", href: routes.financialServices },
    poster: MONOLITH,
  },
  {
    id: "insurance",
    name: "Insurance",
    problem: "Slow claims, leakage and processes still built on paper.",
    build: "Claims automation, leakage detection and broker platforms.",
    link: { label: "Explore insurance", href: routes.insurance },
    poster: BRIDGE,
  },
  {
    id: "telecommunications",
    name: "Telecommunications",
    problem: "Network incidents that ripple out to millions of customers.",
    build: "Incident intelligence, self healing operations and customer platforms.",
    link: { label: "Explore telecommunications", href: routes.telecommunications },
    poster: MONOLITH,
  },
  {
    id: "energy-and-utilities",
    name: "Energy and utilities",
    problem: "Ageing systems running grids that cannot fail.",
    build: "Grid operations software, asset monitoring and field apps.",
    link: { label: "Explore energy and utilities", href: routes.energyAndUtilities },
    poster: ARMILLARY,
  },
  {
    id: "logistics",
    name: "Logistics",
    problem: "Disconnected systems and delays that compound across the chain.",
    build: "Visibility platforms, routing intelligence and integration.",
    link: { label: "Explore logistics", href: routes.logistics },
    poster: BRIDGE,
  },
  {
    id: "retail-and-ecommerce",
    name: "Retail and ecommerce",
    problem: "Stock gaps, abandoned checkouts and failures on peak days.",
    build: "Commerce platforms, demand forecasting and resilient checkout.",
    link: { label: "Explore retail and ecommerce", href: routes.retailAndEcommerce },
    poster: ARMILLARY,
  },
];

/** Darkens the poster so the blocks at the bottom read clearly. */
const PANEL_SCRIM =
  "linear-gradient(0deg, rgba(18,4,26,0.94) 0%, rgba(18,4,26,0.78) 38%, rgba(18,4,26,0.25) 75%, rgba(18,4,26,0.1) 100%)";

const SWITCH_S = 0.3;

const itemType = `${displayClass} text-[clamp(28px,3vw,44px)] leading-[1]`;

function Details({ industry }: { industry: Industry }) {
  return (
    <>
      <dl className="grid gap-6 md:grid-cols-2 md:gap-8">
        <div>
          <dt className={`${labelClass} mb-2 text-plum-300`}>{problemLabel}</dt>
          <dd className="font-sans text-lg leading-[1.5] text-plum-50">{industry.problem}</dd>
        </div>
        <div>
          <dt className={`${labelClass} mb-2 text-plum-300`}>{buildLabel}</dt>
          <dd className="font-sans text-lg leading-[1.5] text-plum-50">{industry.build}</dd>
        </div>
      </dl>
      <Link
        href={industry.link.href}
        prefetch={false}
        className={`group mt-7 inline-flex items-center gap-2 rounded-sm font-sans text-[15px] font-semibold text-citrine ${focusRing}`}
      >
        {industry.link.label}
        <span aria-hidden="true" className="inline-block transition-transform duration-[180ms] ease-brand group-hover:translate-x-1 rtl:-scale-x-100">
          →
        </span>
      </Link>
    </>
  );
}

/** Desktop: the list as vertical tabs (hover, focus or arrow keys) and the detail panel. */
function IndustryTabs() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reducedMotion = useReducedMotion();
  const industry = industries[active];

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const last = industries.length - 1;
    const next =
      event.key === "ArrowDown" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowUp" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="hidden lg:grid lg:grid-cols-12 lg:gap-12">
      <div role="tablist" aria-label="Industries" aria-orientation="vertical" className="col-span-5 flex flex-col items-start gap-2">
        {industries.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={`industry-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="industry-panel"
              tabIndex={selected ? 0 : -1}
              onPointerEnter={(event) => event.pointerType === "mouse" && setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`${itemType} relative flex items-center gap-4 rounded-sm py-2 text-start text-plum-50 transition-opacity duration-240 ease-brand ${focusRing} ${
                selected ? "opacity-100" : "opacity-35 hover:opacity-70"
              }`}
            >
              <span
                aria-hidden="true"
                className={`size-2 shrink-0 rounded-full bg-citrine transition-[opacity,scale] duration-240 ease-brand ${
                  selected ? "scale-100 opacity-100" : "scale-50 opacity-0"
                }`}
              />
              <span className="relative">
                {item.name}
                {/* The light seam underline. */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-1.5 h-0.5 origin-left rounded-[2px] bg-citrine shadow-[0_0_10px_rgba(245,230,99,0.6)] transition-[opacity,scale] duration-320 ease-brand rtl:origin-right ${
                    selected ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                  }`}
                />
              </span>
            </button>
          );
        })}
      </div>

      <div
        id="industry-panel"
        role="tabpanel"
        aria-labelledby={`industry-tab-${industry.id}`}
        className="relative col-span-7 h-[520px] overflow-hidden rounded-[28px] bg-plum-900"
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={industry.id}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(10px)" }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? REDUCED_FADE_S : SWITCH_S, ease: EASE_BRAND }}
            className="absolute inset-0 flex flex-col justify-end p-10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative poster, already web optimised */}
            <img src={industry.poster} alt="" loading="lazy" decoding="async" className="absolute inset-0 -z-20 size-full object-cover" />
            <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ backgroundImage: PANEL_SCRIM }} />
            <Details industry={industry} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Under 1024px: an accordion, each item opening its two blocks and link (no image). */
function IndustryAccordion() {
  const [open, setOpen] = useState<string | null>(industries[0].id);
  const reducedMotion = useReducedMotion();
  const transition = { duration: reducedMotion ? 0 : 0.3, ease: EASE_BRAND };

  return (
    <ul className="border-t border-plum-700 lg:hidden">
      {industries.map((industry) => {
        const expanded = open === industry.id;
        const regionId = `industry-region-${industry.id}`;
        return (
          <li key={industry.id} className="border-b border-plum-700">
            <h3>
              <button
                id={`${regionId}-button`}
                type="button"
                aria-expanded={expanded}
                aria-controls={regionId}
                onClick={() => setOpen(expanded ? null : industry.id)}
                className={`${itemType} flex w-full items-center justify-between gap-4 rounded-sm py-5 text-start text-plum-50 ${focusRing}`}
              >
                <span className="flex items-center gap-3">
                  {expanded && <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-citrine" />}
                  {industry.name}
                </span>
                <Chevron open={expanded} className="size-4" />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  id={regionId}
                  role="region"
                  aria-labelledby={`${regionId}-button`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={transition}
                  className="overflow-hidden"
                >
                  <div className="pb-8">
                    <Details industry={industry} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

/** Section 8 (07-homepage-spec.md): the six industries, their costly problem and what we build. */
export function Industries() {
  return (
    <Section labelledBy="industries-title" background="bg-plum-950" surface="dark">
      <Reveal>
        <Eyebrow tone="dark">{eyebrow}</Eyebrow>
      </Reveal>
      <SectionHeadline id="industries-title" tone="dark" segments={headline} />
      <Reveal>
        <LeadParagraph tone="dark">{paragraph}</LeadParagraph>
      </Reveal>

      <Reveal className="mt-14 md:mt-20">
        <IndustryTabs />
        <IndustryAccordion />
      </Reveal>
    </Section>
  );
}
