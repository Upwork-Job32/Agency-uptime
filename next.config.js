/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // Removed 'output: export' as it conflicts with dynamic features
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

module.exports = nextConfig;
