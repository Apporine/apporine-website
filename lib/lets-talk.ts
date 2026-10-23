import { company } from "@/lib/site";
import type { TextSegment } from "@/lib/text";

/*
 * The "Let’s talk" invitation (homepage closing section). Copy is locked,
 * word for word. Inner pages can pass their own content to the component.
 */

export type IntentOption = { label: string; href: string };

export type LetsTalkContent = {
  eyebrow: string;
  /** Plain part, then the Instrument Serif Italic accent. */
  headline: TextSegment[];
  lead: string;
  options: IntentOption[];
  email: string;
};

function mailto(subject: string): string {
  return `mailto:${company.contactEmail}?subject=${encodeURIComponent(subject)}`;
}

/*
 * The contact page has no form yet, so each option opens an email. Once it
 * does, these become /contact?intent=problem, ?intent=product and
 * ?intent=relyxus-demo, with the form preselecting the matching reason.
 */
export const homeLetsTalk: LetsTalkContent = {
  eyebrow: "LET’S TALK",
  headline: [{ text: "The next decade is being built now. " }, { text: "Let’s build yours.", accent: true }],
  lead: "Choose where you’re starting from. Every conversation ends with an honest view of what it would take.",
  options: [
    { label: "Solve a costly problem", href: mailto("Solve a costly problem") },
    { label: "Build a product", href: mailto("Build a product") },
    { label: "See Relyxus live", href: mailto("Relyxus demo request") },
  ],
  email: company.contactEmail,
};
