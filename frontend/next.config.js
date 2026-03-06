/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable source maps to reduce memory during build
  productionBrowserSourceMaps: false,
  // Reduce memory by limiting swc usage
  swcMinify: true,
  // Ensure pages are properly optimized
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig
