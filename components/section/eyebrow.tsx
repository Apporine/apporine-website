import { Falcon } from "@/components/brand-marks";
import type { Tone } from "./tone";

type EyebrowProps = {
  tone: Tone;
  children: string;
  className?: string;
};

/** Section eyebrow: the Falcon (22px wide), then IBM Plex Mono 500, 12px, 0.18em, uppercase. */
export function Eyebrow({ tone, children, className = "mb-7" }: EyebrowProps) {
  return (
    <p
      className={`flex items-center gap-2.5 font-mono text-xs leading-[1.3] font-medium tracking-[0.18em] uppercase ${
        tone === "dark" ? "text-plum-300" : "text-plum-600"
      } ${className}`}
    >
      <Falcon width={22} height={10} className="h-[10px] w-[22px] shrink-0 object-contain" />
      {children}
    </p>
  );
}
