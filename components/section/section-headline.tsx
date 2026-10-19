"use client";

import { Fragment } from "react";
import { toWords, useWordLines } from "@/lib/use-word-lines";
import type { TextSegment } from "@/lib/text";
import { accentClass, displayClass, type Tone } from "./tone";
import { useInViewOnce } from "./use-in-view-once";

type SectionHeadlineProps = {
  id: string;
  tone: Tone;
  segments: TextSegment[];
  /** Size, line height and width; defaults to the section H2 scale. */
  className?: string;
};

/** Section H2: clamp(40px, 5.6vw, 84px), line height 0.92. */
const h2Scale = "mb-7 max-w-[min(1100px,80vw)] text-[clamp(40px,5.6vw,84px)] leading-[0.92] max-md:max-w-none";

/**
 * Section headline whose lines rise from a clipping mask, 90ms apart, once
 * 20% of it is in view (as in the hero). Each word sits in its own mask and
 * words on one line share a delay, so a line moves as one. Reduced motion:
 * a 200ms fade. CSS transitions (.line-reveal in app/globals.css).
 */
export function SectionHeadline({ id, tone, segments, className = h2Scale }: SectionHeadlineProps) {
  const [ref, inView] = useInViewOnce<HTMLHeadingElement>();
  // Lines are measured once in view; the reveal starts when they are known.
  const lines = useWordLines(ref, inView);
  const words = toWords(segments);
  const shown = inView && lines.length > 0;

  return (
    <h2
      ref={ref}
      id={id}
      data-shown={shown || undefined}
      className={`line-reveal ${displayClass} ${tone === "dark" ? "text-plum-50" : "text-plum-800"} ${className}`}
    >
      {words.map((word, index) => (
        <Fragment key={index}>
          {index > 0 && " "}
          {/* Extra block padding keeps descenders and italics inside the mask. */}
          <span
            data-word=""
            className={`-my-[0.12em] inline-block overflow-hidden py-[0.12em] align-top ${
              word.accent ? accentClass(tone) : ""
            }`}
          >
            <span className="inline-block" style={{ "--line": lines[index] ?? 0 } as React.CSSProperties}>
              {word.text}
            </span>
          </span>
        </Fragment>
      ))}
    </h2>
  );
}
