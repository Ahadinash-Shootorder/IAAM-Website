import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  output: "standalone",   // 👈 ADD THIS

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