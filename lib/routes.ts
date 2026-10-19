/**
 * Every page path on the site (spec 05-navigation-spec.md, section 7).
 * Navigation, hero and pages read paths from here, so a page can be built,
 * or a destination moved, without touching the components that link to it.
 */
export const routes = {
  home: "/",
  products: "/products",
  // Later this will point to the Relyxus website.
  relyxus: "/products/relyxus",
  orion: "/products/orion",
  build: "/build",
  industries: "/industries",
  financialServices: "/industries/financial-services",
  insurance: "/industries/insurance",
  telecommunications: "/industries/telecommunications",
  energyAndUtilities: "/industries/energy-and-utilities",
  logistics: "/industries/logistics",
  retailAndEcommerce: "/industries/retail-and-ecommerce",
  insights: "/insights",
  engineeringNotes: "/insights/engineering-notes",
  aiInProduction: "/insights/ai-in-production",
  operationalResilience: "/insights/operational-resilience",
  industryPerspectives: "/insights/industry-perspectives",
  company: "/company",
  leadership: "/company/leadership",
  careers: "/careers",
  press: "/press",
  contact: "/contact",
  trust: "/trust",
  security: "/security",
  privacy: "/privacy",
  cookies: "/cookies",
  terms: "/terms",
  accessibility: "/accessibility",
} as const;

export type RoutePath = (typeof routes)[keyof typeof routes];

/** In page anchors; until their sections exist they land on the parent page. */
export const anchors = {
  pristine: `${routes.company}#pristine`,
  howWePartner: `${routes.build}#how-we-partner`,
  howWeChoose: `${routes.products}#how-we-choose`,
  start: `${routes.build}#start`,
} as const;

/** Links that preselect a contact topic. */
export const contactTopics = {
  security: `${routes.contact}?topic=security`,
} as const;

/**
 * Pages not built yet. Each has an app/<path>/page.tsx that renders the
 * coming soon template with "<name> · Apporine" as its title. When a page is
 * built, replace that file and remove its entry here.
 */
export const comingSoonPages: { path: RoutePath; name: string }[] = [
  { path: routes.products, name: "Products" },
  { path: routes.relyxus, name: "Relyxus" },
  { path: routes.orion, name: "Orion" },
  { path: routes.build, name: "What we build" },
  { path: routes.industries, name: "Industries" },
  { path: routes.financialServices, name: "Financial services" },
  { path: routes.insurance, name: "Insurance" },
  { path: routes.telecommunications, name: "Telecommunications" },
  { path: routes.energyAndUtilities, name: "Energy and utilities" },
  { path: routes.logistics, name: "Logistics" },
  { path: routes.retailAndEcommerce, name: "Retail and ecommerce" },
  { path: routes.insights, name: "Insights" },
  { path: routes.engineeringNotes, name: "Engineering notes" },
  { path: routes.aiInProduction, name: "AI in production" },
  { path: routes.operationalResilience, name: "Operational resilience" },
  { path: routes.industryPerspectives, name: "Industry perspectives" },
  { path: routes.company, name: "Company" },
  { path: routes.leadership, name: "Leadership" },
  { path: routes.careers, name: "Careers" },
  { path: routes.press, name: "Press" },
  { path: routes.contact, name: "Contact" },
  { path: routes.trust, name: "Trust centre" },
  { path: routes.security, name: "Security" },
  { path: routes.privacy, name: "Privacy" },
  { path: routes.cookies, name: "Cookies" },
  { path: routes.terms, name: "Terms" },
  { path: routes.accessibility, name: "Accessibility" },
];
