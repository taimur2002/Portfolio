"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = HTMLMotionProps<"div"> & {
  /** Stagger offset in seconds. */
  delay?: number;
  /** Direction the element enters from. Defaults to "bottom" (fade-up). */
  from?: "bottom" | "left" | "right";
};

/**
 * Fades + slides its children in once they scroll into view.
 * Respects reduced-motion automatically via Framer Motion.
 */
export function Reveal({
  delay = 0,
  from = "bottom",
  children,
  ...props
}: RevealProps) {
  const initial =
    from === "left"
      ? { opacity: 0, x: -60 }
      : from === "right"
        ? { opacity: 0, x: 60 }
        : { opacity: 0, y: 26 };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
