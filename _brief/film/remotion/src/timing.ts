import { Easing } from "remotion";

export const FPS = 25;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION = 53.0;

/** Composition seconds to the nearest frame (25 fps: cuts land within 20 ms of the brief). */
export const f = (seconds: number) => Math.round(seconds * FPS);

/** The brand easing, cubic-bezier(0.2, 0.8, 0.2, 1). */
export const easeBrand = Easing.bezier(0.2, 0.8, 0.2, 1);

/** 0 to 1 between two composition times, clamped, optionally eased. */
export const progress = (time: number, start: number, end: number, ease: (t: number) => number = (t) => t) =>
  ease(Math.min(1, Math.max(0, (time - start) / (end - start))));
