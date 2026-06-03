import withPWA from "next-pwa";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      ],
    dangerouslyAllowSVG: true,
  },
};

export default withPWA({
  dest: "public",

  register: true,
  skipWaiting: true,

  disable: process.env.NODE_ENV === "development",

  // 🔥 IMPORTANTE: esto evita intentar cachear archivos internos de Next que en Vercel fallan
  buildExcludes: [
    /app-build-manifest\.json$/,
    /react-loadable-manifest\.json$/,
    /build-manifest\.json$/,
    /middleware-manifest\.json$/,
  ],

  runtimeCaching: [
    // 🧠 API / Supabase (SIEMPRE online-first)
    {
      urlPattern: /^https:\/\/.*supabase\.co\/.*/i,
      handler: "NetworkOnly",
    },

    // 🌐 Todo lo demás (imágenes, assets externos)
    {
      urlPattern: /^https?.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "offline-cache",
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 días
        },
      },
    },

    // 🧱 Next static assets
    {
      urlPattern: /\/_next\/static\//,
      handler: "CacheFirst",
      options: {
        cacheName: "next-static",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
  ],})(nextConfig);