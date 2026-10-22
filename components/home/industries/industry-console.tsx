"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useFinePointer, useReducedMotion } from "@/components/section/motion";
import { SegmentText } from "@/components/section/segment-text";
import { displayClass, focusRingLight, lightBodyColour } from "@/components/section/tone";
import { exploreLabel, industries, industriesSection, type Industry } from "@/lib/industries";
import { useDocumentHidden, useMediaQuery } from "@/lib/use-browser-state";
import { capabilityIcons } from "./capability-icons";
import { IndustryGlassCard } from "./industry-glass-card";

/** Auto advance runs while at least 40% of the section is in view. */
const VISIBLE_RATIO = 0.4;
const PANEL_ID = "industries-panel";
const tabId = (industry: Industry) => `industry-tab-${industry.slug}`;

const imageSizes = "(min-width: 1024px) min(34vw, 480px), (min-width: 768px) 44vw, 100vw";
const sectionLabel = "font-mono text-xs leading-[1.3] font-semibold tracking-[0.16em] text-plum-600";
/** Stacked panes share one grid cell, so the stack is as tall as the tallest industry (no layout shift). */
const stacked = "[grid-area:1/1]";
const entering = "animate-[industry-in_700ms_var(--ease-brand)_both] motion-reduce:animate-none";

/** The active industry and the one before it (it stays under the new image while that fades in). */
type View = { active: number; previous: number; cycle: number };

