import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { About } from "@/components/sections/about";
import { Certifications } from "@/components/sections/certification";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { TechStack } from "@/components/sections/tech-stack";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  return (
    <main className="mx-auto flex flex-col gap-4 px-2 py-2">
      <Hero />
      <About />
      <Experience />
      <Projects />
      <TechStack />
      <Certifications />
      <Contact />
    </main>
  );
}
