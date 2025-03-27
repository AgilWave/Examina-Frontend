import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/login',
        has: [{ type: 'host', value: 'examina.live' }],
        destination: '/login',
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'admin.examina.live' }],
        destination: '/admin/:path*',
      },
    ];
  },
};

export default nextConfig;
