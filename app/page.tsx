import { Certifications } from '@/components/nue/Certifications';
import { Contact } from '@/components/nue/Contact';
import { About } from '@/components/nue/About';
import { Experience } from '@/components/nue/Experience';
import { Hero } from '@/components/nue/Hero';
import { Projects } from '@/components/nue/Projects';
import { TechStack } from '@/components/nue/TechStack';

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
