"use client";

import Link from "next/link";

import {
  RelatedProjectCardArrow,
  RelatedProjectCardContent,
} from "@/components/features/projects/related-projects-list/related-project-card-content";
import { RelatedProjectCardLogo } from "@/components/features/projects/related-projects-list/related-project-card-logo";
import { Card3D } from "@/components/shared/effects/card-3d";
import { ROUTES } from "@/lib/constants/navigation";
import type { Project } from "@/lib/types";

interface RelatedProjectCardProps {
  project: Project;
}

export const RelatedProjectCard = ({ project }: RelatedProjectCardProps) => (
  <Link
    aria-label={`View project: ${project.title}`}
    className="related-project-item group block"
    data-hover-cursor=""
    data-hover-cursor-icon="arrow-up-right"
    data-hover-cursor-label="View project"
    href={ROUTES.PROJECT_DETAIL(project.id)}
  >
    <Card3D
      className="rounded-xl border border-border/40"
      containerClassName="h-full"
      shadow={false}
      variant="subtle"
    >
      <div className="flex h-full items-center gap-4 rounded-xl p-4 text-foreground transition-colors group-hover:bg-background/30">
        <RelatedProjectCardLogo project={project} />
        <RelatedProjectCardContent project={project} />
        <RelatedProjectCardArrow />
      </div>
    </Card3D>
  </Link>
);
