"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CROSSFADE_MS } from "./hero-motion";
import type { SlideMedia, SlideScrim } from "./slides";

type HeroMediaProps = {
  media: SlideMedia;
  scrim: SlideScrim;
  isActive: boolean;
  /** Active or next slide: allowed to request video. */
  isLoadTarget: boolean;
  /** Slideshow running (not paused, tab visible). */
  playing: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
  /** First slide: its poster is the LCP image. */
  priority: boolean;
};

// Mobile fades: top for the navigation, bottom for the text block.
const MOBILE_TOP_FADE = "linear-gradient(180deg, rgba(18,4,26,0.6) 0%, rgba(18,4,26,0) 20%)";
const MOBILE_BOTTOM_FADE =
  "linear-gradient(0deg, rgba(18,4,26,0.92) 0%, rgba(18,4,26,0.55) 50%, rgba(18,4,26,0) 80%)";

/** Under 768px: top fade, bottom fade, then the even overlay underneath. */
function mobileScrim(overlay: string): string {
  return `${MOBILE_TOP_FADE}, ${MOBILE_BOTTOM_FADE}, linear-gradient(${overlay}, ${overlay})`;
}

const noopSubscribe = () => () => {};

/** False during server render and hydration, true afterwards. */
function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/**
 * Background layer for one slide: plum gradient fallback, art directed
 * poster, muted video and the readability scrim (spec section 3).
 */
export function HeroMedia({
  media,
  scrim,
  isActive,
  isLoadTarget,
  playing,
  isMobile,
  reducedMotion,
  priority,
}: HeroMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hydrated = useHydrated();

  // Video is requested the first time this slide is active or next, then kept
  // so the outgoing slide does not drop back to its poster mid cross fade.
  // Reduced motion never loads video. (State adjusted during render, the
  // React pattern for deriving sticky state from props.)
  const [videoRequested, setVideoRequested] = useState(false);
  if (isLoadTarget && !reducedMotion && !videoRequested) {
    setVideoRequested(true);
  }

  const rendition = isMobile ? media.mobile : media.desktop;
  const hasVideo = Boolean(rendition.webm || rendition.mp4);
  const sources: { src: string; type: string }[] = [];
  // Wait for hydration: only then is isMobile known, so phones never request
  // the desktop files (and vice versa).
  if (hydrated && videoRequested && !reducedMotion) {
    // WebM first, then MP4 (spec section 3).
    if (rendition.webm) sources.push({ src: rendition.webm, type: "video/webm" });
    if (rendition.mp4) sources.push({ src: rendition.mp4, type: "video/mp4" });
  }
  const sourceKey = sources.map((source) => source.src).join("|");

  // Sources changed (first request or viewport class switch): reload.
  useEffect(() => {
    if (sourceKey) videoRef.current?.load();
  }, [sourceKey]);

  // Start from 0 on activation; reset once the outgoing cross fade is over.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.currentTime = 0;
      return;
    }
    const timer = window.setTimeout(() => {
      video.currentTime = 0;
    }, CROSSFADE_MS);
    return () => window.clearTimeout(timer);
  }, [isActive]);

  // Play only the active slide while the slideshow runs; pause everything else.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !sourceKey) return;
    if (isActive && playing) {
      video.muted = true;
      // Autoplay can be refused (e.g. power saving); the poster stays visible.
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive, playing, sourceKey]);

  const desktopPoster = media.desktop.poster ?? media.mobile.poster;
  const mobilePoster = media.mobile.poster;

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* Fallback until a poster or video exists (slide 3 for now). */}
      <div className="absolute inset-0 bg-linear-to-br from-plum-950 to-plum-800" />

      {desktopPoster && (
        <picture>
          {mobilePoster && mobilePoster !== desktopPoster && (
            <source media="(max-width: 767px)" srcSet={mobilePoster} type="image/webp" />
          )}
          <img
            src={desktopPoster}
            alt=""
            fetchPriority={priority ? "high" : "auto"}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="absolute inset-0 size-full object-cover object-center md:object-right"
          />
        </picture>
      )}

      {hasVideo && (
        <video
          ref={videoRef}
          muted
          playsInline
          preload="metadata"
          // Set after hydration so phones do not fetch the desktop poster.
          poster={hydrated ? (rendition.poster ?? undefined) : undefined}
          tabIndex={-1}
          className="absolute inset-0 size-full object-cover object-center md:object-right"
        >
          {sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
      )}

      {/* Readability scrim, per slide (spec section 3). */}
      <div
        className="absolute inset-0 bg-(image:--scrim-mobile) md:bg-(image:--scrim-desktop) md:rtl:-scale-x-100"
        style={
          {
            "--scrim-mobile": mobileScrim(scrim.mobileOverlay),
            "--scrim-desktop": scrim.desktop,
          } as React.CSSProperties
        }
      />
    </div>
  );
}
