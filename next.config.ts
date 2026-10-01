import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enables "use cache" / cacheLife / cacheTag and makes Partial
  // Prerendering the default rendering mode for the App Router.
  // https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents
  cacheComponents: true,
  // Requires cacheComponents. Prefetches one shared App Shell per route
  // instead of one prefetch per visible <Link>.
  // https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching
  partialPrefetching: true,
};

export default nextConfig;
