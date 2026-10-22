import { Eyebrow } from "@/components/section/eyebrow";
import { SectionHeadline } from "@/components/section/section-headline";
import { industriesSection } from "@/lib/industries";
import { IndustryConsole } from "./industry-console";

/** Section 4, Industries: the Light Console on Ivory. */
export function Industries() {
  return (
    <section
      id="industries"
      aria-labelledby="industries-title"
      data-surface="light"
      className="relative isolate bg-ivory py-[clamp(96px,10vw,140px)]"
    >
      <div className="px-[clamp(20px,4vw,64px)]">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-[880px] min-w-0 flex-[1_1_560px]">
              <Eyebrow tone="light" className="mb-6">
                {industriesSection.eyebrow}
              </Eyebrow>
              <SectionHeadline
                id="industries-title"
                tone="light"
                segments={industriesSection.headline}
                className="text-[clamp(40px,5vw,76px)] leading-[0.92]"
              />
            </div>
            <p className="max-w-[400px] flex-[0_1_400px] font-sans text-lg leading-[1.55] text-[#3A2347]">
              {industriesSection.lead}
            </p>
          </div>
          <IndustryConsole />
        </div>
      </div>
    </section>
  );
}
