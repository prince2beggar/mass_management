import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Ensure Next.js cache and temporary build files are isolated
  distDir: ".next",
};

export default nextConfig;
