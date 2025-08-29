/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/de2rhuwpw/image/upload/**',
        search: '',
      },
    ],
  },
  eslint: {
    dirs: ['src'],
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
