/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wocwnfhgwxesafjtiaxc.supabase.co',
      },
    ],
  },
  basePath: process.env.NODE_ENV === 'production' ? '/calculator' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/calculator/' : '',
  experimental: {
    serverActions: false
  }
}

module.exports = nextConfig 