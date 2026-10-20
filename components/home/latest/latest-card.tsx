"use client";

import Link from "next/link";
import { labelClass } from "@/components/section/tone";
import type { LatestStory } from "@/lib/latest";
import { CardMedia } from "./card-media";

type LatestCardProps = {
  story: LatestStory;
  index: number;
  readMore: string;
  /** Desktop: this card is the wide one. */
  expanded: boolean;
  /** The film plays and the citrine line draws. */
  live: boolean;
  filmEnabled: boolean;
  near: boolean;
  onActivate: (index: number) => void;
};

/**
 * One mosaic card (09-latest-section-spec.md, section 4): a single link to
 * its page, named by its heading and category. Opening, the heading size and
 * the description reveal are CSS (.latest-card in app/globals.css).
 */
export function LatestCard({ story, index, readMore, expanded, live, filmEnabled, near, onActivate }: LatestCardProps) {
  const descriptionId = `latest-${index}-description`;

  return (
    <li
      data-expanded={expanded || undefined}
      className={`latest-card h-[480px] w-[82vw] shrink-0 snap-start md:h-[360px] md:w-auto lg:h-auto lg:shrink ${
        index === 0 ? "md:col-span-2 md:h-[440px]" : ""
      }`}
    >
      <Link
        href={story.href}
        prefetch={false}
        aria-label={`${story.heading}, ${story.category}`}
        aria-describedby={descriptionId}
        data-cursor="open"
        onPointerEnter={() => onActivate(index)}
        onFocus={() => onActivate(index)}
        className="group/card relative isolate flex size-full flex-col justify-end overflow-hidden rounded-[20px] border border-plum-300/14 bg-ink focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-citrine"
      >
        <CardMedia
          film={story.film}
          focalPoint={story.focalPoint}
          filmEnabled={filmEnabled}
          near={near}
          playing={live}
        />
        {/* Layer 3: the readability gradient. */}
        <div aria-hidden="true" className="latest-scrim absolute inset-0 -z-10" />

        {/* Layer 4: the citrine line along the top edge. */}
        <span
          aria-hidden="true"
          className={`absolute inset-x-0 top-0 h-0.5 origin-left bg-citrine shadow-[0_0_12px_rgba(245,230,99,0.55)] transition-transform duration-500 ease-brand motion-reduce:transition-none rtl:origin-right ${
            live ? "scale-x-100" : "scale-x-0"
          }`}
        />

        <div className="latest-text">
          <p className={`${labelClass} mb-3 text-plum-200`}>{story.category}</p>
          <h3 className="latest-heading font-sans font-semibold max-lg:text-[22px] max-lg:leading-[1.25] text-plum-50">
            {story.heading}
          </h3>
          <div className="latest-more">
            <div className="min-h-0">
              <p
                id={descriptionId}
                className="latest-more-item latest-description mt-3 max-w-[28rem] font-sans text-[15px] leading-[1.55] text-plum-100"
              >
                {story.description}
              </p>
              <span
                aria-hidden="true"
                style={{ "--item-delay": "300ms" } as React.CSSProperties}
                className="latest-more-item mt-4 inline-flex items-center gap-2 font-sans text-[15px] font-semibold text-citrine"
              >
                {readMore}
                <span className="inline-block transition-transform duration-[180ms] ease-brand group-hover/card:translate-x-1 rtl:-scale-x-100 rtl:group-hover/card:-translate-x-1">
                  →
                </span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}
