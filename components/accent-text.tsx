import type { TextSegment } from "@/lib/text";

/** Accent word: Instrument Serif Italic in citrine, inside a display headline. */
const accentClass =
  "-me-[0.06em] pe-[0.06em] font-serif text-[1.05em] font-normal tracking-normal text-citrine normal-case italic [font-variation-settings:normal]";

/** Renders text segments, styling `accent` runs as the citrine serif word. */
export function AccentText({ segments }: { segments: TextSegment[] }) {
  return segments.map((segment, index) =>
    segment.accent ? (
      <em key={index} className={accentClass}>
        {segment.text}
      </em>
    ) : (
      <span key={index}>{segment.text}</span>
    ),
  );
}
