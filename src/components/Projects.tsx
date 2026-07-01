import Image from "next/image";
import { projects } from "@/data/portfolio";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/SectionLabel";

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-20 bg-[#e7f4ee]">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-28">
        <Reveal>
          <SectionLabel>Work</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mb-12 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Selected projects
          </h2>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, index) => {
            const inner = (
              /* 1px wrapper turns into a gradient border on hover */
              <div className="relative h-full rounded-2xl bg-zinc-200 p-px transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-linear-to-br group-hover:from-accent group-hover:to-accent-3 group-hover:shadow-[0_24px_50px_-24px_rgba(16,185,129,0.5)]">
                <article className="flex h-full flex-col overflow-hidden rounded-[15px] bg-white">
                  {/* Image / branded placeholder */}
                  <div className="relative aspect-16/10 w-full overflow-hidden border-b border-zinc-100">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-accent via-accent-2 to-accent-3 transition-transform duration-500 group-hover:scale-105">
                        <span className="font-display text-7xl font-bold text-white/25">
                          {project.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <span className="font-display text-sm font-semibold text-zinc-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">
                      {project.title}
                    </h3>
                    <p className="mt-2 flex-1 text-zinc-600">
                      {project.description}
                    </p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                    {project.href && (
                      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                        View project
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    )}
                  </div>
                </article>
              </div>
            );

            return (
              <Reveal key={project.title} delay={index * 0.08}>
                {project.href ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group block h-full"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="group block h-full">{inner}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
