import { TechStackItem } from "@/components/tech-stack-item";
import type { Project } from "@/constants";
import { STACKS } from "@/constants";

type ProjectOverviewProps = {
  project: Project;
};

export const ProjectOverview = ({ project }: ProjectOverviewProps) => {
  return (
    <div className="flex flex-col gap-12 lg:flex-row">
      <div className="flex-1 space-y-8">
        <p className="text-lg text-muted-foreground leading-relaxed">
          {project.subdesc}
        </p>

        {project.features && (
          <ul className="space-y-4">
            {project.features.map((feature: string) => (
              <li
                className="flex items-start gap-4 text-muted-foreground"
                key={feature}
              >
                <span className="mt-2.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
                <span className="text-md leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {project.techStack.length > 0 && (
        <div className="w-full shrink-0 pt-8 lg:max-w-xs lg:pt-0">
          <h3 className="mb-6 font-bold font-mono text-muted-foreground text-xs uppercase tracking-widest">
            Built With
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
            {project.techStack.map((tech) => {
              const stackItem = STACKS.find(
                (s) => s.name.toLowerCase() === tech.name.toLowerCase()
              );
              if (!stackItem) {
                return null;
              }
              return <TechStackItem key={tech.name} small stack={stackItem} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
};
