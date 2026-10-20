import { lightBodyColour, type Tone } from "./tone";

type LeadParagraphProps = {
  tone: Tone;
  children: string;
  /** Over a film (dark tone): Lilac Mist, for 4.5:1 over bright footage. */
  onFilm?: boolean;
  className?: string;
};

/** Lead paragraph: Instrument Sans 400, clamp(17px, 1.35vw, 20px), line height 1.6, max width 36rem. */
export function LeadParagraph({ tone, children, onFilm = false, className = "max-w-[36rem]" }: LeadParagraphProps) {
  const colour = tone === "light" ? lightBodyColour : onFilm ? "text-plum-100" : "text-plum-300";
  return (
    <p
      className={`font-sans text-[clamp(17px,1.35vw,20px)] leading-[1.6] ${colour} ${className}`}
    >
      {children}
    </p>
  );
}
