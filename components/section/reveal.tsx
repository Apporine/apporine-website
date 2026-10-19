"use client";

import { STAGGER_MS } from "./motion";
import { useInViewOnce } from "./use-in-view-once";

type RevealProps = {
  /** Position among its siblings: each step delays the entrance by 80ms. */
  index?: number;
  as?: "div" | "li";
  className?: string;
  children: React.ReactNode;
};

/**
 * Default entrance (07-homepage-spec.md, "Motion system"): fade in and rise
 * 24px over 700ms once 20% of the block is in view. Reduced motion: a 200ms
 * fade. A CSS transition (.reveal in app/globals.css): the page has dozens
 * of these, and plain transitions keep them off the main thread at load.
 */
export function Reveal({ index = 0, as: Tag = "div", className = "", children }: RevealProps) {
  const [ref, shown] = useInViewOnce<HTMLDivElement & HTMLLIElement>();

  return (
    <Tag
      ref={ref}
      data-shown={shown || undefined}
      style={index ? ({ "--reveal-delay": `${index * STAGGER_MS}ms` } as React.CSSProperties) : undefined}
      className={`reveal ${className}`}
    >
      {children}
    </Tag>
  );
}
