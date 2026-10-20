"use client";

import { useEffect, useRef } from "react";
import { usePointerMotion } from "@/components/section/motion";

/*
 * The Precision cursor: an 8px dot on the pointer and a 36px ring that eases
 * after it. Surfaces set its colour (data-surface="dark" | "light") and
 * elements its state (data-cursor). Sizes, colours and fades are CSS
 * ("Precision cursor" in app/globals.css); this loop only moves things.
 */

type CursorState = "default" | "link" | "button" | "open" | "view" | "text";

/** Ring interpolation per frame. */
const RING_EASE = 0.18;
/** Magnetic buttons: 30% of the pointer's offset from the centre, 6px at most. */
const MAGNET_PULL = 0.3;
const MAGNET_MAX_PX = 6;
const MAGNET_EASE = 0.2;
/** The ring around a button is its height plus 12px. */
const BUTTON_RING_EXTRA_PX = 12;

const TEXT_FIELDS = "input, textarea, select, [contenteditable='true'], [data-cursor='text']";
const INTERACTIVE = "a[href], button, [role='button'], summary, label[for]";
const LABELS: Partial<Record<CursorState, string>> = { open: "Open", view: "View" };

type Hit = { state: CursorState; surface: string; element: HTMLElement | null };

function within(element: Element, x: number, y: number): boolean {
  const box = element.getBoundingClientRect();
  return x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;
}

/** True for an element that holds text itself (a headline, a paragraph). */
function holdsText(element: Element): boolean {
  return [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
}

/** What sits under the pointer: the cursor state, the surface and the element it belongs to. */
function hitTest(x: number, y: number): Hit {
  const hit = document.elementFromPoint(x, y);
  const surface = hit?.closest<HTMLElement>("[data-surface]")?.dataset.surface ?? "dark";
  if (!hit) return { state: "default", surface, element: null };
  if (hit.closest(TEXT_FIELDS)) return { state: "text", surface, element: null };

  let interactive: HTMLElement | null = null;
  for (let node: HTMLElement | null = hit as HTMLElement; node; node = node.parentElement) {
    const marked = node.dataset.cursor as CursorState | undefined;
    // A stretched link's hit area lies outside its own box: the card decides.
    if (marked === "button" && !within(node, x, y)) continue;
    if (marked && (!interactive || marked === "open")) return { state: marked, surface, element: node };
    if (!interactive && node.matches(INTERACTIVE)) interactive = node;
  }
  if (interactive) return { state: "link", surface, element: interactive };

  // A film behind empty space (not behind text) shows "View".
  if (!holdsText(hit)) {
    const film = document.elementsFromPoint(x, y).find((element) => element.closest("[data-cursor='view']"));
    if (film) return { state: "view", surface, element: null };
  }
  return { state: "default", surface, element: null };
}

/** The Precision cursor, mounted once in the root layout. Fine pointers without reduced motion only. */
export function Cursor() {
  const enabled = usePointerMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const dot = dotRef.current;
    const anchor = anchorRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!enabled || !root || !dot || !anchor || !ring || !label) return;
    document.documentElement.classList.add("has-custom-cursor");

    const pointer = { x: -100, y: -100 };
    const ringAt = { x: -100, y: -100 };
    let seen = false;
    let dirty = false;
    let frame = 0;
    let state: CursorState = "default";
    // The magnetic button under the pointer, and any still springing back.
    const magnets = new Map<HTMLElement, { x: number; y: number; tx: number; ty: number }>();
    let magnet: HTMLElement | null = null;

    function setState(hit: Hit) {
      root!.dataset.surface = hit.surface;
      if (hit.state !== state) {
        state = hit.state;
        root!.dataset.state = state;
        label!.textContent = LABELS[state] ?? "";
      }
      const nextMagnet = hit.state === "button" ? hit.element : null;
      if (nextMagnet !== magnet) {
        if (magnet) magnets.get(magnet)!.tx = magnets.get(magnet)!.ty = 0;
        magnet = nextMagnet;
        if (magnet && !magnets.has(magnet)) magnets.set(magnet, { x: 0, y: 0, tx: 0, ty: 0 });
      }
      if (magnet) {
        ring!.style.setProperty("--ring-size", `${magnet.offsetHeight + BUTTON_RING_EXTRA_PX}px`);
      } else {
        ring!.style.removeProperty("--ring-size");
      }
    }

    function moveMagnets() {
      if (magnet) {
        const spring = magnets.get(magnet)!;
        const box = magnet.getBoundingClientRect();
        // The box includes the current pull; its resting centre does not.
        const dx = (pointer.x - (box.left + box.width / 2 - spring.x)) * MAGNET_PULL;
        const dy = (pointer.y - (box.top + box.height / 2 - spring.y)) * MAGNET_PULL;
        const scale = Math.min(1, MAGNET_MAX_PX / (Math.hypot(dx, dy) || 1));
        spring.tx = dx * scale;
        spring.ty = dy * scale;
      }
      for (const [element, spring] of magnets) {
        spring.x += (spring.tx - spring.x) * MAGNET_EASE;
        spring.y += (spring.ty - spring.y) * MAGNET_EASE;
        if (element !== magnet && Math.abs(spring.x) < 0.05 && Math.abs(spring.y) < 0.05) {
          element.style.translate = "";
          magnets.delete(element);
        } else {
          element.style.translate = `${spring.x.toFixed(2)}px ${spring.y.toFixed(2)}px`;
        }
      }
    }

    function tick() {
      frame = requestAnimationFrame(tick);
      if (!seen) return;
      if (dirty) {
        dirty = false;
        setState(hitTest(pointer.x, pointer.y));
      }
      ringAt.x += (pointer.x - ringAt.x) * RING_EASE;
      ringAt.y += (pointer.y - ringAt.y) * RING_EASE;
      dot!.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
      anchor!.style.transform = `translate3d(${ringAt.x.toFixed(2)}px, ${ringAt.y.toFixed(2)}px, 0)`;
      moveMagnets();
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!seen) {
        seen = true;
        ringAt.x = pointer.x;
        ringAt.y = pointer.y;
      }
      delete root!.dataset.away;
      dirty = true;
    }
    // Content moves under a still pointer when the page scrolls or a panel opens.
    const recheck = () => {
      dirty = true;
    };
    const onDown = () => {
      root!.dataset.pressed = "";
    };
    const onUp = () => {
      delete root!.dataset.pressed;
    };
    const onLeave = () => {
      root!.dataset.away = "";
    };
    const interval = window.setInterval(recheck, 250);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", recheck, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(interval);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", recheck);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      for (const element of magnets.keys()) element.style.translate = "";
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={rootRef} aria-hidden="true" data-state="default" data-surface="dark" data-away="" className="precision-cursor">
      <div ref={anchorRef} className="precision-cursor-anchor">
        <div ref={ringRef} className="precision-cursor-ring">
          <span ref={labelRef} className="precision-cursor-label" />
        </div>
      </div>
      <div ref={dotRef} className="precision-cursor-dot" />
    </div>
  );
}
