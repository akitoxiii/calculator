'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isLoaded) setIsInitialized(true);
  }, [isLoaded]);

  if (!isInitialized) {
    return null; // またはローディングインジケータ
  }

  return <>{children}</>;
}; 