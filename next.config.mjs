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

export default nextConfig;
