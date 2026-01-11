import type { MetadataRoute } from "next";

import { SITE_METADATA } from "@/lib/constants/metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_METADATA.title,
    short_name: "Ben Wang",
    description: SITE_METADATA.description,
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
