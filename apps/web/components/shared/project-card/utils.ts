import type { Project } from "@/lib/types";

export const splitProjectTitle = (title: string) => {
  const [main, sub] = title.split(" - ");

  return {
    main,
    sub,
  };
};

export const getProjectPreviewPoster = (project: Project) =>
  project.preview_poster ?? project.hero_image;
