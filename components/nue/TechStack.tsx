'use client';

import { SectionCard } from '@/components/nue/SectionCard';
import { PROJECTS } from '@/constants';

// Extract unique technologies from all projects
const getAllTech = () => {
    const allTech = new Map();
    Object.values(PROJECTS).forEach(project => {
        project.techStack.forEach(tech => {
            if (!allTech.has(tech.name)) {
                allTech.set(tech.name, tech);
            }
        });
    });
    return Array.from(allTech.values());
};

export const TechStack = () => {
  const technologies = getAllTech();

  return (
    <SectionCard className="p-8 sm:p-12">
      <div className="mb-8">
        <h2 className="text-sm font-bold tracking-widest uppercase text-foreground font-mono">Stack</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {technologies.map((tech) => (
          <div
            key={tech.name}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-colors gap-3 group"
          >
            <div className="w-10 h-10 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300">
                <img src={tech.path} alt={tech.name} className="w-8 h-8 object-contain" />
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">{tech.name}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};
