/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server build (server.js + traced node_modules) for the DigitalOcean droplet.
  output: "standalone",
  // Production builds can use a separate folder so they never clash with the dev server's `.next`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Make sure the Prisma query engine is shipped with the standalone build.
  outputFileTracingIncludes: {
    "/**": ["./node_modules/.prisma/client/**/*", "./node_modules/@prisma/client/**/*"],
  },
  // Trim the release: the droplet is x86_64 (debian-openssl-3.0.x engine), SQLite only, images unoptimized (no sharp).
  outputFileTracingExcludes: {
    "/**": [
      "./node_modules/.prisma/client/libquery_engine-linux-arm64-*",
      "./node_modules/.prisma/client/query_engine_bg.wasm",
      "./node_modules/@prisma/client/runtime/*.wasm-base64.*",
      "./node_modules/@prisma/client/runtime/query_compiler_bg.*",
      "./node_modules/@prisma/client/runtime/*.map",
      "./node_modules/@img/**",
      "./node_modules/sharp/**",
    ],
  },
  allowedDevOrigins: ["*.preview.same-app.com"],
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "ext.same-assets.com", pathname: "/**" },
      { protocol: "https", hostname: "ugc.same-assets.com", pathname: "/**" },
    ],
  },
};

module.exports = nextConfig;
