import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { LayoutClient } from '@/components/layout/LayoutClient';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '家計簿アプリ',
  description: 'シンプルで使いやすい家計簿アプリです。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
} 