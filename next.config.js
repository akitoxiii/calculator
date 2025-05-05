const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wocwnfhgwxesafjtiaxc.supabase.co',
      },
    ],
  }
}

const sentryWebpackPluginOptions = {
  silent: true,
  org: "personal-f3i",
  project: "javascript-nextjs",
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
