/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Export as static HTML - no server needed
  output: 'export',
  // Disable image optimization for export
  images: {
    unoptimized: true,
  },
  // Reduce memory
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig
