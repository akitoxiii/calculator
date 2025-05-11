import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: 'マイリー家計簿 - 自分に合った家計管理スタイルを作れる家計簿アプリ',
  description: 'カレンダー・統計・資産管理・カテゴリ編集など、必要な機能だけONにして自由にカスタマイズ。シンプル＆直感的な操作で毎日続く家計簿アプリです。',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://myly-app.vercel.app',
    title: 'マイリー家計簿 - 自分に合った家計管理スタイルを作れる家計簿アプリ',
    description: 'カレンダー・統計・資産管理・カテゴリ編集など、必要な機能だけONにして自由にカスタマイズ。シンプル＆直感的な操作で毎日続く家計簿アプリです。',
    siteName: 'マイリー家計簿',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'マイリー家計簿 - 自分に合った家計管理スタイルを作れる家計簿アプリ',
    description: 'カレンダー・統計・資産管理・カテゴリ編集など、必要な機能だけONにして自由にカスタマイズ。シンプル＆直感的な操作で毎日続く家計簿アプリです。',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
} 