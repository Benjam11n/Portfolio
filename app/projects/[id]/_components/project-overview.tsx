import { TechStackItem } from "@/components/tech-stack-item";
import type { Project } from "@/constants";
import { DEFAULT_FEATURE_ICON, STACKS } from "@/constants";

type ProjectOverviewProps = {
  project: Project;
};

export const ProjectOverview = ({ project }: ProjectOverviewProps) => {
  const FeatureIcon = project.featureIcon || DEFAULT_FEATURE_ICON;

  return (
    <div className="flex flex-col gap-8">
      {/* Row 1: Overview and Description */}
      <div className="space-y-4">
        <p className="max-w-3xl text-lg text-muted-foreground leading-relaxed">
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
                className="flex items-center gap-4 rounded-xl border border-border/60 border-dashed bg-card p-4 shadow-sm transition-all hover:border-border/80"
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
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-12px)]"
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
