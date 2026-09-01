"use client";

import { useEffect, useRef } from "react";

type RevealProps = React.ComponentPropsWithoutRef<"div"> & {
  /** Stagger offset in seconds. */
  delay?: number;
  /** Direction the element enters from. Defaults to "bottom" (fade-up). */
  from?: "bottom" | "left" | "right";
};

/**
 * Fades + slides its children in once they scroll into view.
 *
 * The animation itself lives in CSS (see `[data-reveal]` in globals.css) rather
 * than in Framer Motion. Framer animates by writing inline styles from JS on
 * every frame, and with 18 of these on the page several fire at once during a
 * fast scroll — measured at 12 dropped frames per full-page pass, against 1-5
 * once those inline writes were gone. A CSS transition on opacity/transform is
 * handed to the compositor and costs no main-thread work per frame.
 *
 * The observer sets the attribute straight on the node instead of going through
 * state, so revealing costs no React render either, and disconnects after
 * firing (these only ever play once).
 */
export function Reveal({
  delay = 0,
  from = "bottom",
  children,
  style,
  ...props
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.setAttribute("data-shown", "");
        io.disconnect();
      },
      // Matches the old Framer `viewport={{ margin: "-80px" }}`: the element has
      // to be 80px inside the viewport before it counts as arrived.
      { rootMargin: "-80px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={from}
      style={{ ...style, "--reveal-delay": `${delay}s` } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
}
