/*
 * The Orion constellation as seen in the sky (east to the left). Positions are
 * projected from J2000 right ascension and declination, 30 units per degree;
 * radii follow apparent magnitude (brighter is larger).
 */
type Star = { name: string; x: number; y: number; r: number };

const stars: Star[] = [
  { name: "Betelgeuse", x: 60, y: 60, r: 7 },
  { name: "Bellatrix", x: 286, y: 92, r: 5 },
  { name: "Mintaka", x: 234, y: 291, r: 4.5 },
  { name: "Alnilam", x: 203, y: 318, r: 5 },
  { name: "Alnitak", x: 168, y: 340, r: 5 },
  { name: "Saiph", x: 116, y: 572, r: 4.5 },
  { name: "Rigel", x: 365, y: 528, r: 7.5 },
];

const position = Object.fromEntries(stars.map((star) => [star.name, star]));

/** The traditional figure: shoulders, belt, and the lines to the knees. */
const lines: [string, string][] = [
  ["Betelgeuse", "Bellatrix"],
  ["Betelgeuse", "Alnitak"],
  ["Bellatrix", "Mintaka"],
  ["Mintaka", "Alnilam"],
  ["Alnilam", "Alnitak"],
  ["Alnitak", "Saiph"],
  ["Mintaka", "Rigel"],
];

/**
 * Orion visual, 16:10 (07-homepage-spec.md, section 5): citrine stars with a
 * soft glow, joined by thin lines, twinkling gently (opacity 0.7 to 1,
 * staggered, 3 to 5 seconds; static for reduced motion). Decorative.
 */
export function OrionVisual() {
  return (
    <div aria-hidden="true" className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-[12px] bg-plum-950">
      <svg viewBox="0 0 425 632" className="h-[86%] w-auto overflow-visible" focusable="false">
        <defs>
          <filter id="orion-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g stroke="rgba(245,230,99,0.5)" strokeWidth="1.25">
          {lines.map(([from, to]) => (
            <line key={`${from}-${to}`} x1={position[from].x} y1={position[from].y} x2={position[to].x} y2={position[to].y} />
          ))}
        </g>
        <g fill="var(--citrine)" filter="url(#orion-glow)">
          {stars.map((star, index) => (
            <circle
              key={star.name}
              cx={star.x}
              cy={star.y}
              r={star.r}
              className="orion-star"
              style={{ animationDuration: `${3 + ((index * 0.7) % 2)}s`, animationDelay: `${-index * 0.6}s` }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
