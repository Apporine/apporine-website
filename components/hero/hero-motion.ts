/** Shared hero timings (seconds, for Motion), from spec section 6. */

/** --ease-brand as a Motion cubic bezier. */
export const EASE_BRAND = [0.2, 0.8, 0.2, 1] as const;

/** Text fades out over 300ms when its slide is left. */
export const EXIT_S = 0.3;

/** New text starts 200ms after the cross fade begins. */
export const TEXT_ENTER_DELAY_S = 0.2;

/** Each slide is shown for 8 seconds, matching the 8 second videos. */
export const SLIDE_DURATION_MS = 8000;

/** Slide background cross fade, matching --dur-crossfade. */
export const CROSSFADE_MS = 1200;
