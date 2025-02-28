/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: process.env.GITHUB_ACTIONS || process.env.NEXT_STATIC_EXPORT ? '/TaskApp' : '',
  assetPrefix: process.env.GITHUB_ACTIONS || process.env.NEXT_STATIC_EXPORT ? '/TaskApp/' : '',
};

// This is a special config for static export (GitHub Pages)
if (process.env.GITHUB_ACTIONS || process.env.NEXT_STATIC_EXPORT) {
  // Static export configuration
  nextConfig.output = 'export';
  nextConfig.images = { unoptimized: true };
  
  // Skip validation during build
  nextConfig.typescript = {
    ignoreBuildErrors: true,
  };
  nextConfig.eslint = {
    ignoreDuringBuilds: true,
  };
}

module.exports = nextConfig;