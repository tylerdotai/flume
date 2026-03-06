/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  experimental: {
    cpus: 1,
    workerThreads: false,
    optimizePackageImports: ['lucide-react'],
  },
  staticPageGenerationTimeout: 300,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
