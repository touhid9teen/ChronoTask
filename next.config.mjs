import withPWA from "next-pwa";

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
  disable: !isProd, // Disable in dev
})(nextConfig);
