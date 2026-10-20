import { ButtonLink } from "@/components/button-link";
import { Eyebrow } from "@/components/section/eyebrow";
import { Film } from "@/components/section/film";
import { LeadParagraph } from "@/components/section/lead-paragraph";
import { Reveal } from "@/components/section/reveal";
import { Section } from "@/components/section/section";
import { SectionHeadline } from "@/components/section/section-headline";
import { SegmentText } from "@/components/section/segment-text";
import { displayClass, labelClass } from "@/components/section/tone";
import { anchors, routes } from "@/lib/routes";
import type { TextSegment } from "@/lib/text";

// Copy is locked: _brief/docs/08-homepage-content.md, section 4.
const eyebrow = "TWO WAYS TO WORK WITH APPORINE";
const headline: TextSegment[] = [{ text: "Use what we’ve built. Or build what’s " }, { text: "next.", accent: true }];
const paragraph =
  "Some problems are shared by entire industries, so we build products for them. Others are yours alone, so we build with you.";

type WayCard = {
  label: string;
  title: TextSegment[];
  body: string;
  button: { label: string; href: string };
  film: string;
};

const cards: WayCard[] = [
  {
    label: "OUR PRODUCTS",
    title: [{ text: "Products, engineered " }, { text: "pristine.", accent: true }],
    body: "Proven software for the operations that matter most. Licensed, supported and improved by the team that built it.",
    button: { label: "Explore our products", href: routes.products },
    film: "hero-02-armillary-mobile",
  },
  {
    label: "BUILD WITH APPORINE",
    title: [{ text: "Your product, built to " }, { text: "our standard.", accent: true }],
    body: "Platforms, apps, AI agents and automation, designed, built and run together with your team.",
    button: { label: "Start building", href: anchors.start },
    film: "hero-03-bridge-mobile",
  },
];

/** Blends the film into the card. */
const FILM_FADE = "linear-gradient(180deg, rgba(18,4,26,0) 40%, var(--plum-950) 100%)";

function Card({ card }: { card: WayCard }) {
  return (
    <article data-surface="dark" data-cursor="card" className="group/card relative isolate flex h-full min-h-[560px] flex-col overflow-hidden rounded-[28px] bg-plum-950 outline-1 -outline-offset-1 outline-transparent transition-[translate,outline-color] duration-240 ease-brand hover:-translate-y-1.5 hover:outline-citrine/50 has-focus-visible:-translate-y-1.5 motion-reduce:hover:translate-y-0">
      {/* Top 55% of the 560px card: the living film inset. */}
      <div className="relative h-[308px] shrink-0">
        <Film
          name={card.film}
          className="transition-[filter] duration-240 ease-brand group-hover/card:brightness-[1.08]"
        />
        <div aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: FILM_FADE }} />
      </div>

      {/* A 2px citrine line draws along the top edge on hover. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-0.5 origin-left scale-x-0 bg-citrine transition-transform duration-500 ease-brand group-hover/card:scale-x-100 group-has-focus-visible/card:scale-x-100 rtl:origin-right"
      />

      <div className="flex flex-1 flex-col items-start p-7 md:p-9">
        <p className={`${labelClass} mb-4 text-plum-300`}>{card.label}</p>
        <h3 className={`${displayClass} mb-4 text-[36px] leading-[0.95] text-plum-50`}>
          <SegmentText segments={card.title} tone="dark" />
        </h3>
        <p className="mb-8 max-w-[30rem] font-sans text-base leading-[1.6] text-plum-300">{card.body}</p>
        {/* Stretched link: the button is the accessible link, its hit area covers the card. */}
        <ButtonLink
          href={card.button.href}
          variant="primary"
          className="mt-auto after:absolute after:inset-0 after:content-['']"
        >
          {card.button.label}
        </ButtonLink>
      </div>
    </article>
  );
}

/** Section 4 (07-homepage-spec.md): products or a partnership, as two film cards. */
export function TwoWays() {
  return (
    <Section labelledBy="two-ways-title" background="bg-plum-50" surface="light">
      <Reveal>
        <Eyebrow tone="light">{eyebrow}</Eyebrow>
      </Reveal>
      <SectionHeadline id="two-ways-title" tone="light" segments={headline} />
      <Reveal>
        <LeadParagraph tone="light">{paragraph}</LeadParagraph>
      </Reveal>

      <ul className="mt-14 grid gap-6 md:mt-20 md:grid-cols-2">
        {cards.map((card, index) => (
          <Reveal key={card.label} as="li" index={index}>
            <Card card={card} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
