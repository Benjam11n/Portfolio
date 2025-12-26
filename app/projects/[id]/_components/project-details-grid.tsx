import type { Project } from "@/constants";
import { cn } from "@/lib/utils";

type ProjectDetailsGridProps = {
  project: Project;
};

export const ProjectDetailsGrid = ({ project }: ProjectDetailsGridProps) => {
  const details = [
    { label: "Client", value: project.client, uppercase: false },
    { label: "Year", value: project.year, uppercase: true },
    { label: "Services", value: project.services, uppercase: true },
    { label: "Location", value: project.location, uppercase: true },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {details.map((detail) => (
          <div
            className="rounded-xl border border-border/40 bg-card p-3 shadow-sm"
            key={detail.label}
          >
            <span
              className={cn(
                "mb-2 block font-semibold text-muted-foreground text-sm tracking-wider",
                detail.uppercase && "uppercase"
              )}
            >
              {detail.label}
            </span>
            <span className="block font-semibold text-foreground text-md">
              {detail.value}
            </span>
          </div>
        ))}
      </div>

      {/* Project Visual Below Grid */}
      <div className="mt-8 overflow-hidden rounded-xl bg-card p-3 shadow-sm md:p-3">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <video
            autoPlay
            className="h-full w-full object-cover"
            loop
            muted
            playsInline
            src={project.texture}
          />
        </div>
      </div>
    </div>
  );
};
