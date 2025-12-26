import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const IMAGE_QUALITIES = [75, 80, 90, 95];

export const config: NextConfig = {
  serverExternalPackages: ["pino", "thread-stream"],
  transpilePackages: ["@repo/ui"],
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    formats: ["image/webp", "image/avif"],
    qualities: IMAGE_QUALITIES,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export const withAnalyzer = (sourceConfig: NextConfig): NextConfig =>
  withBundleAnalyzer()(sourceConfig);
