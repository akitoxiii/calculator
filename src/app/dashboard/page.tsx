'use client';

import { ProtectedPage } from '@/components/auth/ProtectedPage';

export default function DashboardPage() {
  return (
    <ProtectedPage>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">ダッシュボード</h1>
        {/* ダッシュボードのコンテンツ */}
      </div>
    </ProtectedPage>
  );
} 