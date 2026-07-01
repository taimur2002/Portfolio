import { profile, socials } from "@/data/portfolio";
import { Reveal } from "@/components/motion/Reveal";
import { GradientText } from "@/components/GradientText";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="relative isolate scroll-mt-20 overflow-hidden bg-zinc-950 text-white">
      {/* subtle gradient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-72 w-160 -translate-x-1/2 rounded-full bg-accent opacity-20 blur-[100px]"
      />

      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-6 sm:py-28">
        <Reveal>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Get in touch
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Let&apos;s build something <GradientText>together</GradientText>.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-lg text-zinc-300">
            Have a project in mind, or just want to say hi? My inbox is always
            open.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <a
            href={`mailto:${profile.email}`}
            className="group mt-8 inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-1 font-display text-lg font-semibold tracking-tight sm:text-2xl md:text-3xl"
          >
            <span className="max-w-full wrap-anywhere bg-linear-to-r from-white to-white bg-size-[0%_2px] bg-bottom-left bg-no-repeat pb-1 transition-[background-size] duration-300 group-hover:bg-size-[100%_2px]">
              {profile.email}
            </span>
            <span className="shrink-0 text-accent transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </Reveal>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {year} {profile.name}
            {profile.location ? ` · ${profile.location}` : ""}
          </p>
          <ul className="flex flex-wrap gap-6">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
