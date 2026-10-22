/* The "What we build" row icons: 20px strokes in Orchid Deep (its 44px tile sets the colour). */

const stroke = {
  "aria-hidden": true,
  viewBox: "0 0 24 24",
  className: "size-5",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Row 1: a shield with a tick. */
function ShieldIcon() {
  return (
    <svg {...stroke}>
      <path d="M12 3l7 2.8v5.4c0 4.4-2.9 8.3-7 9.8-4.1-1.5-7-5.4-7-9.8V5.8z" />
      <path d="M8.8 12.2l2.2 2.2 4.4-4.6" />
    </svg>
  );
}

/** Row 2: stacked layers. */
function LayersIcon() {
  return (
    <svg {...stroke}>
      <path d="M12 3.5l8.5 4.5-8.5 4.5L3.5 8z" />
      <path d="M3.5 12l8.5 4.5 8.5-4.5" />
      <path d="M3.5 16l8.5 4.5 8.5-4.5" />
    </svg>
  );
}

/** Row 3: a spark. */
function SparkIcon() {
  return (
    <svg {...stroke}>
      <path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z" />
      <path d="M18.5 15.5c.2 1.6.9 2.3 2.5 2.5-1.6.2-2.3.9-2.5 2.5-.2-1.6-.9-2.3-2.5-2.5 1.6-.2 2.3-.9 2.5-2.5z" />
    </svg>
  );
}

export const capabilityIcons = [ShieldIcon, LayersIcon, SparkIcon] as const;
