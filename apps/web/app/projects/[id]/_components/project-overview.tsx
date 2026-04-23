"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { Markdown } from "@/components/shared/markdown";
import { TechStackItem } from "@/components/shared/tech-stack-item";
import { TECH_STACK_BY_ID } from "@/lib/constants/tech-stack";
import type { Project } from "@/lib/types/index";

import { FeatureCard } from "./feature-card";

if (typeof window !== "undefined") {
  gsapCore.registerPlugin(ScrollTrigger);
}

interface ProjectOverviewProps {
  project: Project;
}

export const ProjectOverview = ({ project }: ProjectOverviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const normalizedFeatures =
    project.features?.length && project.features.length % 2 === 1
      ? project.features.slice(0, -1)
      : (project.features ?? []);

  useGSAP(
    () => {
      // Set initial states
      gsapCore.set(".overview-text", { autoAlpha: 0, y: 20 });
      gsapCore.set(".feature-card", { autoAlpha: 0, scale: 0.98, y: 16 });
      gsapCore.set(".tech-item", { autoAlpha: 0, scale: 0.8 });

      const tl = gsapCore.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          start: "top 85%",
          toggleActions: "play none none none",
          trigger: containerRef.current,
        },
      });

      // Overview text
      tl.to(".overview-text", {
        autoAlpha: 1,
        duration: 0.8,
        y: 0,
      });

      // Features
      tl.to(
        ".feature-card",
        {
          autoAlpha: 1,
          duration: 0.7,
          scale: 1,
          stagger: 0.08,
          y: 0,
        },
        "-=0.4"
      );

      // Tech stack
      tl.to(
        ".tech-item",
        {
          autoAlpha: 1,
          duration: 0.5,
          scale: 1,
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
        <div className="overview-text max-w-2xl text-lg text-muted-foreground leading-relaxed">
          <Markdown>{project.subdesc || ""}</Markdown>
        </div>
      </div>

      {/* Row 2: Features */}
      {normalizedFeatures.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-bold font-mono text-muted-foreground text-xs uppercase tracking-widest">
            Key Features
          </h3>
          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {normalizedFeatures.map((feature: string, index: number) => (
              <li className="list-none" key={feature}>
                <FeatureCard feature={feature} index={index} />
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Row 3: Tech Stack */}
      {project.techStack.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-bold font-mono text-muted-foreground text-xs uppercase tracking-widest">
            Built With
          </h3>
          <div className="flex flex-wrap gap-3">
            {project.techStack.map((techId) => {
              const stackItem = TECH_STACK_BY_ID[techId];
              if (!stackItem) {
                return null;
              }
              return (
                <div
                  className="tech-item w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-12px)]"
                  key={techId}
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
