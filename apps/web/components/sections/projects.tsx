"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { ProjectCard } from "@/components/shared/project-card";
import { SectionCard } from "@/components/shared/section-card";
import { PROJECTS } from "@/lib/constants/projects";

gsap.registerPlugin(ScrollTrigger);

export const Projects = () => {
  const projects = PROJECTS;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(".project-card-item", { autoAlpha: 0, scale: 0.9 });

      gsap.to(".project-card-item", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        scale: 1,
        autoAlpha: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.2)",
      });
    },
    { scope: containerRef }
  );

  return (
    <SectionCard id="projects" title="Projects">
      <div className="grid grid-cols-1 gap-4" ref={containerRef}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </SectionCard>
  );
};
