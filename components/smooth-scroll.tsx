"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { usePointerMotion } from "@/components/section/motion";
import { anchorOffset, getLenis, registerLenis } from "@/lib/smooth-scroll";

/** Anchor scrolls take 1.1 seconds, with Lenis's default easing. */
const ANCHOR_DURATION_S = 1.1;
/** Sections render as they come near (content-visibility), moving the target: settle with short corrections. */
const SETTLE_DURATION_S = 0.35;
const SETTLE_PASSES = 3;

/** Lenis lands element targets clear of html scroll-padding-top: the navigation height plus 24px. */
function scrollToAnchor(lenis: Lenis, target: HTMLElement, duration = ANCHOR_DURATION_S, passes = SETTLE_PASSES) {
  lenis.scrollTo(target, {
    duration,
    onComplete: () => {
      const missed = Math.abs(target.getBoundingClientRect().top - anchorOffset()) > 1;
      if (missed && passes > 0) scrollToAnchor(lenis, target, SETTLE_DURATION_S, passes - 1);
    },
  });
}

/** The element a same page anchor link points to, or null for any other link. */
function samePageTarget(link: HTMLAnchorElement): HTMLElement | null {
  const url = new URL(link.href, location.href);
  if (!url.hash || url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) {
    return null;
  }
  return document.getElementById(decodeURIComponent(url.hash.slice(1)));
}

/**
 * Smooth wheel scrolling with Lenis, mounted once in the root layout. Only
 * for fine pointers without reduced motion; touch keeps native scrolling.
 * Lenis drives the window's own scroll position, so scroll events, sticky
 * sections, Motion's useScroll and IntersectionObserver work unchanged.
 */
export function SmoothScroll() {
  const enabled = usePointerMotion();
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const historyNavigation = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      syncTouch: false,
      autoRaf: true,
      // A click on a link ends any glide still running from the wheel.
      stopInertiaOnNavigate: true,
    });
    registerLenis(lenis);

    // Same page anchors glide to their target, clear of the navigation.
    // Capture phase: runs before next/link, which then leaves the click alone.
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank") return;
      const target = samePageTarget(link);
      if (!target) return;
      event.preventDefault();
      history.pushState(history.state, "", link.href);
      scrollToAnchor(lenis, target);
    }

    // Lenis skips the scroll event that follows its own last frame; a native
    // scroll in that same frame (focus, the browser) would be lost, and the
    // next wheel would jump back. Idle and out of step: adopt the real position.
    function onScroll() {
      if (!lenis.isScrolling && Math.abs(lenis.actualScroll - lenis.targetScroll) > 1) {
        lenis.scrollTo(lenis.actualScroll, { immediate: true, force: true });
      }
    }

    window.addEventListener("click", onClick, true);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("scroll", onScroll);
      registerLenis(null);
      lenis.destroy();
    };
  }, [enabled]);

  // Back and forward restore their own scroll position.
  useEffect(() => {
    const onPopState = () => {
      historyNavigation.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // A new page starts at the top at once, never gliding from the last position.
  // With a hash, next/link has already scrolled to the target (scroll-padding-top).
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (historyNavigation.current) {
      historyNavigation.current = false;
      return;
    }
    if (!location.hash) getLenis()?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
