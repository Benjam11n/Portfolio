import { config, withAnalyzer } from "@repo/next-config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...config,
};

const analyzedConfig: NextConfig = withAnalyzer(nextConfig);

export default analyzedConfig;
