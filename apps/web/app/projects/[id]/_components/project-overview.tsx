"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { TechStackItem } from "@/components/shared/tech-stack-item";
import { DEFAULT_FEATURE_ICON } from "@/constants/projects";
import { STACKS } from "@/constants/stacks";
import type { Project } from "@/types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ProjectOverviewProps = {
  project: Project;
};

export const ProjectOverview = ({ project }: ProjectOverviewProps) => {
  const FeatureIcon = project.featureIcon || DEFAULT_FEATURE_ICON;
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Set initial states
      gsap.set(".overview-text", { y: 20, autoAlpha: 0 });
      gsap.set(".feature-card", { scale: 0.9, autoAlpha: 0, y: 20 });
      gsap.set(".tech-item", { scale: 0.8, autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out" },
      });

      // Overview text
      tl.to(".overview-text", {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
      });

      // Features
      tl.to(
        ".feature-card",
        {
          scale: 1,
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.5)",
        },
        "-=0.4"
      );

      // Tech stack
      tl.to(
        ".tech-item",
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.5,
          stagger: 0.05,
        },
        "-=0.4"
      );
    },
    { scope: containerRef }
  );

  return (
    <div className="flex flex-col gap-8" ref={containerRef}>
      {/* Row 1: Overview and Description */}
      <div className="space-y-4">
        <p className="overview-text max-w-3xl text-lg text-muted-foreground leading-relaxed">
          {project.subdesc}
        </p>
      </div>

      {/* Row 2: Features (Redesigned as Cards) */}
      {project.features && project.features.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-bold font-mono text-muted-foreground text-xs uppercase tracking-widest">
            Key Features
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {project.features.map((feature: string) => (
              <div
                className="feature-card flex items-center gap-4 rounded-xl border border-border/60 border-dashed bg-card p-4 shadow-sm transition-all hover:border-border/80"
                key={feature}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border-4 border-white bg-muted shadow-xl dark:border-black">
                  <FeatureIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="font-medium text-foreground text-sm leading-tight">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Row 3: Tech Stack */}
      {project.techStack.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-bold font-mono text-muted-foreground text-xs uppercase tracking-widest">
            Built With
          </h3>
          <div className="flex flex-wrap gap-3">
            {project.techStack.map((tech) => {
              const stackItem = STACKS.find(
                (s) => s.name.toLowerCase() === tech.name.toLowerCase()
              );
              if (!stackItem) {
                return null;
              }
              return (
                <div
                  className="tech-item w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-12px)]"
                  key={tech.name}
                >
                  <TechStackItem small stack={stackItem} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
