"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { RingO } from "@/components/brand-marks";
import { displayClass } from "@/components/section/tone";
import { useReducedMotion } from "@/components/section/motion";

/** The wordmark rises this far as the footer enters. */
const PARALLAX_PX = 40;

/**
 * Monumental wordmark (07-homepage-spec.md, section 13): APPORINE across the
 * full width in --plum-900 on --plum-950, the O replaced by the ring O at
 * cap height and 35% opacity. Gentle parallax; none for reduced motion.
 * Decorative. The letters are drawn from CSS content so they are not page
 * text (they are deliberately low contrast).
 */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], [PARALLAX_PX, 0]);

  return (
    <div ref={ref} aria-hidden="true" className="overflow-hidden">
      <motion.div
        style={reducedMotion ? undefined : { y }}
        // 25vw: in the condensed cut the word then spans the content width (19vw covered about two thirds).
        className={`${displayClass} flex items-baseline justify-center pb-[0.04em] text-[25vw] leading-[0.8] tracking-[-0.02em] text-plum-900 select-none`}
      >
        <span className="before:content-['APP']" />
        <RingO width={132} height={132} className="mx-[0.03em] h-[0.7em] w-[0.7em] self-center opacity-35" />
        <span className="before:content-['RINE']" />
      </motion.div>
    </div>
  );
}
