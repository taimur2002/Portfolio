import { profile } from "@/data/portfolio";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/SectionLabel";

export function About() {
  return (
    <section id="about" className="scroll-mt-20">
      <div className="mx-auto max-w-5xl px-5 py-24 sm:px-6 sm:py-28">
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
