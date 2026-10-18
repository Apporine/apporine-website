"use client";

import { useEffect, useRef, useState } from "react";
import { AccentText } from "@/components/accent-text";
import { ButtonLink } from "@/components/button-link";
import type { NavFeature } from "@/lib/navigation";

type FeatureCardProps = {
  feature: NavFeature;
  /** Its panel is open. */
  active: boolean;
  reducedMotion: boolean;
  onNavigate: () => void;
};

const OVERLAY =
  "linear-gradient(0deg, rgba(18,4,26,0.95) 0%, rgba(18,4,26,0.7) 50%, rgba(18,4,26,0.15) 85%)";

/**
 * Panel feature card with its silent looping film (05-navigation-spec.md
 * section 5). Nothing is fetched until the panel first opens; the film plays
 * only while it is open. Reduced motion shows the poster instead.
 */
export function FeatureCard({ feature, active, reducedMotion, onNavigate }: FeatureCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Sticky once the panel has opened (state adjusted during render).
  const [requested, setRequested] = useState(false);
  if (active && !requested) setRequested(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active && !reducedMotion) {
      video.muted = true;
      // Autoplay can be refused (e.g. power saving); the poster stays visible.
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [active, requested, reducedMotion]);

  const base = `/videos/${feature.film}`;
  const poster = `${base}-poster.webp`;

  return (
    <div className="relative isolate flex min-h-[360px] flex-col justify-end overflow-hidden rounded-[20px] bg-plum-900 p-[22px]">
      {requested && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          tabIndex={-1}
          aria-hidden="true"
          className="absolute inset-0 -z-20 size-full object-cover"
        >
          {/* Reduced motion: no sources, so only the poster shows. */}
          {!reducedMotion && <source src={`${base}.webm`} type="video/webm" />}
          {!reducedMotion && <source src={`${base}.mp4`} type="video/mp4" />}
        </video>
      )}
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ backgroundImage: OVERLAY }} />

      <p className="mb-3 font-mono text-[11px] leading-[1.3] font-medium tracking-[0.16em] text-plum-200 uppercase">
        {feature.eyebrow}
      </p>
      <p className="mb-3 font-display text-[30px] leading-[0.95] font-extrabold text-plum-50 uppercase [font-variation-settings:'wdth'_75,'opsz'_96]">
        <AccentText segments={feature.title} />
      </p>
      <p className="mb-5 font-sans text-sm leading-[1.5] text-plum-100">{feature.line}</p>
      <div>
        <ButtonLink href={feature.button.href} variant="primary" size="card" onClick={onNavigate}>
          {feature.button.label}
        </ButtonLink>
      </div>
    </div>
  );
}
