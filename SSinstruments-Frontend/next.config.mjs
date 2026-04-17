/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  output: "standalone",

  // 👇 YE IMPORTANT HAI
  basePath: "/ss",
  // assetPrefix: "/ss",
};

export default nextConfig;