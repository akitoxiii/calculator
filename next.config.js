/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['wocwnfhgwxesafjtiaxc.supabase.co'], // Supabaseのドメインを追加
  },
  trailingSlash: true,
  // experimental: {
  //   appDir: true, // Next.js 13.4以降は不要
  // },
};

module.exports = nextConfig; 