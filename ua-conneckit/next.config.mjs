/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'universalx.app',
        pathname: '/_next/image/**',
      },
      {
        protocol: 'https',
        hostname: 'static.particle.network',
        pathname: '/chains/**',
      },
    ],
  },
};

export default nextConfig;
