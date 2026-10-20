"use client";

import { useEffect, useRef, useState } from "react";

type CardMediaProps = {
  /** Base name in /public/videos (webm, mp4 and -poster.webp). */
  film: string;
  focalPoint: string;
  /** False on phones and for reduced motion: the still only. */
  filmEnabled: boolean;
  /** The section is near the viewport: the film may fetch its metadata. */
  near: boolean;
  /** The card is open and in view: the film plays. */
  playing: boolean;
};

/** The film fades out over 300ms before it pauses and returns to its first frame. */
const FADE_OUT_MS = 300;

/**
 * Card layers 1 and 2 (09-latest-section-spec.md, section 4): the still, and
 * above it the film at opacity 0 until it is actually playing. The poster is
 * the film's first frame and both share the slow zoom, so the fade has no
 * visual jump. Decorative.
 */
export function CardMedia({ film, focalPoint, filmEnabled, near, playing }: CardMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const base = `/videos/${film}`;
  const visible = playing && started;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.muted = true;
      // Autoplay can be refused (e.g. power saving); the still stays visible.
      video.play().catch(() => {});
      return;
    }
    const timer = setTimeout(() => {
      video.pause();
      video.currentTime = 0;
    }, FADE_OUT_MS);
    return () => clearTimeout(timer);
  }, [playing]);

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <div className="latest-still absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative poster, already web optimised */}
        <img
          src={`${base}-poster.webp`}
          alt=""
          loading="lazy"
          decoding="async"
          style={{ objectPosition: focalPoint }}
          className="absolute inset-0 size-full object-cover"
        />
        {filmEnabled && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload={near ? "metadata" : "none"}
            tabIndex={-1}
            onPlaying={() => setStarted(true)}
            onPause={() => setStarted(false)}
            style={{ objectPosition: focalPoint }}
            className={`absolute inset-0 size-full object-cover ${
              visible ? "opacity-100 duration-500" : "opacity-0 duration-300"
            } transition-opacity ease-brand`}
          >
            <source src={`${base}.webm`} type="video/webm" />
            <source src={`${base}.mp4`} type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  );
}
