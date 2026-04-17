/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  output: "standalone",   // 👈 ADD THIS
};

export default nextConfig;