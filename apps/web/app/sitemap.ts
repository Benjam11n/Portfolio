import { SITE_URL } from "@repo/seo/constants";
import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/constants/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const projectRoutes = PROJECTS.map((project) => ({
    url: `${SITE_URL}/projects/${project.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const routes = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...projectRoutes,
  ];

  return routes;
}
