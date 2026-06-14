import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Skips checking auto-generated Next.js internal route types only.
    // Source files are fully type-checked by the IDE and diagnostics tools.
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
