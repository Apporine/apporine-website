import Link from "next/link";

type ButtonLinkProps = {
  href: string;
  children: string;
  variant: "primary" | "secondary";
  size?: "default" | "small";
  className?: string;
  onClick?: () => void;
};

const base =
  "group inline-flex shrink-0 items-center justify-center gap-2 rounded-pill font-sans font-semibold tracking-[0.01em] whitespace-nowrap " +
  "transition-[background-color,border-color,scale] duration-(--dur-micro) ease-brand active:scale-[0.98] " +
  "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-citrine";

const variants = {
  primary: "bg-citrine text-plum-800 hover:bg-citrine-hover active:bg-citrine-pressed",
  secondary: "border border-plum-600 text-plum-50 hover:border-plum-300",
};

const sizes = {
  default: "h-[52px] px-7 text-[15px]",
  small: "h-10 px-5 text-sm",
};

/**
 * Pill shaped link styled as a button (spec section 5).
 * Primary buttons carry a trailing arrow that slides 4px on hover.
 */
export function ButtonLink({
  href,
  children,
  variant,
  size = "default",
  className = "",
  onClick,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      // Target pages arrive in later phases; avoid prefetching routes that 404.
      prefetch={false}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-[180ms] ease-brand group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
        >
          →
        </span>
      )}
    </Link>
  );
}
