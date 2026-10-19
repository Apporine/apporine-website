import type { TextSegment } from "@/lib/text";
import { accentClass, type Tone } from "./tone";

/** Renders text segments inside a display title, styling `accent` runs for the tone. */
export function SegmentText({ segments, tone }: { segments: TextSegment[]; tone: Tone }) {
  return segments.map((segment, index) =>
    segment.accent ? (
      <em key={index} className={accentClass(tone)}>
        {segment.text}
      </em>
    ) : (
      <span key={index}>{segment.text}</span>
    ),
  );
}
