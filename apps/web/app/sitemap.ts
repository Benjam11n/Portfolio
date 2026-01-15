import type { MetadataRoute } from "next";

import { PROJECTS } from "@/lib/constants/projects";
import { env } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = env.SITE_URL || "https://benjaminwang.dev";

  const projectRoutes = PROJECTS.map((project) => ({
    url: `${siteUrl}/projects/${project.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const routes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...projectRoutes,
  ];

  return routes;
}
