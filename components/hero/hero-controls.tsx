"use client";

import { SLIDE_DURATION_MS } from "./hero-motion";

type HeroControlsProps = {
  total: number;
  active: number;
  /** Changes on every slide change so the active bar restarts its fill. */
  progressKey: number;
  playing: boolean;
  /** Playing and the tab is visible. */
  running: boolean;
  reducedMotion: boolean;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  /** The active bar finished filling: time to advance. */
  onProgressEnd: () => void;
};

const iconButton =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-plum-600 text-plum-50 transition-colors duration-(--dur-micro) ease-brand hover:border-plum-300 active:scale-[0.98] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-citrine";

const twoDigits = (value: number) => String(value).padStart(2, "0");

function Icon({ path }: { path: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      focusable="false"
      className="rtl:-scale-x-100"
    >
      <path d={path} />
    </svg>
  );
}

const icons = {
  pause: "M5.5 3.5v9M10.5 3.5v9",
  play: "M5 3.2v9.6l7.5-4.8z",
  previous: "M13 8H3M7 4 3 8l4 4",
  next: "M3 8h10M9 4l4 4-4 4",
};

/** Slide counter, progress bars and Pause, Previous, Next (spec section 7). */
export function HeroControls({
  total,
  active,
  progressKey,
  playing,
  running,
  reducedMotion,
  onSelect,
  onPrevious,
  onNext,
  onTogglePlay,
  onProgressEnd,
}: HeroControlsProps) {
  // With reduced motion and no autoplay the active bar is shown full, static.
  const staticActiveBar = reducedMotion && !playing;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 md:bottom-10">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-5 md:px-8 lg:px-16">
        <div className="pointer-events-auto flex min-w-0 flex-1 items-center gap-4">
          <p className="shrink-0 font-mono text-xs font-medium text-plum-300">
            {twoDigits(active + 1)} / {twoDigits(total)}
          </p>
          <div className="flex min-w-0 flex-1 gap-2 md:flex-none">
            {Array.from({ length: total }, (_, index) => {
              const isActive = index === active;
              return (
                <button
                  key={index}
                  type="button"
                  aria-label={`Show slide ${index + 1} of ${total}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => onSelect(index)}
                  // 24px tall hit area around the 2px bar (WCAG 2.2 target size).
                  className="group relative h-6 max-w-12 min-w-6 flex-1 rounded-sm focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-citrine md:w-12 md:flex-none"
                >
                  <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden bg-plum-50/20 transition-colors group-hover:bg-plum-50/40">
                    {index < active && <span className="absolute inset-0 bg-citrine" />}
                    {isActive && (
                      <span
                        key={progressKey}
                        className="absolute inset-0 origin-left bg-citrine rtl:origin-right"
                        style={
                          staticActiveBar
                            ? undefined
                            : {
                                animation: `hero-progress ${SLIDE_DURATION_MS}ms linear forwards`,
                                animationPlayState: running ? "running" : "paused",
                              }
                        }
                        onAnimationEnd={onProgressEnd}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pointer-events-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            onClick={onTogglePlay}
            className={iconButton}
          >
            <Icon path={playing ? icons.pause : icons.play} />
          </button>
          <button type="button" aria-label="Previous slide" onClick={onPrevious} className={iconButton}>
            <Icon path={icons.previous} />
          </button>
          <button type="button" aria-label="Next slide" onClick={onNext} className={iconButton}>
            <Icon path={icons.next} />
          </button>
        </div>
      </div>
    </div>
  );
}
