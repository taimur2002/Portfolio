"use client";

import { useEffect, useRef } from "react";

/**
 * Pauses the CSS animations inside it while it is scrolled out of view.
 *
 * A CSS animation keeps ticking when its element is nowhere near the viewport,
 * so the hero's blurred orbs and the tech marquee would otherwise hand the
 * compositor work on every frame for the entire session, no matter where the
 * reader actually is on the page. (`FooterScene` already gates its render loop
 * this way; this is the same rule applied to the declarative animations.)
 *
 * The observer writes `data-offscreen` straight onto the node rather than going
 * through state, so toggling it costs no React render. globals.css turns the
 * attribute into `animation-play-state: paused` for descendants. Pausing keeps
 * each animation's current position, so the marquee resumes exactly where it
 * left off instead of snapping back to the start.
 *
 * It renders in the unpaused state to match SSR, and `rootMargin` restarts
 * things slightly before they scroll back into view.
 */
export function OffscreenPause({
  children,
  ...rest
}: React.ComponentPropsWithoutRef<"div">) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        el.dataset.offscreen = entry.isIntersecting ? "false" : "true";
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} {...rest}>
      {children}
    </div>
  );
}
