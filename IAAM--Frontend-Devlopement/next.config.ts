import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    unoptimized: true,   
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin.iaamonline.org",
        port: "",
      },
    ],
  },
};

export default nextConfig;
