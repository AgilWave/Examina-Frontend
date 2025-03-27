import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'admin.examina.live' }],
        destination: '/admin/:path*',
      },
    ];
  },
};

export default nextConfig;
