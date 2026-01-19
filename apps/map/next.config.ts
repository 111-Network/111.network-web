import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@111-network/ui"],
  // MapLibre GL requires webpack configuration for worker files
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
