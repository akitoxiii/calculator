import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    template: '%s | 家計簿アプリ',
    default: '家計簿アプリ',
  },
  description: 'シンプルで使いやすい家計簿アプリです。',
  keywords: '家計簿, 家計管理, 支出管理, 収支管理, 予算管理',
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  publisher: 'Your Company',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: '家計簿アプリ',
    description: 'シンプルで使いやすい家計簿アプリ',
    url: 'https://your-domain.com',
    siteName: '家計簿アプリ',
    locale: 'ja_JP',
    type: 'website',
  },
}; 