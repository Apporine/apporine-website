import { ButtonLink } from "@/components/button-link";
import { Eyebrow } from "@/components/section/eyebrow";
import { LeadParagraph } from "@/components/section/lead-paragraph";
import { Reveal } from "@/components/section/reveal";
import { Section } from "@/components/section/section";
import { SectionHeadline } from "@/components/section/section-headline";
import { labelClass } from "@/components/section/tone";
import { contactTopics, routes } from "@/lib/routes";
import { assurance, type AssuranceStatus } from "@/lib/site";
import type { TextSegment } from "@/lib/text";

// Copy is locked: _brief/docs/08-homepage-content.md, section 9.
const eyebrow = "TRUST AND SECURITY";
const headline: TextSegment[] = [{ text: "Built to be " }, { text: "examined.", accent: true }];
const paragraph =
  "Enterprises trust what they can verify. So we design for scrutiny from day one: clear controls, honest status and evidence on request.";
const roadmapLabel = "OUR ASSURANCE ROADMAP";

/** Small citrine line icons, 24px. Decorative. */
const principleIcons = {
  // Shield.
  security: <path d="M12 3 5 6v5.5c0 4.2 2.9 7.9 7 9.5 4.1-1.6 7-5.3 7-9.5V6z" />,
  // Padlock.
  data: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </>
  ),
  // A switch held in the on position.
  control: (
    <>
      <rect x="3" y="8" width="18" height="8" rx="4" />
      <circle cx="17" cy="12" r="2" />
    </>
  ),
  // An open eye.
  transparent: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.75" />
    </>
  ),
};

const principles: { icon: keyof typeof principleIcons; title: string; body: string }[] = [
  {
    icon: "security",
    title: "Security by design",
    body: "Threat modelling, least privilege access and encryption in transit and at rest.",
  },
  {
    icon: "data",
    title: "Your data stays yours",
    body: "We collect only what we need, and client data is never used to train shared models.",
  },
  {
    icon: "control",
    title: "Humans stay in control",
    body: "Our AI acts only within the approvals you define, and every action is recorded.",
  },
  {
    icon: "transparent",
    title: "Transparent by default",
    body: "Policies, security questionnaires and evidence shared under NDA.",
  },
];

const statusStyles: Record<AssuranceStatus, string> = {
  "In place": "bg-citrine text-plum-800 border-citrine",
  "In progress": "border-citrine text-citrine",
  Planned: "border-plum-400 text-plum-300",
};

function StatusPill({ status }: { status: AssuranceStatus }) {
  return (
    <span
      className={`inline-flex h-7 items-center rounded-pill border px-3 font-mono text-[11px] font-medium tracking-[0.08em] whitespace-nowrap uppercase ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

/**
 * Section 9 (07-homepage-spec.md): four principles and the assurance roadmap,
 * on a blueprint grid with a slow scanning line. Statuses come from
 * lib/site.ts. Never any certification logo or badge: text and statuses only.
 */
export function Trust() {
  return (
    <Section labelledBy="trust-title" background="bg-plum-800" className="overflow-hidden">
      <div aria-hidden="true" className="blueprint-grid" />
      <div aria-hidden="true" className="blueprint-scan" />

      <Reveal>
        <Eyebrow tone="dark">{eyebrow}</Eyebrow>
      </Reveal>
      <SectionHeadline id="trust-title" tone="dark" segments={headline} />
      <Reveal>
        <LeadParagraph tone="dark">{paragraph}</LeadParagraph>
      </Reveal>

      <ul className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2">
        {principles.map((principle, index) => (
          <Reveal
            key={principle.title}
            as="li"
            index={index}
            className="rounded-[24px] border border-[rgba(165,59,239,0.3)] bg-[rgba(18,4,26,0.45)] p-8"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="var(--citrine)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              {principleIcons[principle.icon]}
            </svg>
            <h3 className="mt-8 font-sans text-[22px] leading-[1.3] font-semibold text-plum-50">{principle.title}</h3>
            <p className="mt-2 font-sans text-base leading-[1.6] text-plum-300">{principle.body}</p>
          </Reveal>
        ))}
      </ul>

      <Reveal className="mt-16 md:mt-24">
        <h3 id="assurance-roadmap" className={`${labelClass} mb-6 text-plum-300`}>
          {roadmapLabel}
        </h3>
        <table aria-labelledby="assurance-roadmap" className="w-full border-collapse text-start">
          <thead className="sr-only">
            <tr>
              <th scope="col">Item</th>
              <th scope="col">What it means</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody className="border-t border-plum-600">
            {assurance.map((row) => (
              <tr
                key={row.item}
                className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 border-b border-plum-600 py-5 md:table-row md:py-0"
              >
                <th scope="row" className="text-start font-sans text-lg font-semibold text-plum-50 md:w-[30%] md:py-5 md:pe-6">
                  {row.item}
                </th>
                <td className="col-start-1 row-start-2 font-sans text-base leading-[1.5] text-plum-300 md:py-5 md:pe-6">{row.meaning}</td>
                <td className="col-start-2 row-span-2 row-start-1 self-center text-end md:py-5">
                  <StatusPill status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      <Reveal className="mt-12 flex flex-col gap-3 md:flex-row md:flex-wrap">
        <ButtonLink href={routes.trust} variant="primary" className="w-full md:w-auto">
          Visit the Trust centre
        </ButtonLink>
        <ButtonLink href={contactTopics.security} variant="secondary" className="w-full md:w-auto">
          Request our security pack
        </ButtonLink>
      </Reveal>
    </Section>
  );
}
