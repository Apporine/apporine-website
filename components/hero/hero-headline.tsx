"use client";

import { motion, type Variants } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { EASE_BRAND, EXIT_S, TEXT_ENTER_DELAY_S } from "./hero-motion";
import type { TextSegment } from "@/lib/text";

type HeroHeadlineProps = {
  as: "h1" | "h2";
  segments: TextSegment[];
  reducedMotion: boolean;
};

type Word = { text: string; accent: boolean };

const LINE_STAGGER_S = 0.09;

function toWords(segments: TextSegment[]): Word[] {
  return segments.flatMap((segment) =>
    segment.text
      .split(" ")
      .filter(Boolean)
      .map((text) => ({ text, accent: Boolean(segment.accent) })),
  );
}

/** Line index of each word, worked out from the rendered layout. */
function useWordLines(ref: React.RefObject<HTMLElement | null>): number[] {
  const [lines, setLines] = useState<number[]>([]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      const tops = Array.from(
        element.querySelectorAll<HTMLElement>("[data-word]"),
        (word) => word.offsetTop,
      );
      const uniqueTops = [...new Set(tops)].sort((a, b) => a - b);
      const next = tops.map((top) => uniqueTops.indexOf(top));
      setLines((previous) => (previous.join() === next.join() ? previous : next));
    };

    // Fires once on observe, then whenever the headline reflows.
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    document.fonts.ready.then(measure).catch(() => {});
    return () => observer.disconnect();
  }, [ref]);

  return lines;
}

/**
 * Headline whose lines rise from a clipping mask, 90ms apart (spec section 6).
 * Each word sits in its own mask; words on the same line share a delay, so a
 * line moves as one. Line breaks are measured, so the reveal follows the
 * responsive wrapping. Animation states come from the parent slide variants.
 */
export function HeroHeadline({ as: Tag, segments, reducedMotion }: HeroHeadlineProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const lines = useWordLines(ref);
  const words = toWords(segments);

  const variants: Variants = reducedMotion
    ? { hidden: { y: "0%" }, shown: { y: "0%" } }
    : {
        hidden: { y: "110%", transition: { delay: EXIT_S, duration: 0 } },
        shown: (line: number) => ({
          y: "0%",
          transition: {
            delay: TEXT_ENTER_DELAY_S + line * LINE_STAGGER_S,
            duration: 0.7,
            ease: EASE_BRAND,
          },
        }),
      };

  return (
    <Tag
      ref={ref}
      className="mb-7 font-display md:max-w-[min(880px,60vw)] text-[clamp(44px,7vw,100px)] leading-[0.9] font-extrabold tracking-[-0.015em] text-plum-50 uppercase [font-variation-settings:'wdth'_75,'opsz'_96]"
    >
      {words.map((word, index) => (
        <Fragment key={index}>
          {index > 0 && " "}
          {/* Extra block padding keeps descenders and italics inside the mask. */}
          <span
            data-word=""
            className={`-my-[0.12em] inline-block overflow-hidden py-[0.12em] align-top ${
              word.accent
                ? "-me-[0.06em] pe-[0.06em] font-serif text-[1.05em] font-normal tracking-normal text-citrine normal-case italic [font-variation-settings:normal]"
                : ""
            }`}
          >
            <motion.span className="inline-block" custom={lines[index] ?? 0} variants={variants}>
              {word.text}
            </motion.span>
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
