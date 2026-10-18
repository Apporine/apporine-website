import Link from "next/link";
import { Falcon, RingO } from "@/components/brand-marks";
import { routes } from "@/lib/routes";

// A P P [O] R I N E; the O is the ring image, not a typed letter.
const BEFORE_O = ["A", "P", "P"];
const AFTER_O = ["R", "I", "N", "E"];

type NavLogoProps = {
  onClick?: () => void;
};

/**
 * The Falcon, linking home. Hover and keyboard focus reveal the wordmark
 * (choreography in globals.css, "Navigation logo"). 36px high from 1280px,
 * 28px below.
 */
export function NavLogo({ onClick }: NavLogoProps) {
  return (
    <Link
      href={routes.home}
      aria-label="Apporine, home"
      onClick={onClick}
      className="nav-logo flex shrink-0 items-center rounded-sm focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-citrine"
    >
      <span className="nav-logo-mark relative block h-7 w-16 xl:h-9 xl:w-[82px]">
        <Falcon width={82} height={36} preload className="size-full object-contain" />
        <span className="nav-logo-sweep" />
      </span>
      <span aria-hidden="true" className="nav-logo-word">
        {BEFORE_O.map((letter, index) => (
          <span key={index} className="nav-logo-letter" style={{ "--letter": index } as React.CSSProperties}>
            {letter}
          </span>
        ))}
        <span className="nav-logo-o" style={{ "--letter": BEFORE_O.length } as React.CSSProperties}>
          <RingO width={23} height={23} className="size-full" />
        </span>
        {AFTER_O.map((letter, index) => (
          <span
            key={index}
            className="nav-logo-letter"
            style={{ "--letter": BEFORE_O.length + 1 + index } as React.CSSProperties}
          >
            {letter}
          </span>
        ))}
      </span>
    </Link>
  );
}
