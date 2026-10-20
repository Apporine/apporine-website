"use client";

import { useMediaQuery } from "@/lib/use-browser-state";

/*
 * Homepage motion system (07-homepage-spec.md, "Motion system"). Durations in
 * seconds, for Motion. --ease-brand is EASE_BRAND in components/hero/hero-motion.ts.
 * The default entrance and the headline line reveal (700ms, 24px rise, lines
 * 90ms apart) are CSS transitions: .reveal and .line-reveal in app/globals.css.
 */

/** Siblings enter 80ms apart. */
export const STAGGER_MS = 80;

/** Reduced motion: every entrance becomes a 200ms fade. */
export const REDUCED_FADE_S = 0.2;

/** True when the visitor asks for reduced motion. False on the server. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Fine pointer that can hover (mouse or trackpad): enables tilt and hover only effects. */
export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}
