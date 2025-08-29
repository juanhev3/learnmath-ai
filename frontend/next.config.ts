import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // We keep strict linting locally, but ignore during CI/production build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
