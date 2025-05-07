import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'マイリー家計簿 - 自分に合った家計管理スタイルを作れる家計簿アプリ',
  description: 'カレンダー・統計・資産管理・カテゴリ編集など、必要な機能だけONにして自由にカスタマイズ。シンプル＆直感的な操作で毎日続く家計簿アプリです。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="ja">
        <head>
          {/* Google Search Console認証用メタタグ */}
          <meta name="google-site-verification" content="fESBTT9zZ5bNTgf3HVVDN6mAtCeXdgwU5buol6LHvps" />
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
          <link rel="preload" as="image" href="/lp-demo-mobile.webp" imageSrcSet="/lp-demo-mobile.webp 1x" />
        </head>
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
} 