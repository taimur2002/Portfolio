import { profile, skillGroups } from "@/data/portfolio";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/SectionLabel";

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-20">
      <div className="mx-auto max-w-5xl px-5 py-24 sm:px-6 sm:py-28">
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
            <Reveal key={group.category} delay={i * 0.1}>
              <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-zinc-900">
                {group.category}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-sm text-zinc-700 transition-colors hover:border-accent hover:text-accent"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        {profile.resumeUrl && (
          <Reveal delay={0.15}>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-14 inline-flex items-center gap-2 rounded-full border border-zinc-300 px-7 py-3.5 text-sm font-medium text-zinc-900 transition-all hover:-translate-y-0.5 hover:border-zinc-900"
            >
              Download résumé
              <span aria-hidden>↓</span>
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
