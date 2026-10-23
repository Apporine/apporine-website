/**
 * Editable values used across the homepage and footer (07-homepage-spec.md,
 * "Content configuration"). Copy is locked: see _brief/docs/08-homepage-content.md.
 * Anything left empty is not rendered.
 */

export const company = {
  /** For example "Apporine Ltd". */
  legalName: "",
  registrationNumber: "",
  registeredOffice: "",
  /** For example "England and Wales". */
  placeOfRegistration: "",
  contactEmail: "contact@apporine.com",
};

/**
 * Footer sentence, only when every part is filled:
 * "Apporine [Ltd] is registered in [England and Wales], company number [number]. Registered office: [address]."
 */
export function companyDetailsSentence(): string | null {
  const { legalName, placeOfRegistration, registrationNumber, registeredOffice } = company;
  if (!legalName || !placeOfRegistration || !registrationNumber || !registeredOffice) return null;
  return `${legalName} is registered in ${placeOfRegistration}, company number ${registrationNumber}. Registered office: ${registeredOffice}.`;
}

export type AssuranceStatus = "In place" | "In progress" | "Planned";

export type AssuranceItem = {
  item: string;
  meaning: string;
  /** Set truthfully on launch day (founder confirmation item 2). */
  status: AssuranceStatus;
};

/** Section 9, the assurance roadmap. */
export const assurance: AssuranceItem[] = [
  {
    item: "Security policy framework",
    meaning: "Written policies for security, data, incidents and access",
    status: "In progress",
  },
  {
    item: "CSA STAR Level 1",
    meaning: "Our security controls published in the Cloud Security Alliance registry",
    status: "Planned",
  },
  { item: "Cyber Essentials", meaning: "UK government backed certification", status: "Planned" },
  { item: "Independent penetration testing", meaning: "Our products tested by a third party", status: "Planned" },
  { item: "ISO/IEC 27001", meaning: "The international standard for information security", status: "Planned" },
  { item: "SOC 2 Type II", meaning: "Independent audit of our controls over time", status: "Planned" },
];

export type Person = {
  /** A person without a name is not shown. */
  name: string;
  role: string;
  bio: string;
  linkedIn: string;
  /** A real photograph in /public/people/, e.g. "/people/bisma-idrees.jpg". Empty: monogram tile. */
  photo: string;
};

/** Section 10. Room for up to four cards. */
export const people: Person[] = [
  {
    name: "Bisma Idrees",
    role: "FOUNDER",
    bio: "A DevOps and AIOps engineer who has built production platforms and the automation that keeps them running.",
    linkedIn: "",
    photo: "",
  },
  { name: "", role: "CO FOUNDER AND CTO", bio: "", linkedIn: "", photo: "" },
];

export const founderQuote = {
  text: "“I know what the first hour of an outage feels like. Apporine exists so the systems the world depends on are built pristine.”",
  attribution: "BISMA IDREES, FOUNDER",
};

export type Article = {
  title: string;
  category: string;
  /** For example "6 min read". */
  readingTime: string;
  href: string;
  /** Cover image (16:10) in /public. */
  cover: string;
  coverAlt: string;
};

/** Published articles. Section 11 appears only once there are at least three. */
export const insights: Article[] = [];

export const social = {
  linkedIn: "",
};
