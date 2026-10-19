import { lightBodyColour, type Tone } from "./tone";

type LeadParagraphProps = {
  tone: Tone;
  children: string;
  className?: string;
};

/** Lead paragraph: Instrument Sans 400, clamp(17px, 1.35vw, 20px), line height 1.6, max width 36rem. */
export function LeadParagraph({ tone, children, className = "max-w-[36rem]" }: LeadParagraphProps) {
  return (
    <p
      className={`font-sans text-[clamp(17px,1.35vw,20px)] leading-[1.6] ${
        tone === "dark" ? "text-plum-300" : lightBodyColour
      } ${className}`}
    >
      {children}
    </p>
  );
}
