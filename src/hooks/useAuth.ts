'use client';

import { useAuth as useClerkAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useAuth = (requireAuth: boolean = true) => {
  const { isLoaded, isSignedIn, signOut } = useClerkAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn && requireAuth) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, requireAuth, router]);

  return {
    isLoaded,
    isSignedIn,
    signOut,
  };
}; 