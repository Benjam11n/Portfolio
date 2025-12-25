import { About } from "@/components/about";
import { Certifications } from "@/components/certification";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { TechStack } from "@/components/tech-stack";

export default function Home() {
  return (
    <main className="mx-auto flex flex-col gap-4 px-2 py-2">
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Certifications />
      <TechStack />
      <Contact />
    </main>
  );
}
