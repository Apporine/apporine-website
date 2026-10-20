"use client";

import { motion } from "motion/react";
import { useRef, useState } from "react";
import { ButtonLink } from "@/components/button-link";
import { EASE_BRAND } from "@/components/hero/hero-motion";
import { Eyebrow } from "@/components/section/eyebrow";
import { LeadParagraph } from "@/components/section/lead-paragraph";
import { REDUCED_FADE_S, useReducedMotion } from "@/components/section/motion";
import { Reveal } from "@/components/section/reveal";
import { Section } from "@/components/section/section";
import { SectionHeadline } from "@/components/section/section-headline";
import { displayClass, focusRing, labelClass } from "@/components/section/tone";
import { routes } from "@/lib/routes";
import type { TextSegment } from "@/lib/text";
import { OrionVisual } from "./orion-visual";
import { RelyxusVisual } from "./relyxus-visual";
import { TiltFrame } from "./tilt-frame";

// Copy is locked: _brief/docs/08-homepage-content.md, section 5.
const eyebrow = "OUR PRODUCTS";
const headline: TextSegment[] = [{ text: "Our products carry our " }, { text: "name.", accent: true }];
const paragraph =
  "Every product we release is held to one standard: clear in design, correct under pressure and built for the long run. Here is what that looks like.";

type Product = {
  id: "relyxus" | "orion";
  name: string;
  chip?: string;
  category: string;
  description: string;
  pillars: { title: string; line: string }[];
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
};

const products: Product[] = [
  {
    id: "relyxus",
    name: "Relyxus",
    category: "AI INCIDENT RESPONSE",
    description:
      "When critical systems fail, Relyxus finds the cause, shows the evidence and resolves the incident within the approvals you set.",
    pillars: [
      { title: "Find the cause", line: "Evidence for every finding, never a guess." },
      { title: "Approve the fix", line: "Nothing changes without the right person’s approval." },
      { title: "Prove it", line: "Every action recorded for your audit trail." },
    ],
    primary: { label: "Meet Relyxus", href: routes.relyxus },
    secondary: { label: "Talk to us", href: routes.contact },
  },
  {
    id: "orion",
    name: "Orion",
    chip: "IN DEVELOPMENT",
    category: "OUR NEXT PRODUCT",
    description:
      "Orion is being engineered to the same pristine standard as everything we make. We will share the details when it’s ready.",
    pillars: [],
    primary: { label: "Talk to us", href: routes.contact },
  },
];

const TEXT_FADE_S = 0.2;
const FRAME_FADE_S = 0.4;

const tabId = (id: string) => `product-tab-${id}`;
const panelId = (id: string) => `product-panel-${id}`;

