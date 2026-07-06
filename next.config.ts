import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    // Serve resized, modern-format variants sized to each card instead of the
    // raw multi-MB source files. GIFs opt out per-image (unoptimized on the
    // <Image>) since animated formats aren't optimizable.
    formats: ["image/avif", "image/webp"],
    // Cache optimized variants for 31 days.
    minimumCacheTTL: 2678400,
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [64, 128, 200, 256, 400],
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ]
  },
  skipTrailingSlashRedirect: true,
}

export default nextConfig
