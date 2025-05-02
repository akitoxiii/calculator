/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静的エクスポートを無効化
  // output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // experimental: {
  //   appDir: true, // Next.js 13.4以降は不要
  // },
};

module.exports = nextConfig; 