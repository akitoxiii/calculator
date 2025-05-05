'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SsoCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  }, [router]);

  return <div>SSO認証処理中...</div>;
} 