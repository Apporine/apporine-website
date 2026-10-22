import { contactForIndustry, routes, type RoutePath } from "@/lib/routes";
import type { TextSegment } from "@/lib/text";

/*
 * The six industries (homepage section 4, "Industries", the Light Console).
 * Copy is locked, word for word. Industry pages will reuse these entries.
 */

export type IndustrySlug =
  | "financial-services"
  | "insurance"
  | "telecommunications"
  | "energy-and-utilities"
  | "logistics-and-supply-chain"
  | "retail-and-ecommerce";

export type Capability = { title: string; description: string };

/** The glass card over the industry image. */
export type IndustryCard = {
  kicker: string;
  title: string;
  text: string;
  button: { label: string; href: string };
};

export type Industry = {
  slug: IndustrySlug;
  name: string;
  /** Shown as written (uppercase). */
  label: string;
  /** Plain part, then the Instrument Serif Italic accent. */
  stakes: TextSegment[];
  challenge: string;
  /** Three rows: operational (shield), platforms (layers), intelligence (spark). */
  build: [Capability, Capability, Capability];
  image: { src: string; alt: string };
  card: IndustryCard;
  href: RoutePath;
};

export const industriesSection: {
  eyebrow: string;
  headline: TextSegment[];
  lead: string;
  challengeLabel: string;
  buildLabel: string;
} = {
  eyebrow: "INDUSTRIES",
  headline: [{ text: "Engineering for the industries that keep the world " }, { text: "running.", accent: true }],
  lead: "From financial services to energy, we focus on six industries where reliability is never optional, and build the platforms, products and intelligence they run on.",
  challengeLabel: "THE CHALLENGE",
  buildLabel: "WHAT WE BUILD",
};

/** The link under each industry's content. */
export function exploreLabel(industry: Industry): string {
  return `Explore ${industry.name}`;
}

const image = (slug: IndustrySlug, alt: string) => ({
  src: `/images/industries/${slug}.jpg`,
  alt,
});

function relyxusCard(text: string): IndustryCard {
  return {
    kicker: "BUILT FOR THIS INDUSTRY",
    title: "Relyxus",
    text,
    button: { label: "Meet Relyxus", href: routes.relyxus },
  };
}

function invitationCard(slug: IndustrySlug): IndustryCard {
  return {
    kicker: "LET’S TALK",
    title: "Bring us the problem that costs you most.",
    text: "Tell us where your operation loses time, money or trust. We’ll tell you, honestly, whether we can build what ends it.",
    button: { label: "Start a conversation", href: contactForIndustry(slug) },
  };
}

