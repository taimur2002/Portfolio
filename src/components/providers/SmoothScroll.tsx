"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";

/** Sticky header height (Header uses h-16 = 4rem = 64px). */
const HEADER_OFFSET = 64;

/**
 * Deterministic in-page anchor navigation.
 *
 * Lenis's built-in `anchors` option was landing sections in the wrong spot
 * (it reads its own smoothed `animatedScroll`, which can desync, and it does
 * not preventDefault — so the browser's native hash-jump races the animation).
 * Instead we handle every `#hash` link ourselves: compute the target from the
 * live DOM (`window.scrollY + rect.top`), subtract the header height, and drive
 * a single Lenis scroll to that absolute position. preventDefault kills the
 * native race, so the landing is exact and repeatable.
 */
function AnchorNav() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
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
      const top =
        window.scrollY +
        el.getBoundingClientRect().top -
        HEADER_OFFSET +
        shift;
      lenis.scrollTo(Math.max(0, top), { duration: 1 });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);

  return null;
}

/**
 * Global Lenis smooth-scroll. `root` attaches Lenis to the window so the whole
 * page scrolls smoothly. Anchor handling is delegated to <AnchorNav> above
 * (Lenis's own `anchors` is disabled), so section landings are pixel-exact.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        // Two separate feels, tuned independently:
        //   lerp            how fast the view catches its target (lower = longer glide)
        //   wheelMultiplier how far one wheel tick travels (lower = slower scroll)
        lerp: 0.08,
        wheelMultiplier: 0.5,
        smoothWheel: true,
        anchors: false,
      }}
    >
      <AnchorNav />
      {children}
    </ReactLenis>
  );
}
