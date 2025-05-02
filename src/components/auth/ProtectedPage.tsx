'use client';

import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ProtectedPageProps {
  children: React.ReactNode;
}

export const ProtectedPage = ({ children }: ProtectedPageProps) => {
  const { isLoaded, isSignedIn } = useAuth(true);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isSignedIn) {
    return null; // useAuthのリダイレクトに任せる
  }

  return <>{children}</>;
}; 