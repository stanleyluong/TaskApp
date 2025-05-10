/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Enable static optimization for better performance
  reactStrictMode: true,
  // Configure image domains if needed
  images: {
    domains: ['task-mnp18jndw-stanley-luongs-projects.vercel.app'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add environment variable for API URL
  env: {
    NEXT_PUBLIC_API_URL: 'https://task-mnp18jndw-stanley-luongs-projects.vercel.app',
  }
};

module.exports = nextConfig;