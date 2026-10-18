"use client";

import { motion, type Variants } from "motion/react";
import { ButtonLink } from "@/components/button-link";
import { Falcon } from "@/components/falcon";
import { gutter } from "@/components/layout";
import { HeroHeadline } from "./hero-headline";
import { HeroMedia } from "./hero-media";
import { EASE_BRAND, EXIT_S, TEXT_ENTER_DELAY_S } from "./hero-motion";
import type { Slide, TextSegment } from "./slides";

type HeroSlideProps = {
  slide: Slide;
  index: number;
  total: number;
  isActive: boolean;
  isLoadTarget: boolean;
  playing: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
};

const REDUCED_FADE_S = 0.2;

/** Wrapper: fades the whole block out on exit; children handle the entrance. */
function blockVariants(reducedMotion: boolean): Variants {
  if (reducedMotion) {
    return {
      hidden: { opacity: 0, transition: { duration: REDUCED_FADE_S } },
      shown: { opacity: 1, transition: { delay: REDUCED_FADE_S, duration: REDUCED_FADE_S } },
    };
  }
  return {
    hidden: { opacity: 0, transition: { duration: EXIT_S, ease: EASE_BRAND } },
    shown: { opacity: 1, transition: { duration: 0 } },
  };
}

/** Fade (and optionally rise 16px) after `delay`; reset once the exit fade is done. */
function itemVariants(reducedMotion: boolean, delay: number, duration: number, rise: number): Variants {
  if (reducedMotion) return { hidden: { opacity: 1, y: 0 }, shown: { opacity: 1, y: 0 } };
  return {
    hidden: { opacity: 0, y: rise, transition: { delay: EXIT_S, duration: 0 } },
    shown: { opacity: 1, y: 0, transition: { delay, duration, ease: EASE_BRAND } },
  };
}

// Entrance offsets: eyebrow with the text start, copy +350ms and buttons
// +500ms after the headline starts (spec section 6).
const EYEBROW = { delay: TEXT_ENTER_DELAY_S, duration: 0.4, rise: 0 };
const COPY = { delay: TEXT_ENTER_DELAY_S + 0.35, duration: 0.5, rise: 16 };
const BUTTONS = { delay: TEXT_ENTER_DELAY_S + 0.5, duration: 0.5, rise: 16 };

/** Barely visible halo that lifts body copy off busy video frames. */
const SOFT_TEXT_SHADOW = "[text-shadow:0_1px_24px_rgba(18,4,26,0.8)]";

function Subheadline({ segments }: { segments: TextSegment[] }) {
  return (
    <p
      className={`mb-5 max-w-[640px] font-sans text-[clamp(20px,2vw,28px)] leading-[1.3] font-medium tracking-[-0.005em] text-plum-50 ${SOFT_TEXT_SHADOW}`}
    >
      {segments.map((segment, index) =>
        segment.accent ? (
          <em key={index} className="font-serif font-normal tracking-normal text-citrine italic">
            {segment.text}
          </em>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </p>
  );
}

/** One carousel slide: background media plus the text block (spec sections 2 to 5). */
export function HeroSlide({
  slide,
  index,
  total,
  isActive,
  isLoadTarget,
  playing,
  isMobile,
  reducedMotion,
}: HeroSlideProps) {
  const variant = (timing: typeof COPY) =>
    itemVariants(reducedMotion, timing.delay, timing.duration, timing.rise);

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}`}
      aria-hidden={isActive ? undefined : true}
      inert={!isActive}
      // Incoming slide fades in on top; the outgoing one stays opaque beneath
      // it until the cross fade has finished, so the plum base never shows.
      className={`relative col-start-1 row-start-1 flex flex-col transition-opacity ease-brand ${
        isActive
          ? "z-10 opacity-100 duration-(--dur-crossfade) motion-reduce:duration-200"
          : "z-0 opacity-0 delay-(--dur-crossfade) duration-0 motion-reduce:delay-200"
      }`}
    >
      <HeroMedia
        media={slide.media}
        scrim={slide.scrim}
        isActive={isActive}
        isLoadTarget={isLoadTarget}
        playing={playing}
        isMobile={isMobile}
        reducedMotion={reducedMotion}
        priority={index === 0}
      />

      <div
        className={`${gutter} relative flex flex-1 flex-col justify-end pt-[120px] pb-[120px] md:justify-center`}
      >
        {/* Each text element sets its own max width (spec section 4). */}
        <div className="md:-translate-y-[4vh]">
          <motion.div
            initial={false}
            animate={isActive ? "shown" : "hidden"}
            variants={blockVariants(reducedMotion)}
          >
            <motion.p
              variants={variant(EYEBROW)}
              className="mb-7 flex items-center gap-2.5 font-mono text-xs leading-[1.3] font-medium tracking-[0.18em] text-plum-300 uppercase"
            >
              <Falcon width={22} height={10} className="h-[10px] w-[22px] shrink-0 object-contain" />
              {slide.eyebrow}
            </motion.p>

            <HeroHeadline
              as={index === 0 ? "h1" : "h2"}
              segments={slide.headline}
              reducedMotion={reducedMotion}
            />

            <motion.div variants={variant(COPY)}>
              {slide.subheadline && <Subheadline segments={slide.subheadline} />}
              {/* Mobile: brighter, slightly heavier copy for readability over video. */}
              <p
                className={`mb-10 max-w-[34rem] font-sans text-base leading-[1.6] font-[450] text-plum-100 md:text-[clamp(16px,1.25vw,19px)] md:font-normal md:text-plum-300 ${SOFT_TEXT_SHADOW}`}
              >
                {slide.paragraph}
              </p>
            </motion.div>

            <motion.div variants={variant(BUTTONS)} className="flex flex-col gap-3 md:flex-row md:flex-wrap">
              <ButtonLink href={slide.primary.href} variant="primary" className="w-full md:w-auto">
                {slide.primary.label}
              </ButtonLink>
              <ButtonLink href={slide.secondary.href} variant="secondary" className="w-full md:w-auto">
                {slide.secondary.label}
              </ButtonLink>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
