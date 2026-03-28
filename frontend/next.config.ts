import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
    qualities: [50, 60, 70, 75, 80, 85, 90, 95, 100],
  },
  // @ts-ignore - explicitly configure allowedDevOrigins for cross origin dev warnings
  allowedDevOrigins: ['10.197.91.188', 'localhost', '127.0.0.1'],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  async rewrites() {
    return [
      {
        // Proxy all /api requests to the Express backend
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`
          : 'http://localhost:5000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
