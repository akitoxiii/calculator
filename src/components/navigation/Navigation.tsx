'use client';

import Link from 'next/link';

export function Navigation() {
  return {
    HeaderNav: () => (
      <nav className="hidden md:flex space-x-4">
        <Link href="/help" className="text-gray-600 hover:text-gray-900">
          ヘルプ
        </Link>
        <Link href="/settings" className="text-gray-600 hover:text-gray-900">
          設定
        </Link>
        <Link href="/contact" className="text-gray-600 hover:text-gray-900">
          お問い合わせ
        </Link>
      </nav>
    ),
    FooterNav: () => (
      <div className="flex space-x-4 mt-4 md:mt-0">
        <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
          プライバシーポリシー
        </Link>
        <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
          利用規約
        </Link>
        <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
          お問い合わせ
        </Link>
      </div>
    )
  };
} 