// The cut list (edit.json, also read by scripts/prepare-video.mjs): composition start and end,
// clip, and the clip's in point, all in seconds.
// - The completed bridge starts under the dissolve, so it reaches its 2.0 s in point at 38.10.
// - gapTail: the last frames of the bridge gap, dissolving (0.4 s, centred on 38.10) into the completed bridge.
// - hold: 43.90 to 45.10, the control room's last frame (a still made by prepare-video).
import edit from "./edit.json";
import segments from "./segments.json";

export type Shot = {
  clip: string;
  start: number;
  end: number;
  in: number;
};

export const SHOTS: Shot[] = edit.shots;
export const GAP_TAIL = edit.gapTail;
export const HOLD = edit.hold;

/**
 * Graded clips hold only the used part of each source (with handles), so a clip's frame 0 is
 * this many 25 fps frames into its proxy. Clips graded whole are not listed.
 */
export const segmentStart = (clip: string) => (segments as Record<string, number>)[clip] ?? 0;