function Pillars({ pillars }: { pillars: Product["pillars"] }) {
  return (
    <ol className="mb-10 divide-y divide-plum-700 border-y border-plum-700">
      {pillars.map((pillar, index) => (
        <li key={pillar.title} className="flex gap-5 py-5">
          <span className="pt-1 font-mono text-[13px] font-medium text-citrine">{String(index + 1).padStart(2, "0")}</span>
          <span>
            <span className="block font-sans text-lg leading-[1.4] font-semibold text-plum-50">{pillar.title}</span>
            <span className="mt-1 block font-sans text-base leading-[1.6] text-plum-300">{pillar.line}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/**
 * Section 5 (07-homepage-spec.md): the product switcher (WAI-ARIA tabs with
 * arrow keys) and the product theatre, text on the left and the tilting
 * glass frame on the right. Panels are stacked so switching cross fades.
 */
export function Products({ hasRelyxusScreenshot }: { hasRelyxusScreenshot: boolean }) {
  const [active, setActive] = useState<Product["id"]>("relyxus");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const reducedMotion = useReducedMotion();

  function onTabKeyDown(event: React.KeyboardEvent, index: number) {
    const last = products.length - 1;
    const forward = document.dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    const back = document.dir === "rtl" ? "ArrowRight" : "ArrowLeft";
    const next =
      event.key === forward ? (index === last ? 0 : index + 1)
      : event.key === back ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    setActive(products[next].id);
    tabRefs.current[products[next].id]?.focus();
  }

  const fade = (seconds: number) => ({ duration: reducedMotion ? REDUCED_FADE_S : seconds, ease: EASE_BRAND });

  return (
    <Section labelledBy="products-title" background="bg-plum-900" surface="dark">
      <Reveal>
        <Eyebrow tone="dark">{eyebrow}</Eyebrow>
      </Reveal>
      <SectionHeadline id="products-title" tone="dark" segments={headline} />
      <Reveal>
        <LeadParagraph tone="dark">{paragraph}</LeadParagraph>
      </Reveal>

      <Reveal className="mt-14 md:mt-20">
        <div role="tablist" aria-label="Our products" className="mb-10 flex flex-wrap gap-x-8 gap-y-3 border-b border-plum-700 md:mb-14">
          {products.map((product, index) => {
            const selected = active === product.id;
            return (
              <button
                key={product.id}
                ref={(element) => {
                  tabRefs.current[product.id] = element;
                }}
                id={tabId(product.id)}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId(product.id)}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(product.id)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
                className={`relative -mb-px flex items-center gap-3 rounded-sm pt-2 pb-4 font-sans text-lg font-semibold transition-colors duration-240 ease-brand ${focusRing} ${
                  selected ? "text-plum-50" : "text-plum-300 hover:text-plum-50"
                }`}
              >
                {product.name}
                {product.chip && (
                  <span className={`${labelClass} rounded-pill border border-plum-600 px-2.5 py-1 text-[10px] text-plum-300`}>
                    {product.chip}
                  </span>
                )}
                {/* The light seam under the selected tab. */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-0.5 rounded-[2px] bg-citrine shadow-[0_0_10px_rgba(245,230,99,0.6)] transition-opacity duration-240 ease-brand ${
                    selected ? "opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="grid">
          {products.map((product) => {
            const selected = active === product.id;
            return (
              <div
                key={product.id}
                id={panelId(product.id)}
                role="tabpanel"
                aria-labelledby={tabId(product.id)}
                aria-hidden={selected ? undefined : true}
                inert={!selected}
                className={`col-start-1 row-start-1 grid gap-10 lg:grid-cols-12 lg:gap-12 ${selected ? "z-10" : ""}`}
              >
                <motion.div
                  initial={false}
                  animate={{ opacity: selected ? 1 : 0 }}
                  transition={fade(TEXT_FADE_S)}
                  className="lg:col-span-5"
                >
                  <h3 className={`${displayClass} mb-4 text-[64px] leading-[0.9] text-plum-50`}>{product.name}</h3>
                  <p className={`${labelClass} mb-6 text-plum-300`}>{product.category}</p>
                  <p className="mb-10 max-w-[32rem] font-sans text-lg leading-[1.6] text-plum-300">{product.description}</p>
                  {product.pillars.length > 0 && <Pillars pillars={product.pillars} />}
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <ButtonLink href={product.primary.href} variant="primary" className="w-full sm:w-auto">
                      {product.primary.label}
                    </ButtonLink>
                    {product.secondary && (
                      <ButtonLink href={product.secondary.href} variant="secondary" className="w-full sm:w-auto">
                        {product.secondary.label}
                      </ButtonLink>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={false}
                  animate={{ opacity: selected ? 1 : 0, scale: selected || reducedMotion ? 1 : 0.98 }}
                  transition={fade(FRAME_FADE_S)}
                  className="lg:col-span-7"
                >
                  <TiltFrame>
                    {product.id === "relyxus" ? <RelyxusVisual hasScreenshot={hasRelyxusScreenshot} /> : <OrionVisual />}
                  </TiltFrame>
                </motion.div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </Section>
  );
}
