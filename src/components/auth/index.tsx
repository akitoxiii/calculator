'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const error_description = searchParams.get('error_description');

    if (error) {
      console.error('Auth error:', error, error_description);
      router.push(`/?error=${encodeURIComponent(error_description || 'Authentication failed')}`);
      return;
    }

    if (code) {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      supabase.auth.exchangeCodeForSession(code)
        .then(() => {
          router.push('/');
        })
        .catch((error) => {
          console.error('Error exchanging code for session:', error);
          router.push(`/?error=${encodeURIComponent('Failed to complete authentication')}`);
        });
    }
  }, [router, searchParams]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>
  );
} 