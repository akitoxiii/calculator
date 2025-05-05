'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AccessibilityProvider } from '@/components/common/AccessibilityProvider';
import { CookieConsent } from '@/components/common/CookieConsent';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ProgressBar } from '@/components/common/ProgressBar';
import { useLoading } from '@/hooks/useLoading';
import { Navigation } from '@/components/common/Navigation';
import { performanceMonitor } from '@/utils/performance';
import { logger } from '@/utils/logger';

interface LayoutClientProps {
  children: React.ReactNode;
}

export function LayoutClient({ children }: LayoutClientProps) {
  const { isLoading, loadingProgress } = useLoading();

  useEffect(() => {
    try {
      performanceMonitor.startMeasure('pageLoad');
      
      return () => {
        performanceMonitor.endMeasure('pageLoad');
      };
    } catch (error) {
      logger.error('Failed to measure page load', error);
    }
  }, []);

  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        {isLoading && <ProgressBar progress={loadingProgress} />}
        <div className="min-h-screen flex flex-col bg-gray-50">
          {/* ヘッダー */}
          <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-primary">
                  家計簿アプリ
                </Link>
                <div className="flex items-center space-x-4">
                  <Navigation />
                </div>
              </div>
            </div>
          </header>

          {/* メインコンテンツ */}
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>

          {/* フッター */}
          <footer className="bg-white border-t">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-sm text-gray-600">
                  © {new Date().getFullYear()} 家計簿アプリ All rights reserved.
                </div>
              </div>
            </div>
          </footer>
        </div>
        <CookieConsent />
      </AccessibilityProvider>
    </ErrorBoundary>
  );
} 