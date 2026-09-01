"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useRef } from "react";

/**
 * Wraps children so they lean toward the cursor while hovered, springing back
 * on leave. No-op under prefers-reduced-motion (and harmless on touch, where
 * mousemove never fires).
 */
export function Magnetic({
  children,
  strength = 0.3,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  if (reduce) return <span className={`inline-block ${className}`}>{children}</span>;

  // Measure once on enter, not per mousemove. getBoundingClientRect() flushes
  // layout synchronously, and doing that at pointer-event rate meant a forced
  // reflow every few milliseconds while the cursor sat on a hero CTA — right
  // where the animated blurred orbs make each flush most expensive.
  //
  // It also fixes the offset: measuring mid-hover read the element's *already
  // translated* box, so the magnet chased its own output and settled at ~0.23
  // strength instead of the 0.3 asked for. The resting box gives the real pull.
  const onEnter = () => {
    rect.current = ref.current?.getBoundingClientRect() ?? null;
  };
  const onMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const r = rect.current;
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    rect.current = null;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.span>
  );
}
