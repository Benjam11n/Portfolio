import type { Project } from "@/lib/types";

export const getProjectPreviewPoster = (project: Project) =>
  project.preview_poster ?? project.hero_image;
