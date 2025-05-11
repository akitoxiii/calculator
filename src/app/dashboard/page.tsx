'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsSignedIn(!!user);
      setIsLoading(false);
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoading, isSignedIn, router]);

  if (isLoading) {
    return <div>読み込み中...</div>;
  }
  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">ダッシュボード</h1>
      {/* ダッシュボードのコンテンツ */}
    </div>
  );
} 