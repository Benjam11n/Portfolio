import { Certifications } from '@/components/nue/Certifications';
import { Contact } from '@/components/nue/Contact';
import { Experience } from '@/components/nue/Experience';
import { Hero } from '@/components/nue/Hero';
import { Projects } from '@/components/nue/Projects';
import { TechStack } from '@/components/nue/TechStack';

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12 sm:px-12 sm:py-24">
      <Hero />
      <Experience />
      <Projects />
      <Certifications />
      <TechStack />
      <Contact />
    </main>
  );
}
