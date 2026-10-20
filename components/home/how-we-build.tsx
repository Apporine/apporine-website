"use client";

import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import { gutter } from "@/components/layout";
import { Eyebrow } from "@/components/section/eyebrow";
import { LeadParagraph } from "@/components/section/lead-paragraph";
import { Reveal } from "@/components/section/reveal";
import { sectionPadding } from "@/components/section/section";
import { SectionHeadline } from "@/components/section/section-headline";
import { lightBodyColour } from "@/components/section/tone";
import { useMediaQuery } from "@/lib/use-browser-state";
import type { TextSegment } from "@/lib/text";

// Copy is locked: _brief/docs/08-homepage-content.md, section 6.
const eyebrow = "HOW WE BUILD";
const headline: TextSegment[] = [{ text: "Four steps. No " }, { text: "shortcuts.", accent: true }];
const paragraph = "The same discipline behind our own products, applied to yours.";

const steps = [
  {
    title: "Find the cost",
    body: "We start where your business loses the most, in money, time or trust. If we cannot measure the problem, we do not build.",
  },
  {
    title: "Design it pristine",
    body: "Architecture, security and experience are designed together, before a single line of code.",
  },
  {
    title: "Build and prove",
    body: "Short cycles, working software at every step, and results measured against the cost we found.",
  },
  {
    title: "Run and improve",
    body: "We stay accountable after launch, keeping it fast, secure and getting better.",
  },
];

/** Pinned from 1024px when motion is allowed (lg:motion-safe:); otherwise a static list. */
const PINNED_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/*
 * Inactive step body at 75% opacity: the lowest value that keeps 16px text at
 * 4.5:1 on Pearl (the spec's 45% fails WCAG AA; agreed with the founders).
 */
const INACTIVE_BODY_OPACITY = 0.75;

type Step = (typeof steps)[number];

/** Line from this step's chip centre to the next one's (li height plus the list gap). */
const connector = "absolute start-[17px] top-[18px] h-[calc(100%+40px)] w-0.5 xl:h-[calc(100%+48px)]";

type StepItemProps = {
  step: Step;
  index: number;
  active: boolean;
  /** Line fill, 0 to 1 across the four steps. */
  fill: MotionValue<number>;
  /** Pinned mode: the citrine fill is drawn. */
  filling: boolean;
};

function StepItem({ step, index, active, fill, filling }: StepItemProps) {
  const isLast = index === steps.length - 1;
  // This segment fills over its share of the line.
  const segmentFill = useTransform(fill, [index / (steps.length - 1), (index + 1) / (steps.length - 1)], [0, 1]);

  return (
    <li className="relative flex gap-6">
      {!isLast && <span aria-hidden="true" className={`${connector} bg-plum-200`} />}
      {!isLast && filling && (
        <motion.span
          aria-hidden="true"
          style={{ scaleY: segmentFill }}
          className={`${connector} origin-top bg-citrine shadow-[0_0_10px_rgba(245,230,99,0.6)]`}
        />
      )}
      <span
        className={`relative flex size-9 shrink-0 items-center justify-center rounded-full border font-mono text-[13px] font-medium transition-colors duration-240 ease-brand ${
          active ? "border-plum-800 bg-plum-800 text-citrine" : "border-plum-200 bg-plum-50 text-plum-600"
        }`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="pt-1">
        <h3
          className={`mb-2 font-sans text-2xl leading-[1.25] font-semibold transition-colors duration-240 ease-brand ${
            active ? "text-plum-800" : "text-plum-400"
          }`}
        >
          {step.title}
        </h3>
        <p
          style={{ opacity: active ? 1 : INACTIVE_BODY_OPACITY }}
          className={`max-w-[30rem] font-sans text-base leading-[1.6] transition-opacity duration-240 ease-brand ${lightBodyColour}`}
        >
          {step.body}
        </p>
      </div>
    </li>
  );
}

/**
 * Section 6 (07-homepage-spec.md): 300vh tall on desktop with a sticky 100vh
 * stage. Scrolling fills the line from step 01 to 04 in citrine and each step
 * lights up as the fill reaches it. Phones and reduced motion: no pinning,
 * every step fully visible, static line.
 */
export function HowWeBuild() {
  const sectionRef = useRef<HTMLElement>(null);
  const isPinned = useMediaQuery(PINNED_QUERY);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  // A short hold at both ends of the pinned scroll.
  const fill = useTransform(scrollYProgress, [0.1, 0.85], [0, 1]);
  const [reached, setReached] = useState(0);

  useMotionValueEvent(fill, "change", (value) => {
    // Step i is reached when the fill gets to its chip (at i / 3 of the line).
    const next = Math.min(steps.length - 1, Math.floor(value * (steps.length - 1) + 0.02));
    setReached((previous) => (previous === next ? previous : next));
  });

  return (
    <section ref={sectionRef} aria-labelledby="how-we-build-title" data-surface="light" className="relative isolate bg-plum-50 lg:motion-safe:h-[300vh]">
      <div className="lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:flex lg:motion-safe:h-screen lg:motion-safe:items-center">
        <div className={`${gutter} ${sectionPadding} grid gap-14 lg:grid-cols-12 lg:gap-12 lg:motion-safe:py-0`}>
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow tone="light">{eyebrow}</Eyebrow>
            </Reveal>
            <SectionHeadline id="how-we-build-title" tone="light" segments={headline} className="mb-7 text-[clamp(40px,5.6vw,84px)] leading-[0.92]" />
            <Reveal>
              <LeadParagraph tone="light">{paragraph}</LeadParagraph>
            </Reveal>
          </div>

          <ol className="flex flex-col gap-10 lg:col-span-6 lg:col-start-7 xl:gap-12">
            {steps.map((step, index) => (
              <StepItem
                key={step.title}
                step={step}
                index={index}
                active={!isPinned || index <= reached}
                fill={fill}
                filling={isPinned}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
