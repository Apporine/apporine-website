"use client";

import { useParallax } from "@/lib/use-parallax";

/**
 * Wraps media (never text) in a layer that moves at 0.92 of the scroll
 * speed (lib/use-parallax.ts). Its parent is the frame that clips it.
 */
export function ParallaxLayer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useParallax<HTMLDivElement>();
  return (
    <div ref={ref} className={`absolute inset-0 ${className}`}>
      {children}
    </div>
  );
}
