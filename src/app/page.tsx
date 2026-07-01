import { About } from "@/components/About";
import { Education } from "@/components/Education";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Skills } from "@/components/Skills";
import { Stats } from "@/components/Stats";
import { TechMarquee } from "@/components/TechMarquee";

export default function HomePage() {
  return (
    <div id="top">
      <Header />
      <main>
        <Hero />
        <TechMarquee />
        <About />
        <Stats />
        <Experience />
        <Education />
        <Skills />
      </main>
      <Footer />
    </div>
  );
}
