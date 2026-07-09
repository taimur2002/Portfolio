import { skillGroups } from "@/data/portfolio";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { SkillIcon } from "@/components/SkillIcon";

export function Skills() {
  return (
    <section id="skills" data-anchor-shift="40" className="relative overflow-hidden scroll-mt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 bottom-12 h-80 w-80 rounded-full bg-accent-3 opacity-[0.07] blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <Reveal>
          <SectionLabel>Skills</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mb-12 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            What I work with
          </h2>
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Reveal key={group.category} delay={i * 0.1} from="left">
              <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-zinc-900">
                {group.category}
              </h3>
              <ul className="flex flex-wrap gap-x-5 gap-y-6">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="group flex w-20 flex-col items-center gap-2 text-center"
                  >
                    <div className="flex h-8 items-center justify-center">
                      <SkillIcon
                        name={item}
                        className="h-8 w-8 transition-transform duration-200 group-hover:-translate-y-1"
                      />
                    </div>
                    <span className="text-xs leading-tight text-zinc-600 transition-colors group-hover:text-zinc-900">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
