"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { useFinePointer, useReducedMotion } from "@/components/section/motion";

/** Maximum tilt on each axis, in degrees. */
const MAX_TILT_DEG = 6;
const SPRING = { stiffness: 150, damping: 20, mass: 0.6 };

/**
 * Glass frame for the product visual (07-homepage-spec.md, section 5). On
 * fine pointers it tilts toward the cursor (6° at most, perspective 1200px)
 * with a soft highlight that follows it, and eases back on leave. No tilt
 * for touch or reduced motion.
 */
export function TiltFrame({ children }: { children: React.ReactNode }) {
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const tiltEnabled = finePointer && !reducedMotion;

  // Pointer position across the frame, 0 to 1 on each axis; 0.5 is centred.
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const x = useSpring(pointerX, SPRING);
  const y = useSpring(pointerY, SPRING);
  const rotateY = useTransform(x, [0, 1], [-MAX_TILT_DEG, MAX_TILT_DEG]);
  const rotateX = useTransform(y, [0, 1], [MAX_TILT_DEG, -MAX_TILT_DEG]);
  const highlightX = useTransform(x, (value) => `${value * 100}%`);
  const highlightY = useTransform(y, (value) => `${value * 100}%`);
  const highlight = useMotionTemplate`radial-gradient(circle at ${highlightX} ${highlightY}, rgba(251,249,252,0.1), rgba(251,249,252,0) 45%)`;
  const highlightOpacity = useSpring(0, SPRING);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!tiltEnabled || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - box.left) / box.width);
    pointerY.set((event.clientY - box.top) / box.height);
    highlightOpacity.set(1);
  }

  function onPointerLeave() {
    pointerX.set(0.5);
    pointerY.set(0.5);
    highlightOpacity.set(0);
  }

  return (
    <div className="perspective-[1200px]" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <motion.div
        style={tiltEnabled ? { rotateX, rotateY } : undefined}
        className="relative overflow-hidden rounded-[24px] border border-[rgba(201,179,222,0.25)] bg-[rgba(46,10,58,0.5)] p-3.5 backdrop-blur-md"
      >
        {children}
        {tiltEnabled && (
          <motion.div
            aria-hidden="true"
            style={{ backgroundImage: highlight, opacity: highlightOpacity }}
            className="pointer-events-none absolute inset-0"
          />
        )}
      </motion.div>
    </div>
  );
}
