import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const IMAGE_QUALITIES = [75, 80, 90, 95];

export const config: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    qualities: IMAGE_QUALITIES,
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
        pathname: "/**",
        port: "",
        protocol: "https",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  serverExternalPackages: ["pino", "thread-stream"],
  transpilePackages: ["@repo/ui", "@repo/analytics"],
};

export const withAnalyzer = (sourceConfig: NextConfig): NextConfig =>
  withBundleAnalyzer()(sourceConfig);
