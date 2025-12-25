"use client";

import Image from "next/image";

import { SectionCard } from "@/components/section-card";
import { PROJECTS } from "@/constants";

// Extract unique technologies from all projects
const getAllTech = () => {
  const allTech = new Map();
  for (const project of Object.values(PROJECTS)) {
    for (const tech of project.techStack) {
      if (!allTech.has(tech.name)) {
        allTech.set(tech.name, tech);
      }
    }
  }
  return Array.from(allTech.values());
};

export const TechStack = () => {
  const technologies = getAllTech();

  return (
    <SectionCard className="p-8 sm:p-12">
      <div className="mb-8">
        <h2 className="font-bold font-mono text-foreground text-sm uppercase tracking-widest">
          Stack
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
        {technologies.map((tech) => (
          <div
            className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary/50"
            key={tech.name}
          >
            <div className="flex h-10 w-10 items-center justify-center grayscale transition-all duration-300 group-hover:grayscale-0">
              <Image
                alt={tech.name}
                className="h-8 w-8 object-contain"
                height={32}
                src={tech.path}
                width={32}
              />
            </div>
            <span className="font-medium text-muted-foreground text-xs group-hover:text-foreground">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};
