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
      <body className={inter.className + " bg-gray-50 text-gray-900"}>
        <header className="w-full bg-white border-b border-gray-200 py-6 mb-16">
          <div className="container mx-auto flex justify-center items-center">
            <span className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 select-none" style={{letterSpacing: '-0.03em'}}>マイリー家計簿</span>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
} 