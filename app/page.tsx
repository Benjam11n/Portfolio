import { Certifications } from '@/components/certification';
import { Contact } from '@/components/contact';
import { About } from '@/components/about';
import { Experience } from '@/components/experience';
import { Hero } from '@/components/hero';
import { Projects } from '@/components/projects';
import { TechStack } from '@/components/tech-stack';

export default function Home() {
  return (
    <main className="mx-auto px-2 py-2 flex flex-col gap-4">
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
