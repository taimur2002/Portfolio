"use client";

import { ReactLenis } from "lenis/react";

/**
 * Global Lenis smooth-scroll. `root` attaches Lenis to the window so the whole
 * page scrolls smoothly. `anchors` makes in-page links (#about, #projects, …)
 * animate to their target, offset to clear the sticky header.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        anchors: { offset: -80 },
      }}
    >
      {children}
    </ReactLenis>
  );
}
