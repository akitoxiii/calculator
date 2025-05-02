/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['localhost'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/privacy-policy',
        destination: '/privacy',
      },
      {
        source: '/terms-of-service',
        destination: '/terms',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: blob: https:;
              font-src 'self';
              connect-src 'self' https://*.supabase.co;
              frame-ancestors 'none';
              form-action 'self';
              base-uri 'self';
              upgrade-insecure-requests;
            `.replace(/\s+/g, ' ').trim(),
          },
        ],
      },
    ];
  },
  experimental: {
    appDir: true,
  },
  productionBrowserSourceMaps: true,
  onError: async (err, req, res) => {
    console.error('Application error:', err);
  },
  basePath: process.env.NODE_ENV === 'production' ? '/calculator' : '',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  distDir: '.next',
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
      '/404': { page: '/404' },
    };
  },
};

module.exports = nextConfig; 