import { Suspense } from 'react';
import { AuthCallback } from '@/components/auth/AuthCallback';

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallback />
    </Suspense>
  );
} 