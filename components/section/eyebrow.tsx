import { Falcon } from "@/components/brand-marks";
import type { Tone } from "./tone";

type EyebrowProps = {
  tone: Tone;
  children: string;
  className?: string;
};

/**
 * Section eyebrow: the Falcon (26px wide), then IBM Plex Mono 500, 14px, 0.18em,
 * uppercase. Plum 600 on light surfaces, Lilac Mist on dark (at least 6.6:1 on every surface).
 * The Falcon sits on the first line when a long eyebrow wraps on a phone.
 */
export function Eyebrow({ tone, children, className = "mb-7" }: EyebrowProps) {
  const colour = tone === "light" ? "text-plum-600" : "text-plum-100";
  return (
    <p
      className={`flex items-start gap-3 font-mono text-sm leading-[1.3] font-medium tracking-[0.18em] uppercase ${colour} ${className}`}
    >
      <Falcon width={26} height={12} className="mt-[3px] h-[12px] w-[26px] shrink-0 object-contain" />
      {children}
    </p>
  );
}
