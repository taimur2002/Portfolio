"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { stats } from "@/data/portfolio";
import { GradientText } from "@/components/GradientText";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Drive the tween straight into the DOM node's text instead of React state.
  // A per-frame setState would re-render this component ~84 times (1.4s * 60fps)
  // for every stat, right as the user scrolls through this section — enough to
  // drop frames on slower devices. Writing textContent keeps the identical
  // count-up with zero re-renders.
  useEffect(() => {
    if (!inView) return;
    const node = ref.current;
    if (!node) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix]);

  // SSR / pre-animation state matches the tween's start value (0), so nothing
  // pops when the animation takes over.
  return <span ref={ref}>{`0${suffix}`}</span>;
}

export function Stats() {
  return (
    <section aria-label="By the numbers" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        {/* `gap-px` + a background on the grid is what draws the hairlines, so
            the container colour IS the border colour. */}
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-sm sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center bg-surface px-4 py-10 text-center"
            >
              <span className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                <GradientText>
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </GradientText>
              </span>
              <span className="mt-2 text-sm font-medium text-zinc-400">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
