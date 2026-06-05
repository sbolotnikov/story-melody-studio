import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enables Prisma to work correctly with Next.js Server Components
  serverExternalPackages: ["@prisma/client"],
  
  // React 19 features and performance optimizations
  experimental: {
    // Allows for incremental adoption of Partial Prerendering
    // ppr: 'incremental',
  },

  // Image optimization settings (example for external assets)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
};

export default nextConfig;
