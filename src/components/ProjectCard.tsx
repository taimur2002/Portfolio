import Image from "next/image";
import type { Project } from "@/data/portfolio";

/**
 * Full-width project showcase row: screenshot on one side, copy on the other,
 * alternating sides down the page. The image sits in a wide 2:1 frame that
 * matches the shots, so nothing is cropped and the whole screenshot is visible.
 * On mobile it stacks (image on top, copy below).
 */
export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const reversed = index % 2 === 0;

  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      {project.image && (
        <div className={`group relative ${reversed ? "lg:order-2" : ""}`}>
          <div className="relative aspect-2/1 overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-sm transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-accent/10">
            <Image
              src={project.image}
              alt={`${project.title} screenshot`}
              fill
              sizes="(min-width: 1024px) 550px, 92vw"
              className="object-cover object-top-left transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        </div>
      )}

      <div className={reversed ? "lg:order-1" : ""}>
        <div className="flex items-center gap-3">
          <span className="bg-linear-to-r from-accent via-accent-2 to-accent-3 bg-clip-text font-display text-sm font-bold tabular-nums text-transparent">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px w-8 bg-white/20" />
          {project.tag && (
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {project.tag}
            </span>
          )}
        </div>

        <h3 className="mt-4 font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {project.title}
        </h3>
        <p className="mt-4 max-w-xl leading-relaxed text-zinc-400">
          {project.description}
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <li
              key={t}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-zinc-300"
            >
              {t}
            </li>
          ))}
        </ul>

        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="group/cta mt-8 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-accent via-accent-2 to-accent-3 px-6 py-3 text-sm font-medium text-zinc-950 shadow-lg shadow-accent/25 transition-all hover:-translate-y-0.5 hover:brightness-110 hover:shadow-xl hover:shadow-accent/30"
          >
            {project.linkLabel ?? "View project"}
            <span
              aria-hidden
              className="transition-transform group-hover/cta:translate-x-1"
            >
              →
            </span>
          </a>
        ) : (
          <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-500">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
            Internal tool
          </span>
        )}
      </div>
    </div>
  );
}
