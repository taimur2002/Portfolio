import { projects } from "@/data/portfolio";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { ProjectCard } from "@/components/ProjectCard";

export function Projects() {
  if (projects.length === 0) return null;

  return (
    <section id="projects" data-anchor-shift="40" className="scroll-mt-16">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <Reveal>
          <SectionLabel>Projects</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mb-14 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Things I&apos;ve built
          </h2>
        </Reveal>

        <div className="flex flex-col gap-16 sm:gap-20 lg:gap-24">
          {projects.map((project, i) => (
            <Reveal key={project.title} from={i % 2 === 0 ? "right" : "left"}>
              <ProjectCard project={project} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
