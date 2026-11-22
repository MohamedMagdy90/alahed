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
  // Trim the release: the droplet is x86_64 (debian-openssl-3.0.x engine), SQLite only. The traced sharp binaries are
  // for the build machine's CPU, so they are dropped here and deploy/deploy.sh adds the linux-x64 build.
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
  // Originals in /public are not content-hashed: cache them for a week and revalidate in the background
  // (they were served with max-age=0, so every visit re-checked every logo and photo).
  async headers() {
    const week = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }];
    return [
      { source: "/images/:path*", headers: week },
      { source: "/brand/:path*", headers: week },
      { source: "/fonts/:path*", headers: week },
    ];
  },
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Optimised (WebP, resized per device) by sharp. The droplet is x86_64 while builds run on arm64, so
    // deploy/deploy.sh installs the linux-x64 sharp binaries into the release (the traced ones are excluded below).
    formats: ["image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560],
    imageSizes: [64, 96, 128, 192, 256, 384],
    // Originals in /public keep their names, so a re-optimised copy is kept for a week, not forever.
    minimumCacheTTL: 604800,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "ext.same-assets.com", pathname: "/**" },
      { protocol: "https", hostname: "ugc.same-assets.com", pathname: "/**" },
    ],
  },
};

module.exports = nextConfig;
