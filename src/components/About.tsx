import { profile } from "@/data/portfolio";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/SectionLabel";

export function About() {
  return (
    <section id="about" className="relative overflow-hidden scroll-mt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-28 top-1/4 h-80 w-80 rounded-full bg-accent opacity-[0.07] blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <Reveal>
          <SectionLabel>About</SectionLabel>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.6fr] md:gap-12">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              A bit about me
            </h2>
          </Reveal>
          <div className="space-y-5 text-lg leading-relaxed text-zinc-600 sm:text-xl">
            {profile.about.map((paragraph, i) => (
              <Reveal key={i} delay={0.08 * (i + 1)}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
