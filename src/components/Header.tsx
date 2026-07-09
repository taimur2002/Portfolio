"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { profile } from "@/data/portfolio";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function Header() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu once the viewport reaches the desktop breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const solid = scrolled || open;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-white/10 bg-canvas/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <a
          href="#top"
          onClick={() => setOpen(false)}
          className="font-display text-base font-bold tracking-tight"
        >
          {profile.name}
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 text-sm sm:flex">
          {navLinks.slice(0, 4).map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-zinc-400 transition-colors hover:text-white"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-linear-to-r from-accent to-accent-3 transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
          {profile.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 font-medium text-zinc-100 transition-all hover:-translate-y-0.5 hover:border-white/60"
            >
              Resume
              <span aria-hidden>↓</span>
            </a>
          )}
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full bg-white px-4 py-2 font-medium text-zinc-950 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-white/10"
          >
            Let&apos;s talk
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="-mr-2 flex h-10 w-10 items-center justify-center sm:hidden"
        >
          <span className="flex flex-col items-center justify-center gap-1.5">
            <motion.span
              animate={{ rotate: open ? 45 : 0, y: open ? 8 : 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="block h-0.5 w-6 rounded-full bg-zinc-100"
            />
            <motion.span
              animate={{ opacity: open ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className="block h-0.5 w-6 rounded-full bg-zinc-100"
            />
            <motion.span
              animate={{ rotate: open ? -45 : 0, y: open ? -8 : 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="block h-0.5 w-6 rounded-full bg-zinc-100"
            />
          </span>
        </button>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="overflow-hidden border-b border-white/10 bg-canvas/95 backdrop-blur-md sm:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-3 text-base font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full border border-white/20 px-4 py-3 text-center text-base font-medium text-zinc-100"
                >
                  Resume
                  <span aria-hidden>↓</span>
                </a>
              )}
              <a
                href={`mailto:${profile.email}`}
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-white px-4 py-3 text-center text-base font-medium text-zinc-950"
              >
                Let&apos;s talk
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX: progress }}
        className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-linear-to-r from-accent via-accent-2 to-accent-3"
      />
    </motion.header>
  );
}
