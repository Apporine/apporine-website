import Link from "next/link";
import { focusRing } from "@/components/section/tone";
import type { IndustryCard } from "@/lib/industries";

/** The glass panel at the foot of the industry image: kicker, title, text and a Citrine button. */
export function IndustryGlassCard({ card }: { card: IndustryCard }) {
  return (
    <div className="rounded-[20px] border border-[rgba(245,230,99,0.38)] bg-[rgba(18,4,26,0.58)] p-[22px] backdrop-blur-[16px] lg:p-[18px]">
      <p className="mb-2.5 font-mono text-[13px] leading-[1.3] font-semibold tracking-[0.16em] text-citrine">
        {card.kicker}
      </p>
      <h3 className="mb-2 font-sans text-[21px] leading-[1.25] font-bold text-plum-50 lg:text-[19px]">{card.title}</h3>
      <p className="mb-5 font-sans text-[15px] leading-[1.5] text-[#F3EDF7]">{card.text}</p>
      <Link
        href={card.button.href}
        data-cursor="button"
        className={`inline-flex h-[46px] items-center rounded-full bg-citrine px-6 font-sans text-[15px] font-bold text-plum-800 transition-colors duration-(--dur-micro) ease-brand hover:bg-citrine-hover active:bg-citrine-pressed ${focusRing}`}
      >
        {card.button.label}
      </Link>
    </div>
  );
}
