"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2 } from "lucide-react";
import { useRef } from "react";
import { Markdown } from "@/components/shared/markdown";
import { TechStackItem } from "@/components/shared/tech-stack-item";
import { TECH_STACK } from "@/lib/constants/tech-stack";
import type { Project } from "@/lib/types/index.ts";

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
        <div className="overview-text max-w-3xl text-lg text-muted-foreground leading-relaxed">
          <Markdown>{project.subdesc || ""}</Markdown>
        </div>
      </div>

      {/* Row 2: Features (Redesigned as Cards) */}
      {project.features && project.features.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-bold font-mono text-muted-foreground text-xs uppercase tracking-widest">
            Key Features
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {project.features.map((feature: string) => (
              <div
                className="feature-card flex flex-col justify-center rounded-2xl border border-border/60 bg-card/90 p-5 shadow-sm transition-all hover:border-border/80 hover:bg-card"
                key={feature}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted/50 text-foreground">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 text-[15px] text-foreground leading-relaxed">
                    <Markdown className="[&_strong]:text-foreground">
                      {feature}
                    </Markdown>
                  </div>
                </div>
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
