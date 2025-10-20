/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export for SSG
  images: {
    unoptimized: true // Required for static export
  },
  // Strict mode for better error detection
  reactStrictMode: true,
  // Faster builds in development
  swcMinify: true,
}

module.exports = nextConfig
