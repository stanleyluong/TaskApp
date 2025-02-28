/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/TaskApp',
  assetPrefix: '/TaskApp/',
  output: 'export',
  images: { unoptimized: true },
};

module.exports = nextConfig;