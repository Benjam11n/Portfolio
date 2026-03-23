import { JsonLd } from "@repo/seo/json-ld";
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
      <JsonLd
        code={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Benjamin Wang",
          url: "https://codedbyben.com",
          sameAs: [
            "https://github.com/Benjam11n",
            "https://www.linkedin.com/in/benjaminwang-sg/",
          ],
          jobTitle: "Full Stack Software Engineer",
          worksFor: {
            "@type": "Organization",
            name: "Aumovio",
          },
          alumniOf: {
            "@type": "CollegeOrUniversity",
            name: "National University of Singapore",
          },
        }}
      />
      <JsonLd
        code={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Benjamin Wang Portfolio",
          url: "https://codedbyben.com",
          description:
            "Full Stack Software Engineer & AI Enthusiast based in Singapore.",
        }}
      />
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
