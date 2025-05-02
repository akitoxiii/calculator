import { Suspense } from 'react';
import { AuthCallback } from '@/components/auth';

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallback />
    </Suspense>
  );
} 