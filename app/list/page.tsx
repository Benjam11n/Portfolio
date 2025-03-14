import About from '@/components/list/sections/About';
import Contact from '@/components/list/sections/Contact';
import Experience from '@/components/list/sections/Experience';
import Footer from '@/components/list/sections/Footer';
import Hero from '@/components/list/sections/Hero';
import Projects from '@/components/list/sections/Projects';

export default function List() {
  return (
    <>
      <Hero />
      <main className="mx-auto max-w-7xl">
        <About />
        <Experience />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
