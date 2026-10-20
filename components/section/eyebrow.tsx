import { Falcon } from "@/components/brand-marks";
import type { Tone } from "./tone";

type EyebrowProps = {
  tone: Tone;
  children: string;
  /** Over a film (dark tone): Lilac Mist, for 4.5:1 over bright footage. */
  onFilm?: boolean;
  className?: string;
};

/** Section eyebrow: the Falcon (22px wide), then IBM Plex Mono 500, 12px, 0.18em, uppercase. */
export function Eyebrow({ tone, children, onFilm = false, className = "mb-7" }: EyebrowProps) {
  const colour = tone === "light" ? "text-plum-600" : onFilm ? "text-plum-100" : "text-plum-300";
  return (
    <p
      className={`flex items-center gap-2.5 font-mono text-xs leading-[1.3] font-medium tracking-[0.18em] uppercase ${colour} ${className}`}
    >
      <Falcon width={22} height={10} className="h-[10px] w-[22px] shrink-0 object-contain" />
      {children}
    </p>
  );
}
