import { withSentryConfig } from "@sentry/nextjs";
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.DOCKER_MODE === "1" ? "standalone" : undefined,
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kmcstorage1.blob.core.windows.net",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "artemis.sgp1.digitaloceanspaces.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn.filestackcontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn.kmc.solutions",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "kmc.solutions",
        pathname: "**",
      },
    ],
  },
};

export default withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "kmc-community",
    project: "reimbursement",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  },
);
