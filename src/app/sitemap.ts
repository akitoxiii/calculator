import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com';

  // 静的ページのリスト
  const staticPages = [
    '',
    '/help',
    '/settings',
    '/privacy',
    '/terms',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 動的に生成されるページのリスト
  // 例: カテゴリーページ、月別アーカイブなど
  const dynamicPages = [
    '/statistics',
    '/calendar',
    '/assets',
    '/category',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...dynamicPages];
} 