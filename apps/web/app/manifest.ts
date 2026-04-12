import type { MetadataRoute } from "next";

import { SITE_METADATA } from "@/lib/constants/metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#000000",
    description: SITE_METADATA.description,
    display: "standalone",
    icons: [
      {
        sizes: "192x192",
        src: "/icon-192.png",
        type: "image/png",
      },
      {
        sizes: "512x512",
        src: "/icon-512.png",
        type: "image/png",
      },
      {
        sizes: "180x180",
        src: "/apple-icon-180.png",
        type: "image/png",
      },
    ],
    name: SITE_METADATA.title,
    short_name: "Ben Wang Jiayuan",
    start_url: "/",
    theme_color: "#000000",
  };
}
