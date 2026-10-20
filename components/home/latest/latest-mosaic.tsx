"use client";

import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { useFinePointer, useReducedMotion } from "@/components/section/motion";
import type { LatestStory } from "@/lib/latest";
import { useDocumentHidden, useMediaQuery } from "@/lib/use-browser-state";
import { LatestCard } from "./latest-card";

type LatestMosaicProps = {
  stories: LatestStory[];
  readMore: string;
};

/**
 * The Living Mosaic (09-latest-section-spec.md, sections 3 to 7).
 * From 1024px: one row where the hovered or focused card opens wide; card 1
 * is open by default and again once the pointer or focus leaves the row.
 * 768 to 1023px: card 1 full width over a 2 by 2 grid, films on hover for
 * fine pointers. Under 768px: a swipe row of stills.
 */
export function LatestMosaic({ stories, readMore }: LatestMosaicProps) {
  const ref = useRef<HTMLUListElement>(null);
  const near = useInView(ref, { margin: "50% 0px 50% 0px", once: true });
  const inView = useInView(ref);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px)");
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const documentHidden = useDocumentHidden();
  // The card last hovered or focused; null is the default state.
  const [active, setActive] = useState<number | null>(null);

  const expanded = active ?? 0;
  const filmEnabled = isTablet && !reducedMotion;
  const canPlay = filmEnabled && inView && !documentHidden;
  const live = !canPlay ? null : isDesktop ? expanded : finePointer ? active : null;

  return (
    <ul
      ref={ref}
      onPointerLeave={() => setActive(null)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setActive(null);
      }}
      className="@container -mx-6 -my-2 flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto px-6 py-2 [scrollbar-width:none] md:m-0 md:grid md:grid-cols-2 md:overflow-visible md:p-0 lg:flex lg:h-[560px]"
    >
      {stories.map((story, index) => (
        <LatestCard
          key={story.href}
          story={story}
          index={index}
          readMore={readMore}
          expanded={index === expanded}
          live={index === live}
          filmEnabled={filmEnabled}
          near={near}
          onActivate={setActive}
        />
      ))}
    </ul>
  );
}
