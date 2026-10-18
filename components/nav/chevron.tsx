type ChevronProps = {
  open: boolean;
  className?: string;
};

/** Down chevron that turns 180° while its panel is open. */
export function Chevron({ open, className = "size-2.5" }: ChevronProps) {
  return (
    <svg
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 transition-transform duration-200 ease-brand ${open ? "rotate-180" : ""} ${className}`}
    >
      <path d="M1.5 3.5 5 7l3.5-3.5" />
    </svg>
  );
}
