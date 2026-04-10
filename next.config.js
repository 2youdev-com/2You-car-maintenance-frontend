/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  transpilePackages: ['recharts', 'recharts-scale', 'd3-scale', 'd3-shape', 'd3-path', 'd3-time-format', 'd3-interpolate', 'd3-color', 'd3-format', 'd3-array', 'd3-time'],
}

module.exports = nextConfig
