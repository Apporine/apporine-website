"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/*
 * Small hooks over browser state, built on useSyncExternalStore so they are
 * safe during server rendering (they return the server snapshot there) and
 * never set state inside effects.
 */

/** True when the media query matches. False on the server. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** True while the browser tab is hidden. */
export function useDocumentHidden(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      document.addEventListener("visibilitychange", onChange);
      return () => document.removeEventListener("visibilitychange", onChange);
    },
    () => document.visibilityState === "hidden",
    () => false,
  );
}

/** True once the page has scrolled further than `offset` pixels. */
export function useScrolledPast(offset: number): boolean {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener("scroll", onChange, { passive: true });
      return () => window.removeEventListener("scroll", onChange);
    },
    () => window.scrollY > offset,
    () => false,
  );
}

/**
 * True while the page is scrolled past `offset` and the last scroll went
 * down; scrolling up clears it. Ignored (false) when `enabled` is false.
 */
export function useHiddenOnScrollDown(offset: number, enabled: boolean): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let lastY = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 4) return;
      setHidden(y > offset && y > lastY);
      lastY = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset, enabled]);

  return enabled && hidden;
}

type NetworkInformation = EventTarget & { saveData?: boolean };

/** True when the visitor asks to save data (Save-Data, where supported). False on the server. */
export function useSaveData(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
      connection?.addEventListener("change", onChange);
      return () => connection?.removeEventListener("change", onChange);
    },
    () => (navigator as Navigator & { connection?: NetworkInformation }).connection?.saveData === true,
    () => false,
  );
}
