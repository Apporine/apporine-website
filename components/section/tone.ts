/**
 * A section is dark (plum backgrounds) or light (Pearl and Lilac Mist); text
 * colours follow the tone (07-homepage-spec.md, "Typography").
 */
export type Tone = "dark" | "light";

/** Accent word: Instrument Serif Italic, lowercase, 1.05em. Citrine on dark, Orchid on light. */
export function accentClass(tone: Tone): string {
  return `-me-[0.06em] pe-[0.06em] font-serif text-[1.05em] font-normal tracking-normal normal-case italic [font-variation-settings:normal] ${
    tone === "dark" ? "text-citrine" : "text-orchid"
  }`;
}

/** Display headline: Bricolage Grotesque 800, condensed, uppercase. */
export const displayClass =
  "font-display font-extrabold tracking-[-0.015em] uppercase [font-variation-settings:'wdth'_75,'opsz'_96]";

/** Small labels: IBM Plex Mono 500, 11px, 0.16em, uppercase. */
export const labelClass = "font-mono text-[11px] leading-[1.3] font-medium tracking-[0.16em] uppercase";

/** Body copy on light sections (spec value, between --plum-800 and --plum-600). */
export const lightBodyColour = "text-[#4A3456]";

/** 3px citrine focus ring (dark sections). */
export const focusRing = "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-citrine";

/** 3px Orchid Deep focus ring, for light surfaces (05-navigation-spec.md section 8). */
export const focusRingLight =
  "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-orchid-deep";
