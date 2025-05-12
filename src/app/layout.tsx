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
        <header className="w-full bg-primary text-white py-6 shadow-lg mb-8">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/favicon.ico" alt="Myly家計簿" className="h-10 w-10 mr-2 drop-shadow-lg" />
              <span className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-lg">マイリー家計簿</span>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <span className="text-base md:text-lg font-semibold">今月の収支合計:</span>
              <span className="text-xl md:text-2xl font-bold text-yellow-300">¥0</span>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
} 