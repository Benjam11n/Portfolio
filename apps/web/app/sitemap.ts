import { SITE_URL } from "@repo/seo/constants";
import type { MetadataRoute } from "next";

import { PROJECTS } from "@/lib/constants/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const projectRoutes = PROJECTS.map((project) => ({
    changeFrequency: "monthly" as const,
    lastModified: new Date(),
    priority: 0.8,
    url: `${SITE_URL}/projects/${project.id}`,
  }));

  const routes = [
    {
      changeFrequency: "weekly" as const,
      lastModified: new Date(),
      priority: 1,
      url: SITE_URL,
    },
    ...projectRoutes,
  ];

  return routes;
}
