import { TechStackItem } from "@/components/features/tech-stack/tech-stack-item";
import { TECH_STACK_BY_ID } from "@/lib/constants/tech-stack";
import type { Project } from "@/lib/types/index";

interface ProjectTechStackProps {
  techStack: Project["techStack"];
}

export const ProjectTechStack = ({ techStack }: ProjectTechStackProps) =>
  techStack.length > 0 ? (
    <div className="space-y-6">
      <h3 className="font-bold font-mono text-muted-foreground text-xs uppercase tracking-widest">
        Built With
      </h3>
      <div className="flex flex-wrap gap-3">
        {techStack.map((techId) => {
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
  ) : null;
