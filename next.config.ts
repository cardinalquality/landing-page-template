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
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**',
      },
    ],
    qualities: [75, 90], // Add support for quality 90
  },
}

export default nextConfig
