"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/components/section/motion";
import { createGuilloche, type Guilloche, type Shield } from "./guilloche";

/** Pointer follow: the light closes 10% of the gap each frame. */
const FOLLOW = 0.1;
const RESIZE_DEBOUNCE_MS = 150;

const SHIELDED_TEXT = "[data-guilloche-shield] :is(h2, p)";

/** Layout box relative to `section`, ignoring transforms (entrance reveals move text 24px). */
function shieldOf(element: HTMLElement, section: HTMLElement): Shield {
  let x = 0;
  let y = 0;
  for (let node: HTMLElement | null = element; node && node !== section; node = node.offsetParent as HTMLElement | null) {
    x += node.offsetLeft;
    y += node.offsetTop;
  }
  return { x, y, width: element.offsetWidth, height: element.offsetHeight };
}

/**
 * The Guilloché Reveal behind its parent section. The light drifts on its
 * own and follows a mouse over the section (touch: drift only), rendering
 * only while the section and the tab are visible. Reduced motion: one still
 * frame, the gold revealed behind the headline. Text in the block marked
 * with `shieldAttribute` keeps 4.5:1: the gold is held back behind it.
 */
export function GuillocheBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.parentElement;
    if (!canvas || !section) return;

    let scene: Guilloche | null = null;
    let width = 0;
    let height = 0;
    const light = { x: 0, y: 0 };
    let pointer: { x: number; y: number } | null = null;
    let placed = false;
    let inView = false;
    let frame = 0;
    const start = performance.now();

    function drawStill() {
      const headline = section!.querySelector("h2");
      const box = section!.getBoundingClientRect();
      const target = headline?.getBoundingClientRect();
      const x = target ? target.left - box.left + target.width / 2 : width / 2;
      const y = target ? target.top - box.top + target.height / 2 : height / 2;
      scene?.draw(x, y);
    }

    function tick(now: number) {
      frame = requestAnimationFrame(tick);
      if (!scene) return;
      const t = (now - start) / 1000;
      const targetX = pointer ? pointer.x : width * (0.5 + 0.38 * Math.sin(0.3 * t));
      const targetY = pointer ? pointer.y : height * (0.5 + 0.3 * Math.sin(0.23 * t));
      if (!placed) {
        light.x = targetX;
        light.y = targetY;
        placed = true;
      }
      light.x += (targetX - light.x) * FOLLOW;
      light.y += (targetY - light.y) * FOLLOW;
      scene.draw(light.x, light.y);
    }

    function updateLoop() {
      const run = !reducedMotion && inView && document.visibilityState === "visible";
      if (run && !frame) frame = requestAnimationFrame(tick);
      if (!run && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }

    function build() {
      const box = section!.getBoundingClientRect();
      if (!box.width || !box.height) return;
      width = box.width;
      height = box.height;
      const shields = [...section!.querySelectorAll<HTMLElement>(SHIELDED_TEXT)].map((element) =>
        shieldOf(element, section!),
      );
      scene = createGuilloche(canvas!, width, height, Math.min(2, window.devicePixelRatio || 1), shields);
      if (reducedMotion) drawStill();
      else if (placed) scene.draw(light.x, light.y);
    }

    let resizeTimer = 0;
    const resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, RESIZE_DEBOUNCE_MS);
    });
    const viewObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updateLoop();
    });

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      const box = section!.getBoundingClientRect();
      pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
    }
    function onPointerLeave() {
      pointer = null;
    }

    build();
    resizeObserver.observe(section);
    // Text reflows (fonts arriving) move the shields without resizing the section.
    const content = section.querySelector("[data-guilloche-shield]");
    if (content) resizeObserver.observe(content);
    viewObserver.observe(section);
    document.addEventListener("visibilitychange", updateLoop);
    if (!reducedMotion) {
      section.addEventListener("pointermove", onPointerMove, { passive: true });
      section.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      resizeObserver.disconnect();
      viewObserver.disconnect();
      document.removeEventListener("visibilitychange", updateLoop);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full" />;
}
