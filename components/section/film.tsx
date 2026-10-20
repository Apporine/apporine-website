"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/use-browser-state";
import { useReducedMotion } from "./motion";

type FilmProps = {
  /** Base name in /public/videos (webm, mp4 and -poster.webp), e.g. "hero-03-bridge". */
  name: string;
  /** Rendition for viewports under 768px; defaults to `name`. */
  mobileName?: string;
  /** Size, position and filters of the poster and the video. */
  className?: string;
  /** CSS object-position of the poster and the video. */
  focalPoint?: string;
  /** The poster is the page's main image: load it at once, at high priority. */
  eager?: boolean;
};

/**
 * Silent looping film (07-homepage-spec.md, "Media rules"): muted, loop,
 * playsInline, poster always set. Nothing is requested until the film is
 * near the viewport, and it plays only while in view. Reduced motion shows
 * the poster only. Decorative.
 */
export function Film({ name, mobileName = name, className = "", focalPoint, eager = false }: FilmProps) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { margin: "50% 0px 50% 0px" });
  const inView = useInView(ref);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const reducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sticky once the film has come near (state adjusted during render).
  const [requested, setRequested] = useState(false);
  if (near && !reducedMotion && !requested) setRequested(true);

  const base = `/videos/${isMobile ? mobileName : name}`;
  const desktopPoster = `/videos/${name}-poster.webp`;
  const mobilePoster = `/videos/${mobileName}-poster.webp`;
  const playing = requested && inView && !reducedMotion;

  // A viewport class switch changes the sources: reload them.
  useEffect(() => {
    if (requested) videoRef.current?.load();
  }, [requested, base]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.muted = true;
      // Autoplay can be refused (e.g. power saving); the poster stays visible.
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [playing, base]);

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <picture>
        {mobilePoster !== desktopPoster && (
          <source media="(max-width: 767px)" srcSet={mobilePoster} type="image/webp" />
        )}
        <img
          src={desktopPoster}
          alt=""
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          decoding="async"
          style={{ objectPosition: focalPoint }}
          className={`absolute inset-0 size-full object-cover ${className}`}
        />
      </picture>
      {requested && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          poster={isMobile ? mobilePoster : desktopPoster}
          tabIndex={-1}
          style={{ objectPosition: focalPoint }}
          className={`absolute inset-0 size-full object-cover ${className}`}
        >
          <source src={`${base}.webm`} type="video/webm" />
          <source src={`${base}.mp4`} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
