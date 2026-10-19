/*
 * Custom monoline icons for section 7 (07-homepage-spec.md): 48px, 1.5px
 * stroke, geometric. Every shape has pathLength 1 so the hover can draw the
 * strokes in again (.capability-icon in app/globals.css).
 */

export type CapabilityIcon = "platforms" | "agents" | "apps" | "cloud" | "data";

const shapes: Record<CapabilityIcon, React.ReactNode> = {
  // Three stacked rounded layers.
  platforms: (
    <>
      <rect x="8" y="10" width="32" height="8" rx="3" pathLength={1} />
      <rect x="8" y="20" width="32" height="8" rx="3" pathLength={1} />
      <rect x="8" y="30" width="32" height="8" rx="3" pathLength={1} />
    </>
  ),
  // A node with three connected smaller nodes.
  agents: (
    <>
      <circle cx="24" cy="26" r="6" pathLength={1} />
      <circle cx="24" cy="8" r="3" pathLength={1} />
      <circle cx="9" cy="38" r="3" pathLength={1} />
      <circle cx="39" cy="38" r="3" pathLength={1} />
      <path d="M24 11v9M11.6 36.5l7.3-5.5M36.4 36.5l-7.3-5.5" pathLength={1} />
    </>
  ),
  // A laptop outline with a phone overlapping.
  apps: (
    <>
      <path d="M30 32H10V14a2 2 0 0 1 2-2h22a2 2 0 0 1 2 2v6" pathLength={1} />
      <path d="M5 36h25" pathLength={1} />
      <rect x="32" y="22" width="11" height="18" rx="2.5" pathLength={1} />
      <path d="M36.5 36.5h2" pathLength={1} />
    </>
  ),
  // A cloud outline over a looping arrow.
  cloud: (
    <>
      <path d="M15 26a7 7 0 0 1-.6-14A9 9 0 0 1 31.6 10 6.5 6.5 0 0 1 34 26z" pathLength={1} />
      <path d="M17 37a7 4 0 1 0 7-4" pathLength={1} />
      <path d="m21 30.5 3 2.5-3 2.5" pathLength={1} />
    </>
  ),
  // Two circles joined by a line, a small diamond in the middle.
  data: (
    <>
      <circle cx="10" cy="24" r="5" pathLength={1} />
      <circle cx="38" cy="24" r="5" pathLength={1} />
      <path d="M15 24h5.5M27.5 24H33" pathLength={1} />
      <path d="m24 20.5 3.5 3.5-3.5 3.5-3.5-3.5z" pathLength={1} />
    </>
  ),
};

export function CapabilityIconSvg({ icon }: { icon: CapabilityIcon }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width="48"
      height="48"
      fill="none"
      stroke="var(--plum-800)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="capability-icon"
    >
      {shapes[icon]}
    </svg>
  );
}
