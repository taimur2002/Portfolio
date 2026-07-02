"use client";

import { ReactLenis } from "lenis/react";

/**
 * Global Lenis smooth-scroll. `root` attaches Lenis to the window so the whole
 * page scrolls smoothly. `anchors` makes in-page links (#about, #experience, …)
 * animate to their target. The offset accounts for the sticky navbar so the
 * target section's heading lands just below it (sections have their own top
 * padding, so a small offset is enough).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        anchors: { offset: -24 },
      }}
    >
      {children}
    </ReactLenis>
  );
}
