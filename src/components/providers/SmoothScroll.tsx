"use client";

import { useEffect } from "react";

/** Sticky header height (Header uses h-16 = 4rem = 64px). */
const HEADER_OFFSET = 64;

/**
 * In-page anchor navigation, on the browser's own smooth scrolling.
 *
 * This deliberately does NOT wrap the page in Lenis, and that decision has been
 * tested the hard way. Lenis re-animates the scroll position in JS every frame,
 * so the viewport is always chasing the wheel rather than tracking it. Measured
 * settle time for one wheel tick (wheel fires -> viewport stops moving):
 *
 *   lerp 0.08 + wheelMultiplier 0.5   985ms
 *   lerp 0.12                         650ms
 *   lerp 0.20                         392ms
 *   lerp 0.30                         266ms
 *   lerp 0.50                         155ms
 *   native wheel scrolling             31ms   <- here
 *
 * Every one of those configurations renders a clean 60fps, so no profiler ever
 * showed a problem — the cost is input latency, not dropped frames. In practice
 * every Lenis value still read as lag, and native did not. Two likely reasons
 * beyond the raw number: Lenis replaces the OS's own trackpad inertia with a
 * linear interpolation, and its per-frame lerp is frame-rate dependent, so it
 * behaves differently on a high-refresh display.
 *
 * If smooth scrolling is ever wanted back, this is the only file to change —
 * but the latency above is inherent to the approach, not a tuning problem.
 *
 * The one part worth keeping is the glide when clicking a nav link, which
 * `scrollTo({ behavior: "smooth" })` does natively. Handling the click here
 * (rather than letting the browser jump to the hash) is what keeps the landing
 * offset for the sticky header and honours `data-anchor-shift`.
 */
function AnchorNav() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      // Let the browser handle open-in-new-tab / open-in-new-window itself.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

      const link = (event.target as HTMLElement)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!link) return;

      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      const el = document.querySelector(hash);
      if (!el) return;

      event.preventDefault();
      // Optional per-section nudge: `data-anchor-shift="40"` lands the section
      // 40px higher (useful for tall sections so more content shows on arrival).
      const shift = Number(el.getAttribute("data-anchor-shift")) || 0;
      const top = Math.max(
        0,
        window.scrollY + el.getBoundingClientRect().top - HEADER_OFFSET + shift,
      );

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
      // Keep the URL in step with the section, the way a real hash jump would.
      history.pushState(null, "", hash);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

/**
 * Kept as a provider (rather than folded into the layout) so anchor handling
 * stays in one place and the layout needs no client boundary of its own.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnchorNav />
      {children}
    </>
  );
}
