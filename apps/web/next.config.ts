import { config, withAnalyzer } from "@repo/next-config";

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...config,
};

export default withAnalyzer(nextConfig);
