/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: process.env.GITHUB_ACTIONS ? '/TaskApp' : '',
  assetPrefix: process.env.GITHUB_ACTIONS ? '/TaskApp/' : '',
  
  // For GitHub Pages static export
  ...(process.env.GITHUB_ACTIONS && {
    output: 'export',
    images: { unoptimized: true },
    distDir: 'out',
  }),
};

module.exports = nextConfig;