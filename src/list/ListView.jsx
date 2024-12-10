import About from './sections/About';
import Contact from './sections/Contact';
import Experience from './sections/Experience';
import Footer from './sections/Footer';
import Hero from './sections/Hero';
import Projects from './sections/Projects';

const ListView = () => {
  return (
    <>
      <Hero />
      <main className="max-w-7xl mx-auto">
        <About />
        <Projects />
        <Experience />
        <Contact />
        <Footer />
      </main>
    </>
  );
};

export default ListView;
