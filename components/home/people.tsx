import Image from "next/image";
import { Eyebrow } from "@/components/section/eyebrow";
import { LeadParagraph } from "@/components/section/lead-paragraph";
import { Reveal } from "@/components/section/reveal";
import { Section } from "@/components/section/section";
import { SectionHeadline } from "@/components/section/section-headline";
import { displayClass, focusRingLight, labelClass, lightBodyColour } from "@/components/section/tone";
import { founderQuote, people, type Person } from "@/lib/site";
import type { TextSegment } from "@/lib/text";

// Copy is locked: _brief/docs/08-homepage-content.md, section 10.
const eyebrow = "THE PEOPLE BEHIND APPORINE";
const headline: TextSegment[] = [{ text: "Accountable people. Not a faceless " }, { text: "vendor.", accent: true }];
const paragraph = "You will always know who is building your product, and who answers for it.";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Real photograph from /public/people/, or the monogram tile until one exists. Never AI faces or stock photos. */
function Portrait({ person }: { person: Person }) {
  return (
    <div data-surface="dark" className="relative mb-6 aspect-[4/5] overflow-hidden rounded-[24px] bg-plum-800">
      <div className="size-full transition-transform duration-240 ease-brand group-hover:scale-[1.03] motion-reduce:group-hover:scale-100">
        {person.photo ? (
          <Image src={person.photo} alt={person.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
        ) : (
          <div aria-hidden="true" className="flex size-full items-center justify-center">
            <span className="flex size-40 items-center justify-center rounded-full border border-citrine">
              <span className={`${displayClass} text-[64px] leading-none tracking-normal text-plum-50`}>{initials(person.name)}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function PersonCard({ person }: { person: Person }) {
  return (
    <article className="group">
      <Portrait person={person} />
      <h3 className="relative inline-block font-sans text-[22px] leading-[1.3] font-semibold text-plum-800">
        {person.name}
        {/* Citrine line under the name on hover. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 bg-citrine transition-transform duration-240 ease-brand group-hover:scale-x-100 rtl:origin-right"
        />
      </h3>
      {person.role && <p className={`${labelClass} mt-3 text-plum-600`}>{person.role}</p>}
      {person.bio && <p className={`mt-3 font-sans text-base leading-[1.6] ${lightBodyColour}`}>{person.bio}</p>}
      {person.linkedIn && (
        <a
          href={person.linkedIn}
          rel="noopener noreferrer"
          target="_blank"
          className={`mt-4 inline-block rounded-sm font-sans text-[15px] font-semibold text-plum-800 underline decoration-plum-200 underline-offset-4 hover:decoration-orchid ${focusRingLight}`}
        >
          LinkedIn<span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
    </article>
  );
}

/** Section 10 (07-homepage-spec.md): people cards (room for four) and the founder quote, from lib/site.ts. */
export function People() {
  const shown = people.filter((person) => person.name);

  return (
    <Section labelledBy="people-title" background="bg-plum-50" surface="light">
      <Reveal>
        <Eyebrow tone="light">{eyebrow}</Eyebrow>
      </Reveal>
      <SectionHeadline id="people-title" tone="light" segments={headline} />
      <Reveal>
        <LeadParagraph tone="light">{paragraph}</LeadParagraph>
      </Reveal>

      {shown.length > 0 && (
        <ul className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
          {shown.map((person, index) => (
            <Reveal key={person.name} as="li" index={index}>
              <PersonCard person={person} />
            </Reveal>
          ))}
        </ul>
      )}

      <Reveal className="mt-20 md:mt-28">
        <figure className="max-w-[44rem]">
          <blockquote>
            <p className="font-serif text-[clamp(28px,3vw,44px)] leading-[1.2] text-plum-800 italic">{founderQuote.text}</p>
          </blockquote>
          <figcaption className={`${labelClass} mt-6 text-plum-600`}>{founderQuote.attribution}</figcaption>
        </figure>
      </Reveal>
    </Section>
  );
}
