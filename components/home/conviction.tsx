"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Fragment, useRef } from "react";
import { EASE_BRAND } from "@/components/hero/hero-motion";
import { Eyebrow } from "@/components/section/eyebrow";
import { LeadParagraph } from "@/components/section/lead-paragraph";
import { REDUCED_FADE_S, VIEWPORT, useReducedMotion } from "@/components/section/motion";
import { Reveal } from "@/components/section/reveal";
import { Section } from "@/components/section/section";
import { accentClass, displayClass } from "@/components/section/tone";
import { toWords, type Word } from "@/lib/use-word-lines";
import type { TextSegment } from "@/lib/text";

// Copy is locked: _brief/docs/08-homepage-content.md, section 3.
const eyebrow = "OUR CONVICTION";
const headline: TextSegment[] = [
  { text: "Every costly problem is a product waiting to be " },
  { text: "built.", accent: true },
];
const paragraph =
  "Downtime, fraud, delay and waste are not the cost of doing business. They are problems nobody has engineered away. Yet. We find them, measure them and build the software that ends them for good.";

/*
 * Words start at 35% opacity: the lowest value that keeps the large headline
 * at 3:1 contrast on --plum-950 (the spec's 18% fails WCAG AA; agreed with
 * the founders).
 */
const WORD_START_OPACITY = 0.35;
/** Share of the scroll range each word takes to reach full opacity. */
const WORD_WINDOW = 0.3;

const SIGNATURE_S = 0.9;

type ScrubbedWordProps = {
  word: Word;
  index: number;
  total: number;
  progress: MotionValue<number>;
  /** Reduced motion: no scrubbing, full opacity. */
  still: boolean;
};

function ScrubbedWord({ word, index, total, progress, still }: ScrubbedWordProps) {
  // Words light up in reading order; the last (the accent) reaches full colour last.
  const start = (index / total) * (1 - WORD_WINDOW);
  const opacity = useTransform(progress, [start, start + WORD_WINDOW], [WORD_START_OPACITY, 1]);
  return (
    <motion.span style={{ opacity: still ? 1 : opacity }} className={word.accent ? accentClass("dark") : undefined}>
      {word.text}
    </motion.span>
  );
}

/**
 * Section 3 (07-homepage-spec.md): text only. A citrine signature line draws
 * across the margins as the section enters, and the headline's words light
 * up as it scrolls from 80% to 35% of the viewport.
 */
export function Conviction() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: headlineRef, offset: ["start 0.8", "start 0.35"] });
  const words = toWords(headline);

  return (
    <Section labelledBy="conviction-title" background="bg-plum-950">
      <div aria-hidden="true" className="film-grain" />

      <motion.div
        aria-hidden="true"
        // Reduced motion: the line fades in at full length.
        initial={reducedMotion ? { scaleX: 1, opacity: 0 } : { scaleX: 0, opacity: 1 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={VIEWPORT}
        transition={reducedMotion ? { duration: REDUCED_FADE_S } : { duration: SIGNATURE_S, ease: EASE_BRAND }}
        className="mb-12 h-px origin-left bg-citrine shadow-[0_0_12px_rgba(245,230,99,0.55)] md:mb-16 rtl:origin-right"
      />

      <Reveal>
        <Eyebrow tone="dark">{eyebrow}</Eyebrow>
      </Reveal>

      <h2
        ref={headlineRef}
        id="conviction-title"
        className={`${displayClass} mb-10 max-w-[min(1100px,80vw)] text-[clamp(48px,7vw,112px)] leading-[0.92] text-plum-50 max-md:max-w-none`}
      >
        {words.map((word, index) => (
          <Fragment key={index}>
            {index > 0 && " "}
            <ScrubbedWord
              word={word}
              index={index}
              total={words.length}
              progress={scrollYProgress}
              still={reducedMotion}
            />
          </Fragment>
        ))}
      </h2>

      <Reveal>
        <LeadParagraph tone="dark" className="max-w-[40rem]">
          {paragraph}
        </LeadParagraph>
      </Reveal>
    </Section>
  );
}
