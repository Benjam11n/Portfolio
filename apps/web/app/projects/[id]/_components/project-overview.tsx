"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { Markdown } from "@/components/shared/markdown";
import { TechStackItem } from "@/components/shared/tech-stack-item";
import { Card, CardContent } from "@/components/ui/card";
import { TECH_STACK } from "@/lib/constants/tech-stack";
import type { Project } from "@/lib/types/index";

if (typeof window !== "undefined") {
  gsapCore.registerPlugin(ScrollTrigger);
}

interface ProjectOverviewProps {
  project: Project;
}

export const ProjectOverview = ({ project }: ProjectOverviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Set initial states
      gsapCore.set(".overview-text", { autoAlpha: 0, y: 20 });
      gsapCore.set(".feature-card", { autoAlpha: 0, y: 24 });
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
      {project.features && project.features.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold font-mono text-muted-foreground text-xs uppercase tracking-widest">
            Key Features
          </h3>
          <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {project.features.map((feature: string, index: number) => (
              <li className="feature-card" key={feature}>
                <Card className="h-full rounded-md border-border/50 bg-card shadow-sm">
                  <CardContent className="flex items-start gap-4 p-4">
                    <span className="inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-md bg-muted px-2 font-medium font-mono text-[11px] text-muted-foreground tracking-[0.2em]">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <div className="min-w-0 text-[15px] text-foreground leading-relaxed">
                      <Markdown className="[&_strong]:text-foreground">
                        {feature}
                      </Markdown>
                    </div>
                  </CardContent>
                </Card>
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
            {project.techStack.map((techName) => {
              const stackItem = TECH_STACK.find(
                (s) => s.name.toLowerCase() === techName.toLowerCase()
              );
              if (!stackItem) {
                return null;
              }
              return (
                <div
                  className="tech-item w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-12px)]"
                  key={techName}
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
