import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'admin.examina.live' }],
        destination: '/admin/:path*',
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'lecturer.examina.live' }],
        destination: '/lecturer/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '.examina.live',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ];
  }

};

export default nextConfig;
