/*
 * Shared navigation geometry (05-navigation-spec.md sections 1 and 6).
 * From 768px the capsule sits 27px outside the hero side margin: its 1px
 * border plus 26px of padding put the Falcon exactly on the hero content
 * edge. Under 768px: 12px from the screen edges, and 1px border plus 11px
 * padding put the Falcon on the 24px hero margin.
 */
export const capsuleInset = "mx-3 md:mx-[calc(clamp(24px,8vw,160px)-27px)]";
export const capsulePadding = "px-[11px] md:ps-[26px] md:pe-3";

/** "Menu" and "Close": 44px high pill. */
export const pillButton =
  "inline-flex h-11 min-w-11 shrink-0 items-center justify-center rounded-pill border border-[rgba(201,179,222,0.35)] px-4 font-sans text-sm font-semibold text-plum-50 transition-colors duration-(--dur-micro) ease-brand hover:border-plum-300 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-citrine";