function IndustryContent({ industry, active }: { industry: Industry; active: boolean }) {
  return (
    <div className={`${stacked} flex flex-col gap-[22px] ${active ? entering : "invisible"}`}>
      <p className="font-mono text-[13px] leading-[1.3] font-semibold tracking-[0.18em] text-orchid-deep">
        {industry.label}
      </p>
      <h3
        className={`${displayClass} text-[clamp(28px,8vw,36px)] leading-[0.92] text-plum-800 md:text-[clamp(36px,3.6vw,56px)]`}
      >
        <SegmentText segments={industry.stakes} tone="light" />
      </h3>
      <div className="flex flex-col gap-2.5">
        <p className={sectionLabel}>{industriesSection.challengeLabel}</p>
        <p className="max-w-[38rem] font-sans text-lg leading-[1.6] font-medium text-plum-800">{industry.challenge}</p>
      </div>
      <div className="flex flex-col gap-2.5">
        <p className={sectionLabel}>{industriesSection.buildLabel}</p>
        <ul className="flex flex-col gap-2.5">
          {industry.build.map((capability, index) => {
            const Icon = capabilityIcons[index];
            return (
              <li
                key={capability.title}
                className="flex gap-4 rounded-[18px] border border-[#EDE3F5] bg-plum-50 px-[18px] py-4"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-[13px] bg-[#F1E4FB] text-orchid-deep">
                  <Icon />
                </span>
                <span className="flex flex-col gap-0.5 font-sans">
                  <span className="text-[17px] leading-[1.35] font-bold text-plum-800">{capability.title}</span>
                  <span className={`text-[15px] leading-[1.5] ${lightBodyColour}`}>{capability.description}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <Link
        href={industry.href}
        data-cursor="link"
        className={`self-start rounded-sm font-sans text-base font-bold text-plum-800 underline decoration-citrine decoration-2 underline-offset-[6px] ${focusRingLight}`}
      >
        {exploreLabel(industry)}
      </Link>
    </div>
  );
}

/**
 * The Light Console: vertical tabs (a horizontal row under 1024px), the
 * active industry's content and its image card. Auto advances every 8s while
 * in view; hovering the panel or keyboard focus inside it pauses it. The
 * progress line's animation is the timer: when it ends, the next industry shows.
 */
export function IndustryConsole() {
  const reducedMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const vertical = useMediaQuery("(min-width: 1024px)");
  const documentHidden = useDocumentHidden();
  // Touch devices and reduced motion: manual selection only.
  const autoAdvance = finePointer && !reducedMotion;

  const [view, setView] = useState<View>({ active: 0, previous: 0, cycle: 0 });
  const { active, previous, cycle } = view;
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [keyboardInside, setKeyboardInside] = useState(false);
  const running = autoAdvance && inView && !hovered && !keyboardInside && !documentHidden;

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const section = rootRef.current?.closest("section");
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.intersectionRatio >= VISIBLE_RATIO), {
      threshold: [0, 0.2, VISIBLE_RATIO, 0.6, 0.8, 1],
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // In the horizontal row, the active item scrolls into view (the page itself never scrolls).
  useEffect(() => {
    const list = listRef.current;
    const tab = tabRefs.current[active];
    if (vertical || !list || !tab) return;
    list.scrollTo({
      left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [active, vertical, reducedMotion]);

  /** A click or Enter and Space: show it now and restart the 8 second timer. */
  function select(index: number) {
    setView((current) => ({
      active: index,
      previous: current.active,
      cycle: current.cycle + 1,
    }));
  }

  function advance() {
    setView((current) => ({
      ...current,
      active: (current.active + 1) % industries.length,
      previous: current.active,
    }));
  }

  // Arrow keys, Home and End move focus between tabs; Enter and Space select (the button's click).
  function onKeyDown(event: React.KeyboardEvent) {
    const current = tabRefs.current.indexOf(document.activeElement as HTMLButtonElement);
    if (current < 0) return;
    const last = industries.length - 1;
    const targets: Record<string, number> = {
      ArrowDown: current === last ? 0 : current + 1,
      ArrowRight: current === last ? 0 : current + 1,
      ArrowUp: current === 0 ? last : current - 1,
      ArrowLeft: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    tabRefs.current[target]?.focus();
  }

  const industry = industries[active];

  return (
    <div
      ref={rootRef}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={(event) => event.target.matches(":focus-visible") && setKeyboardInside(true)}
      onBlur={(event) => !rootRef.current?.contains(event.relatedTarget) && setKeyboardInside(false)}
      className="mt-11 flex flex-col overflow-hidden rounded-[24px] border border-[#E6DCEF] bg-[#FFFFFF] shadow-[0_40px_80px_-56px_rgba(46,10,58,0.45)] md:rounded-[32px] lg:flex-row"
    >
      <div
        ref={listRef}
        role="tablist"
        aria-label="Industries"
        aria-orientation={vertical ? "vertical" : "horizontal"}
        onKeyDown={onKeyDown}
        className="relative flex snap-x snap-mandatory scroll-px-4 gap-1.5 overflow-x-auto border-b border-plum-100 bg-plum-50 px-4 py-3 [scrollbar-width:none] lg:w-[250px] lg:shrink-0 lg:snap-none lg:flex-col lg:overflow-visible lg:border-r lg:border-b-0 lg:py-6 [&::-webkit-scrollbar]:hidden"
      >
        {industries.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.slug}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={tabId(item)}
              aria-selected={selected}
              aria-controls={PANEL_ID}
              tabIndex={selected ? 0 : -1}
              data-cursor="button"
              onClick={() => select(index)}
              className={`relative flex min-h-14 shrink-0 snap-start items-center gap-3 rounded-2xl px-4 text-left font-sans text-base leading-[1.25] whitespace-nowrap text-plum-800 transition-[background-color,box-shadow] duration-(--dur-standard) ease-brand lg:py-2 lg:whitespace-normal ${focusRingLight} ${
                selected
                  ? "bg-[linear-gradient(110deg,#EFDDFC_0%,#FBEFF7_50%,#FFF4B8_100%)] font-bold shadow-[0_10px_24px_-14px_rgba(165,59,239,0.6)]"
                  : "font-medium hover:bg-[rgba(255,255,255,0.85)]"
              }`}
            >
              <span
                aria-hidden="true"
                className={`font-mono text-xs font-semibold ${selected ? "text-orchid-deep" : "text-[#7A5C96]"}`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              {/* An invisible bold copy holds the width, so selecting never moves the other items. */}
              <span className="grid">
                <span className="[grid-area:1/1]">{item.name}</span>
                <span aria-hidden="true" className="invisible font-bold [grid-area:1/1]">
                  {item.name}
                </span>
              </span>
              {selected && autoAdvance && (
                <span
                  key={cycle}
                  aria-hidden="true"
                  onAnimationEnd={advance}
                  style={{ animationPlayState: running ? "running" : "paused" }}
                  className="absolute inset-x-4 bottom-0 h-[2px] origin-left animate-[industry-progress_8s_linear_both] bg-[linear-gradient(90deg,var(--orchid),var(--citrine))] rtl:origin-right"
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        id={PANEL_ID}
        role="tabpanel"
        aria-labelledby={tabId(industry)}
        className="flex min-w-0 flex-1 flex-col md:flex-row"
      >
        <div className="grid min-w-0 flex-1 p-[clamp(24px,3.2vw,48px)]">
          {industries.map((item, index) => (
            <IndustryContent key={item.slug} industry={item} active={index === active} />
          ))}
        </div>

        <div className="p-4 max-md:pt-0 md:w-[44%] md:shrink-0 lg:w-[34%] lg:min-w-[340px]">
          <div className="relative isolate h-full min-h-[380px] overflow-hidden rounded-3xl bg-plum-950 md:min-h-[520px] lg:min-h-[600px]">
            {/* All six images stay stacked: the new one fades in over the last, so there is never a blank frame. */}
            <div className="absolute inset-0 animate-[industry-zoom_16s_ease-in-out_infinite_alternate] motion-reduce:animate-none">
              {industries.map((item, index) => (
                <Image
                  key={item.slug}
                  src={item.image.src}
                  alt={item.image.alt}
                  aria-hidden={index !== active}
                  fill
                  sizes={imageSizes}
                  className={`object-cover ${
                    index === active
                      ? "z-[2] opacity-100 transition-opacity duration-700 ease-brand motion-reduce:transition-none"
                      : index === previous
                        ? "z-[1] opacity-100 transition-none"
                        : "opacity-0 transition-none"
                  }`}
                />
              ))}
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-0 z-[3] bg-[linear-gradient(0deg,rgba(18,4,26,0.75)_0%,rgba(18,4,26,0)_58%)]"
            />
            <div className="absolute inset-x-4 bottom-4 z-[4] grid">
              {industries.map((item, index) => (
                <div key={item.slug} className={`${stacked} self-end ${index === active ? entering : "invisible"}`}>
                  <IndustryGlassCard card={item.card} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
