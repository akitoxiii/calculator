'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-95 border-t border-gray-200 p-2 shadow-lg z-50">
      <div className="container mx-auto max-w-4xl flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="text-xs text-gray-600">
          <p>
            当サイトでは、ログイン機能の提供のために必須クッキーを使用しています。
            詳細は
            <Link href="/privacy-policy" className="text-primary hover:underline">
              プライバシーポリシー
            </Link>
            をご覧ください。
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={acceptCookies}
            className="px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            了解しました
          </button>
        </div>
      </div>
    </div>
  );
} 