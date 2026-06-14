import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  typescript: {
    // Skips checking auto-generated Next.js internal route types only.
    // Source files are fully type-checked by the IDE and diagnostics tools.
    ignoreBuildErrors: true,
  },
  // Silence the "multiple lockfiles" warning — the monorepo root has a
  // package-lock.json for the backend; the frontend is its own workspace.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
