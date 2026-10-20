"use client";

import Link from "next/link";
import type { NavColumn, NavItem, NavLink } from "@/lib/navigation";
import { FeatureCard } from "./feature-card";

type MegaPanelProps = {
  item: NavItem;
  id: string;
  /** This panel is the one shown. */
  active: boolean;
  /** Some panel is open (inactive panels wait in place, faded out). */
  anyOpen: boolean;
  /** Switching from another open panel: quick 140ms cross fade. */
  switching: boolean;
  reducedMotion: boolean;
  onNavigate: () => void;
  ref: React.Ref<HTMLDivElement>;
};

const pearlFocus =
  "focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-orchid-deep";

function ColumnLink({ link, onNavigate }: { link: NavLink; onNavigate: () => void }) {
  const description = link.description && (
    <span className="mt-0.5 block font-sans text-[13.5px] leading-[1.4] text-[#5E4A6E]">
      {link.description}
    </span>
  );

  // Muted: shown but not clickable, announced as an unavailable link.
  if (!link.href) {
    return (
      <span role="link" aria-disabled="true" className="-mx-3 block rounded-xl px-3 py-[11px]">
        <span className="block font-sans text-[15px] leading-[1.35] font-semibold text-plum-400">
          {link.title}
        </span>
        {description}
      </span>
    );
  }

  return (
    <Link
      href={link.href}
      prefetch={false}
      onClick={onNavigate}
      className={`-mx-3 block rounded-xl px-3 py-[11px] transition-colors duration-(--dur-micro) ease-brand hover:bg-plum-100 focus-visible:bg-plum-100 ${pearlFocus}`}
    >
      <span className="block font-sans text-[15px] leading-[1.35] font-semibold text-plum-800">
        {link.title}
      </span>
      {description}
    </Link>
  );
}

function Column({ column, id, onNavigate }: { column: NavColumn; id: string; onNavigate: () => void }) {
  return (
    <div>
      {/* An empty heading keeps the spacing so the columns line up. */}
      <p
        id={column.heading ? id : undefined}
        aria-hidden={column.heading ? undefined : true}
        className="mb-1.5 min-h-[calc(11px*1.3+12px+1px)] border-b border-plum-200 pb-3 font-mono text-[11px] leading-[1.3] font-medium tracking-[0.16em] text-plum-600 uppercase"
      >
        {column.heading}
      </p>
      <ul aria-labelledby={column.heading ? id : undefined}>
        {column.links.map((link) => (
          <li key={link.title}>
            <ColumnLink link={link} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * One mega panel (05-navigation-spec.md section 5): feature card on the left,
 * link columns on the right. Positioned against the capsule, over the shared
 * Pearl background that the header animates.
 */
export function MegaPanel({
  item,
  id,
  active,
  anyOpen,
  switching,
  reducedMotion,
  onNavigate,
  ref,
}: MegaPanelProps) {
  const duration = switching ? "duration-140" : "duration-240 motion-reduce:duration-200";
  return (
    <div
      ref={ref}
      id={id}
      data-nav-panel={item.id}
      data-surface="light"
      role="region"
      aria-label={item.label}
      inert={!active}
      className={`absolute inset-x-0 top-[calc(100%+10px)] z-10 p-3 ease-brand ${duration} ${
        // Shown at once (so Tab can enter it straight away); hidden after its fade.
        active
          ? "visible opacity-100 transition-[opacity,translate]"
          : "invisible opacity-0 transition-[opacity,translate,visibility]"
      } ${anyOpen ? "translate-y-0" : "-translate-y-2.5 motion-reduce:translate-y-0"}`}
    >
      <div className="grid grid-cols-[300px_minmax(0,1fr)] items-start">
        <FeatureCard
          feature={item.feature}
          active={active}
          reducedMotion={reducedMotion}
          onNavigate={onNavigate}
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-7 gap-y-2 px-[18px] pt-3.5 pb-2.5">
          {item.columns.map((column, index) => (
            <Column key={index} column={column} id={`${id}-column-${index}`} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  );
}
