import { techStack } from "@/data/portfolio";

function Pill({ label }: { label: string }) {
  return (
    <span className="mr-3 flex shrink-0 items-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 shadow-sm">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-linear-to-r from-accent to-accent-2" />
      {label}
    </span>
  );
}

/**
 * One marquee row. The track holds two identical copies of the list and slides
 * by -50%, so it loops seamlessly. Per-pill `mr-3` (not flex gap) keeps the seam
 * spacing identical to the rest, so there's no visible jump.
 */
function Row({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div
      className={`flex w-max animate-marquee hover:[animation-play-state:paused] ${
        reverse ? "[animation-direction:reverse]" : ""
      }`}
    >
      {doubled.map((tech, i) => (
        <Pill key={`${tech}-${i}`} label={tech} />
      ))}
    </div>
  );
}

export function TechMarquee() {
  // Offset the second row so the two lines don't read as identical.
  const half = Math.ceil(techStack.length / 2);
  const rowB = [...techStack.slice(half), ...techStack.slice(0, half)];

  return (
    <section
      aria-label="Tools and technologies"
      className="border-y border-zinc-200/60 bg-linear-to-r from-[#e8f0ff] via-[#f1f6fd] to-[#e6f8fd] py-12 sm:py-14"
    >
      <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
        Tools &amp; tech I work with
      </p>
      <div className="relative flex flex-col gap-3 overflow-hidden py-2 mask-[linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
        <Row items={techStack} />
        <Row items={rowB} reverse />
      </div>
    </section>
  );
}
