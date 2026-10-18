"use client";

import { useRef, useState } from "react";
import { useDocumentHidden, useMediaQuery } from "@/lib/use-browser-state";
import { HeroControls } from "./hero-controls";
import { HeroSlide } from "./hero-slide";
import { plainText, type Slide } from "./slides";

const SWIPE_THRESHOLD_PX = 50;

/**
 * Full screen hero carousel (spec sections 6, 7 and 9).
 * Auto advance is driven by the active progress bar's CSS animation: it
 * pauses with the slideshow, and its end advances to the next slide.
 */
export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const total = slides.length;
  const [active, setActive] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  // null until the user presses Pause or Play; then their choice wins.
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobile = useMediaQuery("(max-width: 767px)");
  const tabHidden = useDocumentHidden();

  // Reduced motion: no auto advance unless the user explicitly presses Play.
  const playing = !(userPaused ?? reducedMotion);
  const running = playing && !tabHidden;

  function goTo(index: number, manual: boolean) {
    const next = (index + total) % total;
    setActive(next);
    setProgressKey((key) => key + 1);
    // Only user initiated changes are announced.
    if (manual) setAnnouncement(plainText(slides[next].headline));
  }

  const showPrevious = () => goTo(active - 1, true);
  const showNext = () => goTo(active + 1, true);

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showNext();
    }
  }

  function onTouchStart(event: React.TouchEvent) {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }

  function onTouchEnd(event: React.TouchEvent) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    // Horizontal swipes only, so vertical page scrolling is unaffected.
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) showNext();
    else showPrevious();
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Apporine highlights"
      // Focusable by click (not in the tab order) so arrow keys work anywhere in the hero.
      tabIndex={-1}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      // pan-y: horizontal swipes belong to the carousel (also stops swipe back
      // navigation), vertical scrolling stays with the browser.
      className="relative isolate touch-pan-y overflow-hidden bg-plum-950 outline-none"
    >
      <div className="grid min-h-[max(100svh,640px)] md:min-h-[max(100svh,680px)] lg:min-h-[max(100svh,720px)]">
        {slides.map((slide, index) => (
          <HeroSlide
            key={slide.id}
            slide={slide}
            index={index}
            total={total}
            isActive={index === active}
            isLoadTarget={index === active || index === (active + 1) % total}
            playing={running}
            isMobile={isMobile}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>

      <HeroControls
        total={total}
        active={active}
        progressKey={progressKey}
        playing={playing}
        running={running}
        reducedMotion={reducedMotion}
        onSelect={(index) => goTo(index, true)}
        onPrevious={showPrevious}
        onNext={showNext}
        onTogglePlay={() => setUserPaused(playing)}
        onProgressEnd={() => goTo(active + 1, false)}
      />

      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </p>
    </section>
  );
}
