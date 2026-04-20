/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  output: "standalone",

  // 👇 YE IMPORTANT HAI
  basePath: "/ss",
};

export default nextConfig;