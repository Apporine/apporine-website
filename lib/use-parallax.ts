"use client";

import { useEffect, useRef } from "react";
import { usePointerMotion } from "@/components/section/motion";

/*
 * Media parallax: hero films, Living Mosaic media and story banners move at
 * 0.92 of the scroll speed. One shared loop for every layer, transform only.
 * Each layer is its frame's full size, extended above and below by the
 * furthest it can drift, so no edge ever shows.
 */

/** Media lags the scroll by 8% (0.92 of the scroll speed). */
const LAG = 0.08;

const layers = new Map<HTMLElement, { extent: number }>();
let frame = 0;

function update() {
  frame = 0;
  const viewport = window.innerHeight;
  // Read every frame box first, then write: one layout read per frame.
  const boxes = [...layers.keys()].map((layer) => [layer, layer.parentElement?.getBoundingClientRect()] as const);
  for (const [layer, box] of boxes) {
    const entry = layers.get(layer);
    if (!box || !entry) continue;
    // Still when the frame is centred in the viewport, as the hero is at load.
    const offset = -(box.top + box.height / 2 - viewport / 2) * LAG;
    // The furthest it drifts while the frame is on screen; set only when it changes.
    const extent = Math.ceil(((viewport + box.height) / 2) * LAG);
    if (extent !== entry.extent) {
      entry.extent = extent;
      layer.style.inset = `${-extent}px 0`;
    }
    layer.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
  }
}

function schedule() {
  frame ||= requestAnimationFrame(update);
}

function add(layer: HTMLElement) {
  if (layers.size === 0) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
  }
  layers.set(layer, { extent: -1 });
  schedule();
}

function remove(layer: HTMLElement) {
  layers.delete(layer);
  layer.style.inset = "";
  layer.style.transform = "";
  if (layers.size === 0) {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
  }
}

/** Ref for a media layer that drifts with the parallax. Off for touch and reduced motion. */
export function useParallax<T extends HTMLElement>(): React.RefObject<T | null> {
  const ref = useRef<T>(null);
  const enabled = usePointerMotion();

  useEffect(() => {
    const layer = ref.current;
    if (!enabled || !layer) return;
    add(layer);
    return () => remove(layer);
  }, [enabled]);

  return ref;
}
