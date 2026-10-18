/** A run of text; `accent` runs render in Instrument Serif Italic, citrine. */
export type TextSegment = {
  text: string;
  accent?: boolean;
};

export function plainText(segments: TextSegment[]): string {
  return segments.map((segment) => segment.text).join("");
}