export const industries: Industry[] = [
  {
    slug: "financial-services",
    name: "Financial Services",
    label: "FINANCIAL SERVICES",
    stakes: [{ text: "Where a minute offline is measured in " }, { text: "trust.", accent: true }],
    challenge:
      "Payments, core banking and trading must run without pause, under regulators who expect every failure to be explained.",
    build: [
      {
        title: "Operational resilience",
        description: "Incidents detected, diagnosed and resolved before customers feel them.",
      },
      {
        title: "Core and payment platforms",
        description: "Modern foundations that scale without risking what already works.",
      },
      {
        title: "AI for operations and compliance",
        description: "Agents that handle the routine, every action logged and approved.",
      },
    ],
    image: image("financial-services", "A modern trading floor at the opening of the market"),
    card: relyxusCard(
      "Finds the cause of an incident across your banking estate, and resolves it within the approvals you set.",
    ),
    href: routes.financialServices,
  },
  {
    slug: "insurance",
    name: "Insurance",
    label: "INSURANCE",
    stakes: [{ text: "Where the speed of a claim " }, { text: "is the product.", accent: true }],
    challenge: "Claims and underwriting still wait on manual checks and systems that do not talk to each other.",
    build: [
      {
        title: "Claims automation",
        description: "From first notice to settlement, with people deciding only what needs judgement.",
      },
      {
        title: "Underwriting intelligence",
        description: "Faster risk decisions, each one fully explainable.",
      },
      {
        title: "Broker and customer platforms",
        description: "One clear view of every policy, quote and claim.",
      },
    ],
    image: image("insurance", "A thick claim file waiting on an office desk"),
    card: {
      kicker: "OUR PERSPECTIVE",
      title: "The cost of the problems you’ve learned to live with",
      text: "Every insurer carries losses it no longer notices. Here is how to find them, and what to do about them.",
      button: { label: "Read the perspective", href: routes.costOfProblems },
    },
    href: routes.insurance,
  },
  {
    slug: "telecommunications",
    name: "Telecommunications",
    label: "TELECOMMUNICATIONS",
    stakes: [{ text: "Where every outage " }, { text: "is public.", accent: true }],
    challenge:
      "Networks run under constant load, and customers often notice a failure before the operations team does.",
    build: [
      {
        title: "Network operations intelligence",
        description: "Signals from every layer, correlated into one clear picture.",
      },
      {
        title: "Incident response at scale",
        description: "From alert to cause to fix, with a human approving every action.",
      },
      {
        title: "Customer and billing platforms",
        description: "Accurate, real time, and ready for the next launch.",
      },
    ],
    image: image("telecommunications", "A telecommunications tower against the sky"),
    card: relyxusCard("When the network falters, Relyxus finds why, and fixes it with your team in control."),
    href: routes.telecommunications,
  },
  {
    slug: "energy-and-utilities",
    name: "Energy and Utilities",
    label: "ENERGY AND UTILITIES",
    stakes: [{ text: "Where the lights going out is " }, { text: "never an option.", accent: true }],
    challenge: "The energy transition is adding complexity faster than systems built for a simpler grid can handle.",
    build: [
      {
        title: "Platforms for a flexible grid",
        description: "Software that balances supply and demand as conditions change.",
      },
      {
        title: "Asset and outage intelligence",
        description: "Failures seen coming, and service restored faster.",
      },
      {
        title: "Field operations automation",
        description: "The right crew, the right part, the right place, first time.",
      },
    ],
    image: image("energy-and-utilities", "Wind turbines rising above morning fog"),
    card: invitationCard("energy-and-utilities"),
    href: routes.energyAndUtilities,
  },
  {
    slug: "logistics-and-supply-chain",
    name: "Logistics and Supply Chain",
    label: "LOGISTICS AND SUPPLY CHAIN",
    stakes: [{ text: "Where one missed handoff " }, { text: "stops the chain.", accent: true }],
    challenge:
      "Shipments, partners and warehouses are still connected by spreadsheets, emails and systems never designed to meet.",
    build: [
      {
        title: "End to end visibility",
        description: "Every shipment, every partner, one live picture.",
      },
      {
        title: "Partner and system integration",
        description: "Systems that finally talk to each other, reliably.",
      },
      {
        title: "Exception automation",
        description: "Delays caught and resolved before customers ask.",
      },
    ],
    image: image("logistics-and-supply-chain", "A container ship at sea seen from above"),
    card: invitationCard("logistics-and-supply-chain"),
    href: routes.logistics,
  },
  {
    slug: "retail-and-ecommerce",
    name: "Retail and Ecommerce",
    label: "RETAIL AND ECOMMERCE",
    stakes: [{ text: "Where the checkout " }, { text: "is the revenue.", accent: true }],
    challenge: "Traffic, inventory and payments must hold together at the exact moment customers are ready to buy.",
    build: [
      {
        title: "Commerce built for peak",
        description: "Platforms that stay fast on the busiest day of the year.",
      },
      {
        title: "Order and inventory integration",
        description: "What customers see is what you can actually deliver.",
      },
      {
        title: "AI for demand",
        description: "Forecasts that become the right stock in the right place.",
      },
    ],
    image: image("retail-and-ecommerce", "A phone tapped on a payment terminal at a counter"),
    card: invitationCard("retail-and-ecommerce"),
    href: routes.retailAndEcommerce,
  },
];
