"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Markdown } from "@/components/shared/markdown";
import { TechStackItem } from "@/components/shared/tech-stack-item";
import { Card, CardContent } from "@/components/ui/card";
import { TECH_STACK } from "@/lib/constants/tech-stack";
import type { Project } from "@/lib/types/index";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ProjectOverviewProps = {
  project: Project;
};

export const ProjectOverview = ({ project }: ProjectOverviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Set initial states
      gsap.set(".overview-text", { y: 20, autoAlpha: 0 });
      gsap.set(".feature-card", { autoAlpha: 0, y: 24 });
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
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
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
        <div className="overview-text max-w-3xl text-lg text-muted-foreground leading-relaxed">
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
