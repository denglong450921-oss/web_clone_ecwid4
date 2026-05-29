import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "don16obqbay2c.cloudfront.net",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
