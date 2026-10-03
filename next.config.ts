import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";
import webpack from "webpack";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  webpack(config) {
    // The Cloudflare build supplies this module natively. Vercel uses a shim so
    // the public storefront can run without D1/R2 bindings.
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^cloudflare:workers$/,
        path.join(projectRoot, "lib/vercel-cloudflare-workers.ts"),
      ),
    );
    return config;
  },
};

export default nextConfig;
