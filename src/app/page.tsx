import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Stats } from "@/components/Stats";
import { TechMarquee } from "@/components/TechMarquee";

export default function HomePage() {
  return (
    <div id="top">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-950"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <TechMarquee />
        <About />
        <Stats />
        <Experience />
        <Projects />
        <Skills />
      </main>
      <Footer />
    </div>
  );
}
