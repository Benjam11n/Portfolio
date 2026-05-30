import { Markdown } from "@/components/shared/markdown";
import type { Project } from "@/lib/types";
import { splitProjectTitle } from "@/lib/utils/project-title";

interface RelatedProjectCardContentProps {
  project: Project;
}

export const RelatedProjectCardContent = ({
  project,
}: RelatedProjectCardContentProps) => {
  const title = splitProjectTitle(project.title);

  return (
    <div className="flex min-w-0 flex-col">
      <h4 className="font-semibold text-foreground text-sm leading-tight">
        {title.main}
      </h4>
      {title.sub && (
        <p className="mt-1 truncate font-medium text-muted-foreground text-xs">
          {title.sub}
        </p>
      )}
      {project.description && (
        <Markdown className="mt-1 line-clamp-2 font-normal text-muted-foreground/80 text-xs">
          {project.description}
        </Markdown>
      )}
    </div>
  );
};

export const RelatedProjectCardArrow = () => (
  <div className="ml-auto flex shrink-0 items-center">
    <svg
      className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5"
      fill="none"
      role="img"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <title>Arrow right icon</title>
      <path
        d="M9 5l7 7-7 7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  </div>
);
