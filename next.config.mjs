/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "kmcstorage1.blob.core.windows.net",
      "cdn.kmc.solutions",
      "kmc.solutions",
      "img.propelauth.com",
    ],
  },
};

export default nextConfig;
