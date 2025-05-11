import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import CookieConsent from '../components/CookieConsent';
import { supabase } from '@/utils/supabase';

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
      <head>
        {/* Google Search Console認証用メタタグ */}
        <meta name="google-site-verification" content="5hpRcKnJq14HnYg6gbZtBGym66SkrPBmKKcwS6i9Y1E" />
        {/* Google AdSense */}
        <meta name="google-adsense-account" content="ca-pub-6336722634649007" />
        {/* ファビコン */}
        <link rel="icon" href="/favicon.ico" />
        {/* Google Analyticsタグ */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-V64XBFC7WZ`}
          strategy="lazyOnload"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-V64XBFC7WZ', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        {/* LCP画像のプリロード */}
        <link
          rel="preload"
          as="image"
          href="/lp-demo-mobile.webp"
          type="image/webp"
          fetchPriority="high"
        />
        {/* Google AdSense自動広告スクリプト */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6336722634649007"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
} 