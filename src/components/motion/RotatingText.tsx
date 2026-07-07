"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Cycles through `items` with a vertical flip. Static (first item only) under
 * prefers-reduced-motion. Uses inline-grid so entering/exiting words stack in
 * one cell and the box sizes to the current word.
 */
export function RotatingText({
  items,
  interval = 2200,
  className = "",
}: {
  items: string[];
  interval?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || items.length <= 1) return;
    const id = setInterval(
      () => setIndex((v) => (v + 1) % items.length),
      interval,
    );
    return () => clearInterval(id);
  }, [reduce, items.length, interval]);

  if (reduce) return <span className={className}>{items[0]}</span>;

  return (
    <span
      className={`relative inline-grid overflow-hidden align-bottom ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={items[index]}
          initial={{ y: "115%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-115%" }}
          transition={{ duration: 0.45, ease: EASE }}
          className="whitespace-nowrap [grid-area:1/1]"
        >
          {items[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
