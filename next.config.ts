import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* Config Options */
  reactStrictMode: true,

  /* Experimental Features */
  experimental: {
    typedRoutes: true,
  },

  /* Image Optimization */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
}

export default nextConfig
