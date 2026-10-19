import { ButtonLink } from "@/components/button-link";
import { Falcon } from "@/components/brand-marks";
import { gutter } from "@/components/layout";
import { deferredRendering } from "@/components/section/section";
import { focusRing } from "@/components/section/tone";
import { anchors, routes } from "@/lib/routes";
import { companyDetailsSentence, social } from "@/lib/site";
import { FooterColumns, FooterLink, type FooterColumn } from "./footer-columns";
import { FooterWordmark } from "./footer-wordmark";

// Copy is locked: _brief/docs/08-homepage-content.md, section 13.
const statement = "Building what tomorrow’s enterprises will run on.";
const startBuilding = { label: "Start building", href: anchors.start };
const copyright = "© 2026 Apporine. All rights reserved.";

const columns: FooterColumn[] = [
  {
    heading: "Products",
    links: [
      { label: "Relyxus", href: routes.relyxus },
      { label: "Orion", href: routes.orion },
      { label: "The pristine standard", href: anchors.pristine },
    ],
  },
  {
    heading: "What we build",
    links: [
      { label: "Enterprise platforms", href: routes.build },
      { label: "AI agents and automation", href: routes.build },
      { label: "Web and mobile apps", href: routes.build },
      { label: "Cloud and DevOps", href: routes.build },
      { label: "Data and integration", href: routes.build },
    ],
  },
  {
    heading: "Industries",
    links: [
      { label: "Financial services", href: routes.financialServices },
      { label: "Insurance", href: routes.insurance },
      { label: "Telecommunications", href: routes.telecommunications },
      { label: "Energy and utilities", href: routes.energyAndUtilities },
      { label: "Logistics", href: routes.logistics },
      { label: "Retail and ecommerce", href: routes.retailAndEcommerce },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Our story", href: routes.company },
      { label: "Leadership", href: routes.leadership },
      { label: "Careers", href: routes.careers },
      { label: "Press", href: routes.press },
      { label: "Contact", href: routes.contact },
    ],
  },
  {
    heading: "Trust",
    links: [
      { label: "Trust centre", href: routes.trust },
      { label: "Security", href: routes.security },
      { label: "Privacy", href: routes.privacy },
      { label: "Cookies", href: routes.cookies },
      { label: "Terms", href: routes.terms },
      { label: "Accessibility", href: routes.accessibility },
    ],
  },
];

const legalLinks = [
  { label: "Privacy", href: routes.privacy },
  { label: "Cookies", href: routes.cookies },
  { label: "Terms", href: routes.terms },
  { label: "Accessibility", href: routes.accessibility },
];

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M4.5 3A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3zm2.1 6.6h2.6V18H6.6zM7.9 5.6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm3.3 4h2.5v1.2c.4-.7 1.3-1.4 2.6-1.4 2.7 0 3.2 1.8 3.2 4.1V18h-2.6v-4c0-1 0-2.2-1.4-2.2s-1.6 1-1.6 2.1V18h-2.6z" />
    </svg>
  );
}

/**
 * Section 13 (07-homepage-spec.md): statement band, link grid, legal row and
 * the monumental wordmark. Company details and LinkedIn render only once
 * they are filled in lib/site.ts.
 */
export function Footer() {
  const companyDetails = companyDetailsSentence();

  return (
    <footer className={`relative isolate overflow-hidden bg-plum-950 ${deferredRendering}`}>
      <div className={`${gutter} pt-[88px] md:pt-[clamp(96px,10vw,144px)]`}>
        {/* 1. Statement band. */}
        <div className="flex flex-col items-start gap-8 border-b border-plum-700 pb-12 md:flex-row md:items-center md:justify-between md:pb-16">
          <p className="flex flex-col items-start gap-5 md:flex-row md:items-center md:gap-6">
            <Falcon width={48} height={21} className="h-[21px] w-12 shrink-0 object-contain" />
            <em className="font-serif text-[28px] leading-[1.2] font-normal text-citrine italic">{statement}</em>
          </p>
          <ButtonLink href={startBuilding.href} variant="primary" className="w-full md:w-auto">
            {startBuilding.label}
          </ButtonLink>
        </div>

        {/* 2. Link grid. */}
        <FooterColumns columns={columns} />

        {/* 3. Legal row. */}
        <div className="flex flex-col gap-5 py-8 font-sans text-sm text-plum-300 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <p>{copyright}</p>
            {companyDetails && <p>{companyDetails}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {social.linkedIn && (
              <a
                href={social.linkedIn}
                rel="noopener noreferrer"
                target="_blank"
                aria-label="Apporine on LinkedIn (opens in a new tab)"
                className={`inline-flex size-11 items-center justify-center rounded-full text-plum-200 transition-colors duration-240 ease-brand hover:text-plum-50 ${focusRing}`}
              >
                <LinkedInIcon />
              </a>
            )}
            <ul className="flex flex-wrap gap-x-6 gap-y-1">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Monumental wordmark. */}
      <FooterWordmark />
    </footer>
  );
}
