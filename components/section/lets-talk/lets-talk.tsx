import { gutter } from "@/components/layout";
import { Eyebrow } from "@/components/section/eyebrow";
import { Reveal } from "@/components/section/reveal";
import { deferredRendering } from "@/components/section/section";
import { SectionHeadline } from "@/components/section/section-headline";
import { focusRing } from "@/components/section/tone";
import type { LetsTalkContent } from "@/lib/lets-talk";
import { shieldAttribute } from "./guilloche";
import { GuillocheBackground } from "./guilloche-background";
import { IntentSelector } from "./intent-selector";

type LetsTalkProps = LetsTalkContent & {
  /** Section id; the headline is `${id}-title`. */
  id: string;
};

/** Before the canvas paints (and without script): the same base gradient. */
const baseGradient = "bg-[linear-gradient(to_bottom_right,#100318,#26092F)]";

/**
 * Closing invitation: a settled, centred block (max 820px) over the
 * Guilloché Reveal, with the segmented selector and the email fallback.
 * Reusable on inner pages with their own content.
 */
export function LetsTalk({ id, eyebrow, headline, lead, options, email }: LetsTalkProps) {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      data-surface="dark"
      className={`relative isolate flex min-h-[clamp(520px,72svh,680px)] items-center overflow-hidden ${baseGradient} ${deferredRendering}`}
    >
      <GuillocheBackground />

      <div className={`${gutter} py-20`}>
        <div {...shieldAttribute} className="mx-auto flex max-w-[820px] flex-col items-center text-center">
          <Reveal>
            <Eyebrow tone="dark" citrine className="mb-6 justify-center">
              {eyebrow}
            </Eyebrow>
          </Reveal>
          <SectionHeadline
            id={titleId}
            tone="dark"
            segments={headline}
            className="mb-6 max-w-[760px] text-[clamp(36px,4.2vw,64px)] leading-[0.9]"
          />
          <Reveal>
            <p className="mb-9 max-w-[520px] font-sans text-[17px] leading-[1.6] text-[#F3EDF7]">{lead}</p>
          </Reveal>
          <Reveal className="max-sm:w-full">
            <IntentSelector options={options} label="Choose where you are starting from" />
          </Reveal>
          <Reveal>
            <p className="mt-6 font-sans text-[13px] leading-[1.5] text-plum-300">
              Prefer email?{" "}
              <a
                href={`mailto:${email}`}
                className={`rounded-sm font-semibold text-plum-50 underline decoration-transparent decoration-1 underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-citrine ${focusRing}`}
              >
                {email}
              </a>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
