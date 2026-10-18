/** Navigation content. Copy is locked: see _brief/docs/06-navigation-content.md. */

import { anchors, routes } from "@/lib/routes";
import type { TextSegment } from "@/lib/text";

export type NavLink = {
  title: string;
  description?: string;
  /** Absent for a muted entry: shown, not clickable. */
  href?: string;
};

export type NavColumn = {
  /** Empty string: no heading, the spacing is kept. */
  heading: string;
  links: NavLink[];
};

/** A silent looping film in /public/videos (webm, mp4 and -poster.webp). */
export type NavFilm = "hero-01-monolith-mobile" | "hero-02-armillary-mobile" | "hero-03-bridge-mobile";

export type NavFeature = {
  eyebrow: string;
  title: TextSegment[];
  line: string;
  button: { label: string; href: string };
  film: NavFilm;
};

export type NavItem = {
  id: string;
  label: string;
  feature: NavFeature;
  columns: NavColumn[];
};

export const talkToUs = { label: "Talk to us", href: routes.contact };
export const startBuilding = { label: "Start building", href: anchors.start };

export const navItems: NavItem[] = [
  {
    id: "products",
    label: "Products",
    feature: {
      eyebrow: "OUR FIRST PRODUCT",
      title: [{ text: "Relyxus" }],
      line: "AI incident response that resolves outages within the approvals you set.",
      button: { label: "Meet Relyxus", href: routes.relyxus },
      film: "hero-02-armillary-mobile",
    },
    columns: [
      {
        heading: "Products",
        links: [
          { title: "Relyxus", description: "AI incident response for critical systems.", href: routes.relyxus },
          { title: "More in development", description: "Announced when they’re ready." },
        ],
      },
      {
        heading: "How we build",
        links: [
          { title: "The pristine standard", description: "Clear in design, correct under pressure.", href: anchors.pristine },
          { title: "How we choose what to build", description: "Every product starts with a costly problem.", href: anchors.howWeChoose },
        ],
      },
    ],
  },
  {
    id: "what-we-build",
    label: "What we build",
    feature: {
      eyebrow: "BUILD WITH APPORINE",
      title: [{ text: "Your next product, built " }, { text: "pristine.", accent: true }],
      line: "Platforms, apps, AI agents and automation, engineered to the standard of our own products.",
      button: { label: "Start building", href: anchors.start },
      film: "hero-03-bridge-mobile",
    },
    columns: [
      {
        heading: "Capabilities",
        links: [
          { title: "Enterprise platforms", description: "Core systems built to last.", href: routes.build },
          { title: "AI agents and automation", description: "Intelligence that does real work.", href: routes.build },
          { title: "Web and mobile apps", description: "Products customers love to use.", href: routes.build },
        ],
      },
      {
        heading: "",
        links: [
          { title: "Cloud and DevOps", description: "Infrastructure built to stay up.", href: routes.build },
          { title: "Data and integration", description: "Every system, finally talking.", href: routes.build },
        ],
      },
      {
        heading: "Partner with us",
        links: [
          { title: "How we partner", description: "From first idea to running product.", href: anchors.howWePartner },
          { title: "Start a project", description: "Tell us the problem worth solving.", href: anchors.start },
        ],
      },
    ],
  },
  {
    id: "industries",
    label: "Industries",
    feature: {
      eyebrow: "INDUSTRIES",
      title: [{ text: "Where value moves and failure is " }, { text: "costly.", accent: true }],
      line: "We build for the industries that cannot afford a bad hour.",
      button: { label: "Explore industries", href: routes.industries },
      film: "hero-01-monolith-mobile",
    },
    columns: [
      {
        heading: "Industries",
        links: [
          { title: "Financial services", description: "Payments, banking and markets that never sleep.", href: routes.financialServices },
          { title: "Insurance", description: "Faster claims, fewer leaks.", href: routes.insurance },
          { title: "Telecommunications", description: "Networks millions depend on.", href: routes.telecommunications },
        ],
      },
      {
        heading: "",
        links: [
          { title: "Energy and utilities", description: "Grids that keep the lights on.", href: routes.energyAndUtilities },
          { title: "Logistics", description: "Supply chains that cannot stall.", href: routes.logistics },
          { title: "Retail and ecommerce", description: "Stock, checkout and customers in sync.", href: routes.retailAndEcommerce },
        ],
      },
    ],
  },
  {
    id: "insights",
    label: "Insights",
    feature: {
      eyebrow: "LATEST INSIGHT",
      title: [{ text: "Ideas from the people building " }, { text: "tomorrow.", accent: true }],
      line: "Field notes on engineering, AI in production and the problems that cost industries most.",
      button: { label: "Read the latest", href: routes.insights },
      film: "hero-02-armillary-mobile",
    },
    columns: [
      {
        heading: "Topics",
        links: [
          { title: "Engineering notes", description: "How we build, in detail.", href: routes.engineeringNotes },
          { title: "AI in production", description: "What works beyond the demo.", href: routes.aiInProduction },
        ],
      },
      {
        heading: "",
        links: [
          { title: "Operational resilience", description: "Keeping critical systems running.", href: routes.operationalResilience },
          { title: "Industry perspectives", description: "Where each industry loses money.", href: routes.industryPerspectives },
        ],
      },
      {
        heading: "Explore",
        links: [{ title: "All insights", href: routes.insights }],
      },
    ],
  },
  {
    id: "company",
    label: "Company",
    feature: {
      eyebrow: "COMPANY",
      title: [{ text: "A company built to " }, { text: "last.", accent: true }],
      line: "The people, principles and pristine standard behind every product we build.",
      button: { label: "Our story", href: routes.company },
      film: "hero-01-monolith-mobile",
    },
    columns: [
      {
        heading: "About",
        links: [
          { title: "Our story", description: "Why Apporine exists.", href: routes.company },
          { title: "The pristine standard", description: "What every product must be.", href: anchors.pristine },
          { title: "Leadership", description: "The people accountable.", href: routes.leadership },
        ],
      },
      {
        heading: "Join and connect",
        links: [
          { title: "Careers", description: "Build what tomorrow runs on.", href: routes.careers },
          { title: "Press", description: "News and brand assets.", href: routes.press },
          { title: "Contact", description: "Talk to our team.", href: routes.contact },
        ],
      },
    ],
  },
];
