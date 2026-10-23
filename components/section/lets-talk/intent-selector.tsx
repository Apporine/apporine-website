"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/components/section/motion";
import type { IntentOption } from "@/lib/lets-talk";

/** The highlight presses in for 160ms; the arrow has left by then. */
const PRESS_MS = 260;

/** The active option's arrow: 16px wide after a 10px gap. */
const ARROW_ROOM = 26;

/** Room the option's arrow takes right now (it may be mid slide). */
function arrowRoom(option: HTMLElement): number {
  const arrow = option.lastElementChild as HTMLElement;
  return arrow.getBoundingClientRect().width + parseFloat(getComputedStyle(arrow).marginInlineStart);
}

const highlightTransition =
  "data-ready:[transition:left_450ms_var(--ease-brand),top_450ms_var(--ease-brand),width_450ms_var(--ease-brand),height_450ms_var(--ease-brand),scale_160ms_var(--ease-brand),background-color_160ms_var(--ease-brand)]";

type IntentSelectorProps = {
  options: IntentOption[];
  label: string;
};

/**
 * One slim glass bar of links. A citrine highlight glides behind the active
 * option (hover or keyboard focus moves it; it stays when the pointer
 * leaves). Choosing an option presses the highlight in, shoots the arrow
 * forward, then follows the link. Under 640px the bar stacks vertically.
 */
export function IntentSelector({ options, label }: IntentSelectorProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const optionRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [pressed, setPressed] = useState(false);
  const reducedMotion = useReducedMotion();

  /*
   * Places the highlight over the active option, straight on the DOM. In a
   * row the arrows are still sliding when this runs, so the option widths are
   * taken without them and the active one gets the arrow's room: the
   * highlight heads for where the option will be, not where it is now.
   */
  const place = useCallback(() => {
    const items = optionRefs.current.filter((item) => item !== null);
    const option = items[active];
    const highlight = highlightRef.current;
    if (!option || !highlight) return;
    const stacked = items.length > 1 && items[1].offsetTop !== items[0].offsetTop;
    let left = option.offsetLeft;
    let width = option.getBoundingClientRect().width;
    if (!stacked) {
      const widths = items.map((item) => item.getBoundingClientRect().width - arrowRoom(item));
      left = items[0].offsetLeft + widths.slice(0, active).reduce((sum, value) => sum + value, 0);
      width = widths[active] + ARROW_ROOM;
    }
    Object.assign(highlight.style, {
      left: `${left}px`,
      top: `${option.offsetTop}px`,
      width: `${width}px`,
      height: `${option.offsetHeight}px`,
    });
  }, [active]);

  useLayoutEffect(place, [place]);

  useEffect(() => {
    const bar = barRef.current;
    const highlight = highlightRef.current;
    if (!bar || !highlight) return;
    // Glide only after the first placement, so the page never shows it sliding in.
    const frame = requestAnimationFrame(() => (highlight.dataset.ready = ""));
    const observer = new ResizeObserver(place);
    observer.observe(bar);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [place]);

  useEffect(() => {
    if (!pressed) return;
    const timer = window.setTimeout(() => setPressed(false), PRESS_MS * 2);
    return () => window.clearTimeout(timer);
  }, [pressed]);

  function choose(event: React.MouseEvent<HTMLAnchorElement>, index: number) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    setActive(index);
    if (reducedMotion) return;
    event.preventDefault();
    setPressed(true);
    const { href } = options[index];
    window.setTimeout(() => window.location.assign(href), PRESS_MS);
  }

  return (
    <div
      ref={barRef}
      role="group"
      aria-label={label}
      className="relative isolate inline-grid grid-flow-col auto-cols-auto rounded-full border border-[rgba(201,179,222,0.3)] bg-[rgba(18,4,26,0.6)] p-1.5 backdrop-blur-[12px] max-sm:w-full max-sm:grid-flow-row max-sm:rounded-[26px]"
    >
      <span
        ref={highlightRef}
        aria-hidden="true"
        data-pressed={pressed || undefined}
        className={`pointer-events-none absolute -z-10 rounded-full bg-citrine opacity-0 shadow-[0_10px_28px_-10px_rgba(245,230,99,0.85)] data-pressed:scale-[0.96] data-pressed:bg-[#E3CF3E] data-ready:opacity-100 ${highlightTransition}`}
      />
      {options.map((option, index) => (
        <a
          key={option.href}
          ref={(element) => {
            optionRefs.current[index] = element;
          }}
          href={option.href}
          data-active={index === active || undefined}
          data-pressed={(pressed && index === active) || undefined}
          onPointerEnter={() => setActive(index)}
          onFocus={() => setActive(index)}
          onClick={(event) => choose(event, index)}
          className="group flex items-center justify-center rounded-full px-[22px] py-[14px] font-sans text-[15.5px] leading-[1.3] font-[650] whitespace-nowrap text-plum-50 transition-colors duration-350 ease-brand focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[rgba(165,59,239,0.8)] data-active:text-plum-800 max-sm:justify-between"
        >
          {option.label}
          <span
            aria-hidden="true"
            className="inline-block w-0 overflow-hidden opacity-0 transition-[width,margin,opacity,translate] duration-350 ease-brand group-hover:translate-x-[3px] group-data-active:ms-2.5 group-data-active:w-4 group-data-active:opacity-100 group-data-pressed:translate-x-3 group-data-pressed:opacity-0 group-data-pressed:duration-200"
          >
            →
          </span>
        </a>
      ))}
    </div>
  );
}
