import { JsonLd } from "@repo/seo/json-ld";

import { About } from "@/components/sections/about";
import { Certifications } from "@/components/sections/certification";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { TechStack } from "@/components/sections/tech-stack";

export default function Home() {
  return (
    <main className="mx-auto flex flex-col gap-4 px-2 py-2">
      <JsonLd
        code={{
          "@context": "https://schema.org",
          "@type": "Person",
          alternateName: "Benjamin Wang Jiayuan",
          alumniOf: {
            "@type": "CollegeOrUniversity",
            name: "National University of Singapore",
          },
          jobTitle: "Full Stack Software Engineer",
          name: "Benjamin Wang Jiayuan (Benjamin Wang)",
          sameAs: [
            "https://github.com/Benjam11n",
            "https://www.linkedin.com/in/benjaminwang-sg/",
            "https://benjaminwjy.vercel.app",
          ],
          url: "https://codedbyben.com",
          worksFor: {
            "@type": "Organization",
            name: "Aumovio",
          },
        }}
      />
      <JsonLd
        code={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          description:
            "Full Stack Software Engineer & AI Enthusiast based in Singapore.",
          name: "Benjamin Wang Portfolio",
          url: "https://codedbyben.com",
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
