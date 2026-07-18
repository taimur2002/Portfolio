"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { profile, roles } from "@/data/portfolio";
import { GradientText } from "@/components/GradientText";
import { RotatingText } from "@/components/motion/RotatingText";
import { Magnetic } from "@/components/motion/Magnetic";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * The <h1> is the page's LCP element. Starting it at `opacity: 0` (like `item`)
 * leaves it unpainted until React hydrates and the stagger runs, which cost
 * ~1.7s of LCP on desktop and far more on throttled mobile.
 *
 * So the headline slides without fading. Framer renders the initial transform
 * server-side, and a transformed element still counts as painted, so the
 * headline lands in the very first frame. Everything else keeps its fade.
 */
const headline: Variants = {
  hidden: { y: 28 },
  show: {
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Soft gradient orbs — the hero's color wash. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute animate-blob will-change-transform rounded-full bg-accent opacity-25 blur-3xl"
          style={{ width: 440, height: 440, top: -120, left: -80 }}
        />
        <div
          className="absolute animate-blob will-change-transform rounded-full bg-accent-3 opacity-20 blur-3xl"
          style={{
            width: 380,
            height: 380,
            top: -40,
            right: -60,
            animationDelay: "-5s",
          }}
        />
        <div
          className="absolute animate-blob will-change-transform rounded-full bg-accent-2 opacity-25 blur-3xl"
          style={{
            width: 320,
            height: 320,
            bottom: -40,
            left: "42%",
            animationDelay: "-9s",
          }}
        />
      </div>

      {/* Dotted grid, faded toward the edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 mask-[radial-gradient(ellipse_60%_60%_at_50%_40%,#000,transparent)]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        // `svh` (small viewport height) on mobile: plain `vh` measures the
        // viewport as if the browser's URL bar were hidden, so the hero renders
        // taller than the screen and reads as dead space.
        className="mx-auto flex min-h-[70svh] max-w-6xl flex-col justify-center px-5 py-10 sm:min-h-[88vh] sm:px-6 sm:py-20"
      >
        {/* "Available for new work" badge — hidden for now (currently employed).
            Uncomment this block to show it again.
        <motion.div variants={item}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-zinc-300 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Available for new work
          </span>
        </motion.div>
        */}

        <motion.p
          variants={item}
          className="mt-8 font-display text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400 sm:text-sm sm:tracking-[0.2em]"
        >
          <RotatingText items={roles} />
        </motion.p>

        <motion.h1
          variants={headline}
          className="mt-4 max-w-4xl font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl sm:leading-[1.05] md:text-6xl lg:text-7xl"
        >
          {profile.tagline.split(" ").slice(0, -2).join(" ")}{" "}
          <GradientText>
            {profile.tagline.split(" ").slice(-2).join(" ")}
          </GradientText>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl"
        >
          Hi, I&apos;m {profile.name}. Welcome to my corner of the web. Take a
          look around at what I&apos;ve been building.
        </motion.p>

        <motion.div variants={item} className="mt-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-zinc-400 backdrop-blur">
            <Image
              src="/companies/convoi.svg"
              alt="Convoi AI"
              width={14}
              height={20}
              unoptimized
              className="h-4 w-auto"
            />
            Currently at{" "}
            <span className="font-semibold text-zinc-100">Convoi AI</span>
          </span>
        </motion.div>

        <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
          <Magnetic>
            <a
              href="#experience"
              className="group inline-flex items-center gap-2 rounded-full bg-linear-to-r from-accent via-accent-2 to-accent-3 px-7 py-3.5 text-sm font-medium text-zinc-950 shadow-lg shadow-accent/25 transition-all hover:-translate-y-0.5 hover:brightness-110 hover:shadow-xl hover:shadow-accent/30"
            >
              See my experience
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#contact"
              className="beam-border inline-flex items-center rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-medium text-zinc-100 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-accent/30"
            >
              Get in touch
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1"
        >
          <span className="h-1.5 w-1 rounded-full bg-zinc-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
