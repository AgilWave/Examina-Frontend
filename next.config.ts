import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        has: [{ type: 'host', value: 'admin.examina.live' }],
        destination: '/admin/:path*',
      }
    ];
  },

  async redirects() {
    return [
      {
        source: '/admin/login',
        destination: '/admin/login',
        permanent: false,
      }
    ];
  }
};

export default nextConfig;