import { routes, type RoutePath } from "@/lib/routes";
import type { TextSegment } from "@/lib/text";

/*
 * "Latest from Apporine" (the Living Mosaic) and the story page behind each
 * card. Copy is locked: _brief/docs/09-latest-section-spec.md, sections 1 and 2.
 * Each story page renders from its entry here, so a page can later grow full
 * content without changing the template.
 */

export type LatestStory = {
  /** Shown uppercase; read as written in the card's accessible name. */
  category: string;
  heading: string;
  description: string;
  href: RoutePath;
  /** Base name in /public/videos (webm, mp4 and -poster.webp). */
  film: string;
  /** CSS object-position of the poster and the film. */
  focalPoint: string;
};

export const latestSection: {
  eyebrow: string;
  headline: TextSegment[];
  allLink: { label: string; href: RoutePath };
  readMore: string;
} = {
  eyebrow: "LATEST FROM APPORINE",
  headline: [{ text: "What we’re building " }, { text: "now.", accent: true }],
  allLink: { label: "All news and insights", href: routes.insights },
  readMore: "Read more",
};

export const latestStories: LatestStory[] = [
  {
    category: "Announcement",
    heading: "Introducing Relyxus",
    description:
      "AI incident response that finds the cause and resolves the incident within the approvals you set.",
    href: routes.relyxus,
    film: "latest/latest-01-relyxus",
    focalPoint: "65% 50%",
  },
  {
    category: "In development",
    heading: "Orion is taking shape",
    description: "Our next product, engineered to the same pristine standard.",
    href: routes.orion,
    film: "latest/latest-02-orion",
    focalPoint: "55% 35%",
  },
  {
    category: "Perspective",
    heading: "The cost of the problems you’ve learned to live with",
    description:
      "Every enterprise carries losses it no longer notices. Here is how to find them, and what to do about them.",
    href: routes.costOfProblems,
    film: "latest/latest-03-perspective",
    focalPoint: "50% 50%",
  },
  {
    category: "Trust",
    heading: "Built to be examined",
    description: "Our security principles, controls and assurance roadmap, open to your scrutiny.",
    href: routes.trust,
    film: "latest/latest-04-trust",
    focalPoint: "45% 50%",
  },
  {
    category: "Careers",
    heading: "Build what tomorrow runs on",
    description: "Join the team engineering products for the world’s most demanding industries.",
    href: routes.careers,
    film: "latest/latest-05-careers",
    focalPoint: "50% 55%",
  },
];

/** The story behind a destination; every story page has exactly one. */
export function storyFor(path: RoutePath): LatestStory {
  const story = latestStories.find((entry) => entry.href === path);
  if (!story) throw new Error(`No story for ${path}`);
  return story;
}
