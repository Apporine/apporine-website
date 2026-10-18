/** Hero slide content. Copy is locked: see _brief/docs/03-content.md. */

import { anchors, routes } from "@/lib/routes";
import type { TextSegment } from "@/lib/text";


export type SlideLink = {
  label: string;
  href: string;
};

/** Readability scrim over the video (spec section 3). */
export type SlideScrim = {
  /** 768px and up: start to end gradient behind the text. */
  desktop: string;
  /** Under 768px: even overlay colour, layered under the top and bottom fades. */
  mobileOverlay: string;
};

const SOFT_SCRIM =
  "linear-gradient(90deg, rgba(18,4,26,0.80) 0%, rgba(18,4,26,0.65) 45%, rgba(18,4,26,0.30) 60%, rgba(18,4,26,0) 72%)";
const STRONG_SCRIM =
  "linear-gradient(90deg, rgba(18,4,26,0.88) 0%, rgba(18,4,26,0.74) 45%, rgba(18,4,26,0.42) 60%, rgba(18,4,26,0) 78%)";

export type SlideContent = {
  id: string;
  eyebrow: string;
  headline: TextSegment[];
  subheadline?: TextSegment[];
  paragraph: string;
  primary: SlideLink;
  secondary: SlideLink;
  /** Base file name in /public/videos, e.g. "hero-01-monolith". */
  video: string;
  scrim: SlideScrim;
};

/** Media files for one viewport class. `null` means the file is not present. */
export type Rendition = {
  webm: string | null;
  mp4: string | null;
  poster: string | null;
};

export type SlideMedia = {
  desktop: Rendition;
  /** Viewports under 768px. Falls back to desktop files when absent. */
  mobile: Rendition;
};

export type Slide = SlideContent & { media: SlideMedia };

export const slides: SlideContent[] = [
  {
    id: "vision",
    eyebrow: "APPORINE",
    headline: [
      { text: "Building what tomorrow’s enterprises will " },
      { text: "run on.", accent: true },
    ],
    paragraph:
      "We help enterprises move from software they manage to intelligence they can rely on. Apporine builds the products that turn noise into decisions, risk into resilience and ambition into advantage, in every industry we serve.",
    primary: { label: "Discover Apporine", href: routes.company },
    secondary: { label: "The pristine standard", href: anchors.pristine },
    video: "hero-01-monolith",
    scrim: { desktop: SOFT_SCRIM, mobileOverlay: "rgba(18,4,26,0.45)" },
  },
  {
    id: "products",
    eyebrow: "OUR PRODUCTS",
    headline: [
      { text: "Enterprise products, engineered " },
      { text: "pristine.", accent: true },
    ],
    paragraph:
      "We don’t ship features. We ship standards. Every Apporine product is pristine: clear in design, correct under pressure and built for the long run. Relyxus, our first, turns alerts into answers and downtime into recovery.",
    primary: { label: "Meet Relyxus", href: routes.relyxus },
    secondary: { label: "Explore our products", href: routes.products },
    video: "hero-02-armillary",
    scrim: { desktop: STRONG_SCRIM, mobileOverlay: "rgba(18,4,26,0.45)" },
  },
  {
    id: "partnership",
    eyebrow: "BUILD WITH APPORINE",
    headline: [
      { text: "The next era won’t build " },
      { text: "itself.", accent: true },
    ],
    subheadline: [
      { text: "Built with Apporine. Ahead of " },
      { text: "tomorrow.", accent: true },
    ],
    paragraph:
      "The leaders of the next decade won’t buy their advantage. They’ll build it. Apporine partners with ambitious enterprises to imagine, engineer and scale the products that will define their markets.",
    primary: { label: "Start building", href: routes.build },
    secondary: { label: "How we partner", href: anchors.howWePartner },
    video: "hero-03-bridge",
    // The wireframe bridge is very bright on mobile: stronger even overlay.
    scrim: { desktop: STRONG_SCRIM, mobileOverlay: "rgba(18,4,26,0.6)" },
  },
];
