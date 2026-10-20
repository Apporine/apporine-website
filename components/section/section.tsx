import { gutter } from "@/components/layout";

type SectionProps = {
  /** Id of the section headline, used as the section's accessible name. */
  labelledBy: string;
  /** Background utility, e.g. "bg-plum-950" (rhythm table in 07-homepage-spec.md). */
  background: string;
  /** Vertical padding; defaults to `sectionPadding`. */
  padding?: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * Below the fold: the browser skips layout and paint until a section comes
 * near the viewport (its rendered size is remembered afterwards).
 */
export const deferredRendering = "[content-visibility:auto] [contain-intrinsic-size:auto_1000px]";

/** Vertical padding: 88px on phones, clamp(96px, 12vw, 176px) from 768px. */
export const sectionPadding = "py-[88px] md:py-[clamp(96px,12vw,176px)]";

/**
 * Homepage section: background, the hero side margin (so every left edge
 * lines up with the hero headline) and the vertical padding.
 */
export function Section({ labelledBy, background, padding = sectionPadding, className = "", children }: SectionProps) {
  return (
    <section aria-labelledby={labelledBy} className={`relative isolate ${deferredRendering} ${background} ${className}`}>
      <div className={`${gutter} ${padding}`}>{children}</div>
    </section>
  );
}
