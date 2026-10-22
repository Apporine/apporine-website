"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { focusRing } from "@/components/section/tone";
import { TranscriptDialog } from "./transcript-dialog";

const FILM = "/videos/film/apporine-film-web";
export const FILM_POSTER = "/videos/film/apporine-film-poster.webp";

/** Plays from 40% of the frame in view, pauses under 20% (muted autoplay). */
const PLAY_RATIO = 0.4;
const PAUSE_RATIO = 0.2;

/** Glass: Ink at 55%, 10px blur, a 1px white border. */
const glass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-[rgba(11,10,13,0.55)] text-white backdrop-blur-[10px]";
/** Glass controls are 40px tall, with a Citrine edge on hover. */
const glassPill = `h-10 ${glass} transition-colors duration-200 ease-brand hover:border-[rgba(245,230,99,0.6)] hover:bg-[rgba(11,10,13,0.75)] ${focusRing}`;

/*
 * Overlays sit at the frame's top left and are moved into place with translate
 * (container query units of the frame): as the frame grows, they move without
 * a layout shift.
 */
const centred = "absolute top-0 left-0 [translate:calc(50cqw-50%)_calc(50cqh-50%)]";
const bottomRight =
  "absolute top-0 left-0 [translate:calc(100cqw-100%-16px)_calc(100cqh-100%-20px)] md:[translate:calc(100cqw-100%-24px)_calc(100cqh-100%-28px)]";

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7.5h3l4-3.5v12l-4-3.5H3z" fill="currentColor" stroke="none" />
      {muted ? <path d="M13.5 7.5l5 5m0-5l-5 5" /> : <path d="M13.5 6.5a5 5 0 0 1 0 7M16 4.5a8 8 0 0 1 0 11" />}
    </svg>
  );
}

function PlayIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={className} fill="currentColor">
      <path d="M6 3.8v12.4a.6.6 0 0 0 .9.5l9.8-6.2a.6.6 0 0 0 0-1L6.9 3.3a.6.6 0 0 0-.9.5z" />
    </svg>
  );
}

function PauseIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={className} fill="currentColor">
      <rect x="4.5" y="3.5" width="3.8" height="13" rx="1" />
      <rect x="11.7" y="3.5" width="3.8" height="13" rx="1" />
    </svg>
  );
}

type FilmPlayerProps = {
  /** Reduced motion or Save-Data: no autoplay; the poster waits for a click on the play button. */
  autoplay: boolean;
};

/**
 * The Apporine film inside the expanding frame: muted looping autoplay while in
 * view, then "Sound on" restarts it from the beginning with voice and music.
 */
