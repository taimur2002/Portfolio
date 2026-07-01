import { education } from "@/data/portfolio";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/SectionLabel";

export function Education() {
  return (
    <section id="education" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
        <Reveal>
          <SectionLabel>Education</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mb-12 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Education
          </h2>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2">
          {education.map((item, i) => (
            <Reveal key={item.school} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-zinc-200 bg-white p-6 transition-colors hover:border-accent">
                <p className="text-sm font-semibold text-accent">{item.period}</p>
                <h3 className="mt-2 font-display text-lg font-semibold tracking-tight">
                  {item.school}
                </h3>
                <p className="mt-1 text-zinc-600">{item.degree}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
