type GateMarkProps = {
  size: number;
  className?: string;
};

/** Apporine gate mark (source: _brief/assets/brand/gate-mark.svg). Decorative. */
export function GateMark({ size, className }: GateMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 14"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M1 13 L7 1 L13 13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="miter"
      />
      <path d="M4.2 8.6 H6.2 M7.8 8.6 H9.8" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