export function FilmPlayer({ autoplay }: FilmPlayerProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  // Sources load once the film is within one viewport of being visible.
  const near = useInView(frameRef, { margin: "100% 0px 100% 0px", once: true });

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  /** The first "Sound on" restarts the film; after that the button toggles in place. */
  const [soundStarted, setSoundStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  /** Without autoplay, nothing plays and the controls stay hidden until the play button. */
  const [startedByVisitor, setStarted] = useState(false);
  const started = autoplay || startedByVisitor;
  const userPaused = useRef(false);
  /** The centred play or pause icon shown for 600ms after each toggle (a new key restarts it). */
  const [flash, setFlash] = useState<{ icon: "play" | "pause"; key: number } | null>(null);

  useEffect(() => {
    if (near) videoRef.current?.load();
  }, [near]);

  /** Back to the silent loop: muted, looping, no replay pill. */
  function toMutedLoop(video: HTMLVideoElement) {
    video.muted = true;
    video.loop = true;
    setMuted(true);
    setEnded(false);
  }

  // Autoplay by visibility. Leaving the view also ends listening with sound.
  useEffect(() => {
    const frame = frameRef.current;
    const video = videoRef.current;
    if (!frame || !video || !near) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < PAUSE_RATIO) {
          video.pause();
          userPaused.current = false;
          if (video.ended) video.currentTime = 0;
          if (!video.muted || video.ended) toMutedLoop(video);
        } else if (entry.intersectionRatio >= PLAY_RATIO && autoplay && !userPaused.current && video.paused && !video.ended) {
          video.play().catch(() => {});
        }
      },
      { threshold: [0, PAUSE_RATIO, PLAY_RATIO, 1] },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [near, autoplay]);

  // The 3px progress bar, drawn every frame while the film plays.
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const draw = () => {
      const video = videoRef.current;
      if (video && progressRef.current && video.duration) {
        progressRef.current.style.transform = `scaleX(${video.currentTime / video.duration})`;
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  function playFromStart(withSound: boolean) {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.muted = !withSound;
    video.loop = !withSound;
    setMuted(!withSound);
    setEnded(false);
    userPaused.current = false;
    video.play().catch(() => {});
  }

  function onSound() {
    const video = videoRef.current;
    if (!video) return;
    if (!soundStarted) {
      setSoundStarted(true);
      playFromStart(true);
    } else if (video.muted) {
      video.muted = false;
      video.loop = false;
      setMuted(false);
    } else {
      toMutedLoop(video);
      if (video.paused && !userPaused.current) video.play().catch(() => {});
    }
  }

  function pause() {
    userPaused.current = true;
    videoRef.current?.pause();
  }

  function onPlayPause() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      if (ended) setEnded(false);
      video.play().catch(() => {});
    } else {
      pause();
    }
  }

  /** A click or Space and Enter on the frame: play or pause, with the centred icon as feedback. */
  function onFrame() {
    const video = videoRef.current;
    if (!video) return;
    setFlash({ icon: video.paused ? "play" : "pause", key: (flash?.key ?? 0) + 1 });
    if (!started) onStart();
    else onPlayPause();
  }

  function onStart() {
    setStarted(true);
    playFromStart(false);
  }

  return (
    <div ref={frameRef} className="absolute inset-0 [container-type:size]">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        poster={FILM_POSTER}
        aria-label="The Apporine film"
        className="absolute inset-0 size-full object-cover"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setEnded(true);
        }}
      >
        {near && (
          <>
            <source src={`${FILM}.webm`} type="video/webm" />
            <source src={`${FILM}.mp4`} type="video/mp4" />
          </>
        )}
      </video>

      {/* The whole frame plays and pauses; the controls sit above it. */}
      <button
        type="button"
        aria-label="Apporine film, press space to play or pause"
        onClick={onFrame}
        className="absolute inset-0 size-full focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-citrine"
      />

      {/* Without autoplay, a play icon on the poster until the first play. */}
      {!started && !flash && (
        <div aria-hidden="true" className={`${centred} pointer-events-none size-[72px] ${glass}`}>
          <PlayIcon className="ms-1 size-6" />
        </div>
      )}

      {flash && (
        <div
          key={flash.key}
          aria-hidden="true"
          onAnimationEnd={() => setFlash(null)}
          className={`${centred} pointer-events-none size-[72px] animate-[film-flash_600ms_linear_both] ${glass}`}
        >
          {flash.icon === "play" ? <PlayIcon className="ms-1 size-6" /> : <PauseIcon className="size-6" />}
        </div>
      )}

      {ended && (
        <button
          type="button"
          data-cursor="button"
          onClick={() => playFromStart(true)}
          className={`${centred} px-5 font-sans text-[15px] font-medium ${glassPill}`}
        >
          <PlayIcon />
          Replay with sound
        </button>
      )}

      {started && (
        <div className={`${bottomRight} flex gap-2`}>
          <TranscriptDialog onOpen={pause} className={`px-4 font-sans text-sm font-medium ${glassPill}`} />
          <button
            type="button"
            data-cursor="button"
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
            onClick={onSound}
            className={`px-4 font-sans text-sm font-medium ${glassPill}`}
          >
            <SpeakerIcon muted={muted} />
            <span aria-hidden="true">{muted ? "Sound on" : "Sound off"}</span>
          </button>
          <button
            type="button"
            data-cursor="button"
            aria-label={playing ? "Pause film" : "Play film"}
            onClick={onPlayPause}
            className={`w-10 ${glassPill}`}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>
      )}

      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-0 h-[3px] w-full [translate:0_calc(100cqh-3px)]">
        <div ref={progressRef} className="h-full origin-left scale-x-0 bg-citrine rtl:origin-right" />
      </div>
    </div>
  );
}
