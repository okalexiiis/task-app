import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Permite cualquier hostname
      },
      {
        protocol: "http",
        hostname: "**", // También permite http si es necesario
      },
    ],
  },
};

export default nextConfig;
