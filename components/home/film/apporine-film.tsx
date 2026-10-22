"use client";

import { cubicBezier, motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { EASE_BRAND } from "@/components/hero/hero-motion";
import { Eyebrow } from "@/components/section/eyebrow";
import { useReducedMotion } from "@/components/section/motion";
import { SectionHeadline } from "@/components/section/section-headline";
import type { TextSegment } from "@/lib/text";
import { useSaveData } from "@/lib/use-browser-state";
import { FilmPlayer } from "./film-player";
import { TranscriptDialog } from "./transcript-dialog";

const eyebrow = "WHY APPORINE EXISTS";
const headline: TextSegment[] = [{ text: "Built for the decade, " }, { text: "not the quarter.", accent: true }];

/** The frame reaches full size at 85% of the pinned scroll, then holds. */
const EXPANDED_AT = 0.85;
/** The header is gone by 45% of the pinned scroll. */
const HEADER_GONE_AT = 0.45;
const HEADER_RISE_PX = -32;
const easeBrand = cubicBezier(...EASE_BRAND);

/** The frame's resting box, relative to the sticky stage, the stage size, and whether it is a phone (under 768px). */
type Geometry = { left: number; top: number; width: number; height: number; stageWidth: number; stageHeight: number; phone: boolean };
const UNMEASURED: Geometry = { left: 0, top: 0, width: 0, height: 0, stageWidth: 0, stageHeight: 0, phone: false };

/*
 * Pinned (sticky 100vh stage in a 180vh section, 130vh on phones) unless the
 * visitor asks for reduced motion or Save-Data; then the section is static.
 * The resting frame size is pure CSS (no layout shift): on 768px and up it is
 * min(90vw, 1600px, 78vh) at 16:9, and never taller than the space the stage
 * leaves it (container query height).
 */
const pinnedSection = "h-[130vh] md:h-[180vh] motion-reduce:h-auto";
const staticPadding = "py-[88px] md:py-[clamp(96px,12vw,176px)]";
const pinnedStage = `sticky top-0 h-svh pt-[clamp(88px,12vh,128px)] pb-6 motion-reduce:static motion-reduce:h-auto motion-reduce:py-[88px] md:motion-reduce:py-[clamp(96px,12vw,176px)]`;
const pinnedSlot = "md:min-h-0 md:flex-1 md:[container-type:size] motion-reduce:[container-type:normal]";
const frameSize = "w-[94vw] md:w-[min(90vw,1600px,calc(100cqh*16/9),calc(78vh*16/9))]";

/**
 * Section 3, the Apporine film: an expanding cinema. The frame grows from a
 * rounded 16:9 window to the full viewport as the visitor scrolls, while the
 * header fades and rises.
 */
export function ApporineFilm() {
  const reducedMotion = useReducedMotion();
  const saveData = useSaveData();
  const expanding = !reducedMotion && !saveData;

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  // Measured again on resize, so the frame follows it.
  const geometry = useMotionValue<Geometry>(UNMEASURED);

  useEffect(() => {
    const stage = stageRef.current;
    const box = boxRef.current;
    if (!stage || !box) return;
    const measure = () => {
      const stageRect = stage.getBoundingClientRect();
      // The resting box ignores the frame's own transforms: it is the box's layout.
      geometry.set({
        left: box.offsetLeft,
        top: box.offsetTop,
        width: box.offsetWidth,
        height: box.offsetHeight,
        stageWidth: stageRect.width,
        stageHeight: stageRect.height,
        phone: window.matchMedia("(max-width: 767px)").matches,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    observer.observe(box);
    return () => observer.disconnect();
  }, [geometry]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const expand = useTransform(scrollYProgress, [0, EXPANDED_AT], [0, 1], { ease: easeBrand });

  // Desktop and tablet: the full viewport. Phones: the full width, still 16:9.
  const target = (g: Geometry) => {
    const width = g.stageWidth;
    const height = g.phone ? (g.stageWidth * 9) / 16 : g.stageHeight;
    return { width, height, left: -g.left, top: g.phone ? -(height - g.height) / 2 : -g.top };
  };
  const useFrameValue = (pick: (g: Geometry, end: ReturnType<typeof target>, e: number) => string) =>
    useTransform(() => {
      const g = geometry.get();
      return pick(g, target(g), expand.get());
    });

  const x = useFrameValue((g, end, e) => `${end.left * e}px`);
  const y = useFrameValue((g, end, e) => `${end.top * e}px`);
  const width = useFrameValue((g, end, e) => (e === 0 ? "100%" : `${g.width + (end.width - g.width) * e}px`));
  const height = useFrameValue((g, end, e) => (e === 0 ? "100%" : `${g.height + (end.height - g.height) * e}px`));
  const borderRadius = useTransform(expand, (e) => `calc(var(--frame-radius) * ${1 - e})`);
  const headerOpacity = useTransform(scrollYProgress, [0, HEADER_GONE_AT], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, HEADER_GONE_AT], [0, HEADER_RISE_PX]);

  // Static (reduced motion, Save-Data): explicit resting values, so nothing set while expanding is left behind.
  const frameStyle = expanding
    ? { x, y, width, height, borderRadius }
    : { x: 0, y: 0, width: "100%", height: "100%", borderRadius: "var(--frame-radius)" };
  const headerStyle = expanding ? { opacity: headerOpacity, y: headerY } : { opacity: 1, y: 0 };
  const linkStyle = expanding ? { opacity: headerOpacity } : { opacity: 1 };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="film-title"
      data-surface="dark"
      className={`relative isolate bg-ink ${expanding ? pinnedSection : ""}`}
    >
      <div
        ref={stageRef}
        className={`flex flex-col items-center max-md:justify-center ${expanding ? pinnedStage : staticPadding}`}
      >
        <motion.div
          className="flex flex-col items-center px-6 text-center"
          style={headerStyle}
        >
          <Eyebrow tone="dark" className="mb-5 justify-center">
            {eyebrow}
          </Eyebrow>
          <SectionHeadline
            id="film-title"
            tone="dark"
            segments={headline}
            className="mb-[clamp(28px,4vh,48px)] max-w-[min(1100px,88vw)] text-[clamp(36px,4.6vw,72px)] leading-[0.92]"
          />
        </motion.div>

        <div className={`flex w-full items-center justify-center ${expanding ? pinnedSlot : ""}`}>
          <div ref={boxRef} className={`relative aspect-video [--frame-radius:20px] md:[--frame-radius:28px] ${frameSize}`}>
            <motion.div
              className="absolute top-0 left-0 z-10 size-full overflow-hidden rounded-[var(--frame-radius)] bg-ink"
              style={frameStyle}
            >
              <FilmPlayer autoplay={expanding} />
            </motion.div>
          </div>
        </div>

        <motion.div className="mt-4" style={linkStyle}>
          <TranscriptDialog />
        </motion.div>
      </div>
    </section>
  );
}
