import withPWA from "@ducanh2912/next-pwa";

const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: !isProd,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: /^\/api\/auth\//,
        handler: "NetworkOnly",
        method: "GET",
      },
      {
        urlPattern: /^\/api\/auth\//,
        handler: "NetworkOnly",
        method: "POST",
      },
    ],
  },
})(nextConfig);
