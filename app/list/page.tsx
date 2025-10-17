import About from '@/components/list/sections/About';
import Contact from '@/components/list/sections/Contact';
import Experience from '@/components/list/sections/Experience';
import Footer from '@/components/list/sections/Footer';
import Hero from '@/components/list/sections/Hero';
import Projects from '@/components/list/sections/Projects';
import Certifications from '@/components/list/sections/Certifications';

const List = () => {
  return (
    <>
      <Hero />
      <main className="mx-auto max-w-7xl">
        <About />
        <Experience />
        <Projects />
        <Certifications />
        <Contact />
        <Footer />
      </main>
    </>
  );
};

export default List;
