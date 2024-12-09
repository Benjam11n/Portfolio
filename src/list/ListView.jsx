import About from './sections/About';
import Contact from './sections/Contact';
import Experience from './sections/Experience';
import Footer from './sections/Footer';
import Hero from './sections/Hero';
import Projects from './sections/Projects';
// import Clients from './sections/Clients';

const ListView = () => {
  return (
    <main className="max-w-7xl mx-auto">
      <Hero />
      <About />
      <Projects />
      {/* <Clients /> */}
      <Experience />
      <Contact />
      <Footer />
    </main>
  );
};

export default ListView;
