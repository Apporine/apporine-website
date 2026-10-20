"use client";

import type Lenis from "lenis";
import { useEffect } from "react";

/*
 * The site's Lenis instance (components/smooth-scroll.tsx), shared so other
 * components can lock scrolling or scroll to a target. Null when smooth
 * scrolling is off (touch, coarse pointers, reduced motion): the browser
 * scrolls natively and these helpers fall back to it.
 */
let lenis: Lenis | null = null;
let locks = 0;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
  if (lenis && locks > 0) lenis.stop();
}

export function getLenis(): Lenis | null {
  return lenis;
}

/**
 * Stops smooth scrolling while `locked` (an open mega panel or the mobile
 * menu), so the page does not scroll behind it; starts it again after.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    locks += 1;
    lenis?.stop();
    return () => {
      locks -= 1;
      if (locks === 0) lenis?.start();
    };
  }, [locked]);
}

/**
 * Where an anchor target lands below the top of the viewport: the navigation
 * height plus 24px. One value for native and smooth anchors: html
 * scroll-padding-top in app/globals.css.
 */
export function anchorOffset(): number {
  return parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
}
