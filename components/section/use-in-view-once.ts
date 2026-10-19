"use client";

import { useEffect, useRef, useState } from "react";

/** Entrances start once 20% of the block is in view (07-homepage-spec.md, "Motion system"). */
const THRESHOLD = 0.2;

// One observer for every entrance on the page: cheaper than one per block.
const callbacks = new Map<Element, () => void>();
let observer: IntersectionObserver | null = null;

function sharedObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        callbacks.get(entry.target)?.();
        callbacks.delete(entry.target);
        observer?.unobserve(entry.target);
      }
    },
    { threshold: THRESHOLD },
  );
  return observer;
}

/** True once 20% of the element has been in view; it stays true. */
export function useInViewOnce<T extends Element>(): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    callbacks.set(element, () => setInView(true));
    sharedObserver().observe(element);
    return () => {
      callbacks.delete(element);
      observer?.unobserve(element);
    };
  }, []);

  return [ref, inView];
}
