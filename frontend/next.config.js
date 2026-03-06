/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Memory optimization
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig
