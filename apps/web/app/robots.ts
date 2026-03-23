import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      disallow: ["/api/", "/_next/", "/static/"],
      userAgent: "*",
    },
    sitemap: "https://codedbyben.com/sitemap.xml",
  };
}
