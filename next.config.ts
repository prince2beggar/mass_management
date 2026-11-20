import type { NextConfig } from "next";

const isStandalone = process.env.BUILD_STANDALONE === "true" || (process.env.NODE_ENV === "production" && process.platform !== "win32");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: isStandalone ? "standalone" : undefined,
  // Ensure Next.js cache and temporary build files are isolated
  distDir: ".next",
};

export default nextConfig;
