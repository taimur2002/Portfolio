"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { stats } from "@/data/portfolio";
import { GradientText } from "@/components/GradientText";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {Math.round(value)}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section aria-label="By the numbers" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 shadow-sm sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center bg-white px-4 py-10 text-center"
            >
              <span className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                <GradientText>
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </GradientText>
              </span>
              <span className="mt-2 text-sm font-medium text-zinc-500">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
