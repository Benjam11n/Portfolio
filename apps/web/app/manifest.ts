import type { MetadataRoute } from "next";

import { SITE_METADATA } from "@/lib/constants/metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#000000",
    description: SITE_METADATA.description,
    display: "standalone",
    icons: [
      {
        sizes: "any",
        src: "/icon.png",
        type: "image/png",
      },
      {
        sizes: "180x180",
        src: "/apple-icon.png",
        type: "image/png",
      },
    ],
    name: SITE_METADATA.title,
    short_name: "Ben Wang Jiayuan",
    start_url: "/",
    theme_color: "#000000",
  };
}
