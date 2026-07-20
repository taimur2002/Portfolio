import { profile, socials, education } from "@/data/portfolio";
import { Reveal } from "@/components/motion/Reveal";
import { GradientText } from "@/components/GradientText";
import { SocialIcon, hasSocialIcon } from "@/components/SocialIcon";
import { CompanyLogo } from "@/components/CompanyLogo";
import { FooterScene } from "@/components/three/FooterScene";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="relative isolate scroll-mt-16 overflow-hidden border-t border-white/10 bg-[#0a0603] text-white"
    >
      {/* subtle gradient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-72 w-160 -translate-x-1/2 rounded-full bg-accent opacity-20 blur-[100px] will-change-transform"
      />

      {/* Interactive three.js constellation — glows on the dark backdrop, edge-
          faded so it reads as ambient depth behind the copy. */}
      <FooterScene className="pointer-events-none absolute inset-0 -z-10 mask-[radial-gradient(130%_115%_at_50%_30%,#000_55%,transparent)]" />

      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-2xl">
          <Reveal>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Get in touch
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
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
              <span className="shrink-0 bg-linear-to-r from-accent via-accent-2 to-accent-3 bg-clip-text text-transparent transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </Reveal>
          {profile.phone && (
            <Reveal delay={0.2}>
              <a
                href={`tel:${profile.phone}`}
                className="mt-4 inline-block text-base text-zinc-400 transition-colors hover:text-white sm:text-lg"
              >
                {profile.phone}
              </a>
            </Reveal>
          )}
          </div>

          {/* Education credential — tucked into the bottom-right corner */}
          {education[0] && (
            <Reveal delay={0.25}>
              <div className="flex shrink-0 items-center gap-3">
                <CompanyLogo
                  name={education[0].school}
                  logo={education[0].logo}
                />
                <div className="text-sm leading-tight">
                  <p className="font-medium text-zinc-200">
                    {education[0].degree}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {education[0].school} · {education[0].period}
                  </p>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {year} {profile.name}
            {profile.location ? ` · ${profile.location}` : ""}
          </p>
          <ul className="flex flex-wrap items-center gap-5">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="inline-flex text-zinc-400 transition-all hover:-translate-y-0.5 hover:text-white"
                >
                  <SocialIcon label={social.label} />
                  <span className={hasSocialIcon(social.label) ? "sr-only" : ""}>
                    {social.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
