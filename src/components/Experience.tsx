import { experience } from "@/data/portfolio";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/SectionLabel";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-28">
        <Reveal>
          <SectionLabel>Experience</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mb-12 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Where I&apos;ve worked
          </h2>
        </Reveal>

        <div>
          {experience.map((item, i) => {
            const last = i === experience.length - 1;
            return (
              <Reveal key={`${item.company}-${i}`} delay={i * 0.08}>
                <div className="flex gap-5">
                  {/* Marker + connector line */}
                  <div className="flex flex-col items-center pt-1.5">
                    <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-accent ring-4 ring-[#f2faf6]" />
                    {!last && <span className="mt-2 w-px flex-1 bg-zinc-200" />}
                  </div>
                  {/* Content */}
                  <div className={last ? "" : "pb-10"}>
                    <p className="text-sm font-semibold text-accent">
                      {item.period}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold tracking-tight">
                      {item.role}
                    </h3>
                    <p className="text-zinc-500">{item.company}</p>
                    <p className="mt-2 max-w-2xl text-zinc-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
