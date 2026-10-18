/** Hero slide content. Copy is locked: see _brief/docs/03-content.md. */

/** A run of text; `accent` runs render in Instrument Serif Italic, citrine. */
export type TextSegment = {
  text: string;
  accent?: boolean;
};

export type SlideLink = {
  label: string;
  href: string;
};

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
    primary: { label: "Discover Apporine", href: "/company" },
    secondary: { label: "The pristine standard", href: "/company#pristine" },
    video: "hero-01-monolith",
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
    primary: { label: "Meet Relyxus", href: "/products/relyxus" },
    secondary: { label: "Explore our products", href: "/products" },
    video: "hero-02-armillary",
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
    primary: { label: "Start building", href: "/build" },
    secondary: { label: "How we partner", href: "/build#how-we-partner" },
    video: "hero-03-bridge",
  },
];

export function plainText(segments: TextSegment[]): string {
  return segments.map((segment) => segment.text).join("");
}
