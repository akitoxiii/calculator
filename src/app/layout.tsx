import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

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
            strategy="afterInteractive"
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
        </head>
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
} 