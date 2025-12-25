"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { SectionCard } from "@/components/section-card";
import { PROJECTS } from "@/constants";

gsap.registerPlugin(ScrollTrigger);

export const Projects = () => {
  const containerRef = useRef<HTMLElement>(null);
  const projects = Object.values(PROJECTS);

  useGSAP(
    () => {
      gsap.fromTo(
        ".project-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom-=100",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <SectionCard
      className="scroll-mt-24 p-8 sm:p-12"
      id="projects"
      ref={containerRef}
      title="Projects"
    >
      <div className="grid grid-cols-1 gap-8">
        {projects.map((project) => (
          <div
            className="project-card group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-lg"
            key={project.id}
          >
            {/* Visual Part (placeholder for video/image) */}
            <div className="relative aspect-video w-full overflow-hidden bg-secondary">
              {project.texture ? (
                <video
                  autoPlay
                  className="h-full w-full scale-105 object-cover opacity-80 transition-opacity duration-500 group-hover:scale-100 group-hover:opacity-100"
                  loop
                  muted
                  playsInline
                  src={project.texture}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  No Preview
                </div>
              )}

              <div className="absolute top-4 left-4">
                <div
                  className="rounded-xl border border-border/50 bg-background/80 p-2 backdrop-blur-sm"
                  style={project.logoStyle}
                >
                  <img
                    alt="logo"
                    className="h-8 w-8 object-contain"
                    src={project.logo}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="mb-2 font-bold text-xl">{project.title}</h3>
                  <p className="max-w-2xl text-muted-foreground text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>
                {(project.href || project.github) && (
                  <div className="flex gap-2">
                    {project.href && (
                      <Link
                        className="rounded-full bg-secondary p-2 transition-colors hover:bg-primary hover:text-primary-foreground"
                        href={project.href}
                        target="_blank"
                      >
                        <ArrowUpRight className="h-5 w-5" />
                      </Link>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    className="rounded-full border border-border bg-secondary px-3 py-1 font-medium text-secondary-foreground text-xs"
                    key={tech.name}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};
