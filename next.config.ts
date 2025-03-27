import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://admin.examina.live' 
    : '/',

  webpack: (config, { }) => {
    config.resolve.fallback = { 
      ...config.resolve.fallback, 
      fs: false 
    };

    return config;
  },

  async rewrites() {
    return [
      {
        source: '/static/:path*',
        destination: '/static/:path*',
      },
      {
        source: '/_next/static/:path*',
        destination: '/_next/static/:path*',
      }
    ];
  },

  async redirects() {
    return [
      {
        source: '/admin/:path*',
        has: [{ type: 'host', value: 'admin.examina.live' }],
        destination: '/admin/:path*',
        permanent: false,
      }
    ];
  }
};

export default nextConfig;