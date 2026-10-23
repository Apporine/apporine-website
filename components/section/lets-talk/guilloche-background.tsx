"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/components/section/motion";
import { createGuilloche, FALCON_SRC, watermarks, type Guilloche, type Light } from "./guilloche";

const RESIZE_DEBOUNCE_MS = 150;

/** Ambient lights: position as fractions of the section over t seconds, radius at 1600px wide. */
const AMBIENT = [
  { x: (t: number) => 0.18 + 0.12 * Math.sin(0.21 * t), y: (t: number) => 0.32 + 0.16 * Math.sin(0.17 * t), radius: 170, strength: 0.8 },
  // Regularly passes over the large Falcon.
  { x: (t: number) => 0.8 + 0.1 * Math.sin(0.18 * t + 1), y: (t: number) => 0.6 + 0.18 * Math.sin(0.23 * t + 2), radius: 190, strength: 0.85 },
  { x: (t: number) => 0.5 + 0.32 * Math.sin(0.12 * t + 3), y: (t: number) => 0.88 + 0.07 * Math.sin(0.2 * t), radius: 150, strength: 0.6 },
];

/** Pointer light: radius at 1600px wide, follow and fade easing per frame. */
const POINTER = { radius: 220, follow: 0.12, fadeIn: 0.08, fadeOut: 0.05 };

/** Radii scale with the section: clamp(0.8, width / 1600, 1.2). */
function radiusScale(width: number): number {
  return Math.min(1.2, Math.max(0.8, width / 1600));
}

/** The lines of copy the gold holds back behind. */
const SHIELDED_TEXT = "[data-guilloche-content] :is(h2, p)";

/** Layout box of `element` relative to `section`, ignoring transforms (entrance reveals move text 24px). */
function boxOf(element: HTMLElement, section: HTMLElement): DOMRect {
  let x = 0;
  let y = 0;
  for (let node: HTMLElement | null = element; node && node !== section; node = node.offsetParent as HTMLElement | null) {
    x += node.offsetLeft;
    y += node.offsetTop;
  }
  return new DOMRect(x, y, element.offsetWidth, element.offsetHeight);
}

/**
 * The Guilloché Reveal behind its parent section, with the Falcon watermarks:
 * three ambient lights drift on their own, and a fourth follows a mouse over
 * the section, fading in and out (touch: ambient lights only). Renders only
 * while the section and the tab are visible. Reduced motion: one still
 * frame, the ambient lights at t = 0.
 */
export function GuillocheBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.parentElement;
    if (!canvas || !section) return;

    let scene: Guilloche | null = null;
    let falcon: HTMLImageElement | null = null;
    let width = 0;
    let height = 0;
    const lights: Light[] = [...AMBIENT, POINTER].map(() => ({ x: 0, y: 0, radius: 0, strength: 0 }));
    const pointerLight = lights[AMBIENT.length];
    let pointer: { x: number; y: number } | null = null;
    let inView = false;
    let frame = 0;
    const start = performance.now();

    function placeAmbient(t: number) {
      const scale = radiusScale(width);
      AMBIENT.forEach((ambient, index) => {
        const light = lights[index];
        light.x = width * ambient.x(t);
        light.y = height * ambient.y(t);
        light.radius = ambient.radius * scale;
        light.strength = ambient.strength;
      });
      pointerLight.radius = POINTER.radius * scale;
    }

    function tick(now: number) {
      frame = requestAnimationFrame(tick);
      if (!scene) return;
      placeAmbient((now - start) / 1000);
      if (pointer) {
        // Fading in from nothing: start where the pointer is.
        if (pointerLight.strength < 0.01) {
          pointerLight.x = pointer.x;
          pointerLight.y = pointer.y;
        }
        pointerLight.x += (pointer.x - pointerLight.x) * POINTER.follow;
        pointerLight.y += (pointer.y - pointerLight.y) * POINTER.follow;
        pointerLight.strength += (1 - pointerLight.strength) * POINTER.fadeIn;
      } else {
        pointerLight.strength += (0 - pointerLight.strength) * POINTER.fadeOut;
      }
      scene.draw(lights);
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
      const content = section!.querySelector<HTMLElement>("[data-guilloche-content]");
      const contentBox = content ? boxOf(content, section!) : new DOMRect(0, 0, width, height);
      scene = createGuilloche(canvas!, {
        width,
        height,
        dpr: Math.min(2, window.devicePixelRatio || 1),
        textCentre: { x: contentBox.x + contentBox.width / 2, y: contentBox.y + contentBox.height / 2 },
        shields: [...section!.querySelectorAll<HTMLElement>(SHIELDED_TEXT)].map((element) => boxOf(element, section!)),
        falcon,
        placements: watermarks(width, height, window.innerWidth),
      });
      placeAmbient(reducedMotion ? 0 : (performance.now() - start) / 1000);
      scene.draw(lights);
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

    // The base gradient (CSS) shows until the Falcon has loaded; without it, the waves alone.
    let cancelled = false;
    const image = new Image();
    image.src = FALCON_SRC;
    image
      .decode()
      .then(() => (falcon = image))
      .catch(() => (falcon = null))
      .finally(() => {
        if (!cancelled) build();
      });
    resizeObserver.observe(section);
    // Text reflows (fonts arriving) move the content centre without resizing the section.
    const content = section.querySelector("[data-guilloche-content]");
    if (content) resizeObserver.observe(content);
    viewObserver.observe(section);
    document.addEventListener("visibilitychange", updateLoop);
    if (!reducedMotion) {
      section.addEventListener("pointermove", onPointerMove, { passive: true });
      section.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      cancelled = true;
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
