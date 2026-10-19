"use client";

import { useEffect, useState } from "react";
import type { TextSegment } from "@/lib/text";

export type Word = { text: string; accent: boolean };

/** Splits text segments into words, keeping each word's accent flag. */
export function toWords(segments: TextSegment[]): Word[] {
  return segments.flatMap((segment) =>
    segment.text
      .split(" ")
      .filter(Boolean)
      .map((text) => ({ text, accent: Boolean(segment.accent) })),
  );
}

/**
 * Line index of each `[data-word]` inside the element, worked out from the
 * rendered layout, so line reveals follow the responsive wrapping. Nothing is
 * measured until `enabled` (measuring forces a layout of the headline).
 */
export function useWordLines(ref: React.RefObject<HTMLElement | null>, enabled: boolean): number[] {
  const [lines, setLines] = useState<number[]>([]);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    const measure = () => {
      const tops = Array.from(element.querySelectorAll<HTMLElement>("[data-word]"), (word) => word.offsetTop);
      const uniqueTops = [...new Set(tops)].sort((a, b) => a - b);
      const next = tops.map((top) => uniqueTops.indexOf(top));
      setLines((previous) => (previous.join() === next.join() ? previous : next));
    };

    // Fires once on observe, then whenever the headline reflows.
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    document.fonts.ready.then(measure).catch(() => {});
    return () => observer.disconnect();
  }, [ref, enabled]);

  return lines;
}
