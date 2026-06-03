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

  // Mejor compatibilidad con iOS
  dynamicStartUrl: false,
  cacheStartUrl: true,
  reloadOnOnline: false,

  disable: process.env.NODE_ENV === "development",

  buildExcludes: [
    /app-build-manifest\.json$/,
    /react-loadable-manifest\.json$/,
    /build-manifest\.json$/,
    /middleware-manifest\.json$/,
  ],

  runtimeCaching: [
    // Cachear navegación principal (/)
    {
      urlPattern: ({ request }: { request: Request }) =>
        request.mode === "navigate",
      handler: "CacheFirst",
      options: {
        cacheName: "pages",
      },
    },

    // Supabase siempre online
    {
      urlPattern: /^https:\/\/.*supabase\.co\/.*/i,
      handler: "NetworkOnly",
    },

    // Assets externos
    {
      urlPattern: /^https?.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "offline-cache",
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 7,
        },
      },
    },

    // Archivos estáticos de Next
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
  ],
})(nextConfig);