/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: process.env.GITHUB_ACTIONS ? '/TaskApp' : '',
  assetPrefix: process.env.GITHUB_ACTIONS ? '/TaskApp/' : '',
};

// This is a special config for GitHub Pages static export
if (process.env.GITHUB_ACTIONS) {
  // Static export configuration
  nextConfig.output = 'export';
  nextConfig.images = { unoptimized: true };
  nextConfig.distDir = 'out';
  
  // Skip validation during build
  nextConfig.typescript = {
    ignoreBuildErrors: true,
  };
  nextConfig.eslint = {
    ignoreDuringBuilds: true,
  };
  
  // Skip API routes in static export
  nextConfig.experimental = {
    excludeRoutes: [
      '/api/:path*',  // Exclude all API routes
    ],
  };
}

module.exports = nextConfig;