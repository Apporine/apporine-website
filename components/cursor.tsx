"use client";

import { useEffect, useRef } from "react";
import { usePointerMotion } from "@/components/section/motion";

/*
 * The minimal cursor: one small square that eases after the pointer. Surfaces
 * set its colour (data-surface="dark" | "light") and elements its state
 * (data-cursor). Sizes, shapes and fades are CSS ("Minimal cursor" in
 * app/globals.css); this loop only moves it.
 */

type CursorState = "default" | "link" | "button" | "card" | "text";

/** Interpolation per frame: light by default, softer while it trails as a circle over a card. */
const EASE = 0.32;
const CARD_EASE = 0.16;

const TEXT_FIELDS = "input, textarea, select, [contenteditable='true'], [data-cursor='text']";
const INTERACTIVE = "a[href], button, [role='button'], summary, label[for]";

type Hit = { state: CursorState; surface: string };

function within(element: Element, x: number, y: number): boolean {
  const box = element.getBoundingClientRect();
  return x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;
}

/** What sits under the pointer: the cursor state and the surface it is on. */
function hitTest(x: number, y: number): Hit {
  const hit = document.elementFromPoint(x, y);
  const surface = hit?.closest<HTMLElement>("[data-surface]")?.dataset.surface ?? "dark";
  if (!hit) return { state: "default", surface };
  if (hit.closest(TEXT_FIELDS)) return { state: "text", surface };

  let interactive = false;
  for (let node: HTMLElement | null = hit as HTMLElement; node; node = node.parentElement) {
    const marked = node.dataset.cursor as CursorState | undefined;
    // A stretched link's hit area lies outside its own box: the card decides.
    if (marked === "button" && !within(node, x, y)) continue;
    // Links inside a whole clickable card belong to the card.
    if (marked && (!interactive || marked === "card")) return { state: marked, surface };
    if (node.matches(INTERACTIVE)) interactive = true;
  }
  // Unmarked links and buttons read as links.
  return { state: interactive ? "link" : "default", surface };
}

/** The minimal cursor, mounted once in the root layout. Fine pointers without reduced motion only. */
export function Cursor() {
  const enabled = usePointerMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = ref.current;
    if (!enabled || !cursor) return;
    document.documentElement.classList.add("has-custom-cursor");

    const pointer = { x: 0, y: 0 };
    const at = { x: 0, y: 0 };
    let seen = false;
    let dirty = false;
    let state: CursorState = "default";
    let frame = 0;

    function tick() {
      frame = requestAnimationFrame(tick);
      if (!seen) return;
      if (dirty) {
        dirty = false;
        const hit = hitTest(pointer.x, pointer.y);
        cursor!.dataset.surface = hit.surface;
        if (hit.state !== state) cursor!.dataset.state = state = hit.state;
      }
      const ease = state === "card" ? CARD_EASE : EASE;
      at.x += (pointer.x - at.x) * ease;
      at.y += (pointer.y - at.y) * ease;
      cursor!.style.transform = `translate3d(${at.x.toFixed(2)}px, ${at.y.toFixed(2)}px, 0)`;
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!seen) {
        seen = true;
        at.x = pointer.x;
        at.y = pointer.y;
      }
      delete cursor!.dataset.away;
      dirty = true;
    }
    // Content moves under a still pointer when the page scrolls or a panel opens.
    const recheck = () => {
      dirty = true;
    };
    const onLeave = () => {
      cursor!.dataset.away = "";
    };
    const interval = window.setInterval(recheck, 250);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", recheck, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(interval);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", recheck);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;
  return <div ref={ref} aria-hidden="true" data-state="default" data-surface="dark" data-away="" className="site-cursor" />;
}
