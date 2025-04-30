import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function useLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
      setLoadingProgress(0);
    };

    const handleComplete = () => {
      setLoadingProgress(100);
      setIsLoading(false);
    };

    const handleProgress = () => {
      setLoadingProgress((prev) => {
        if (prev >= 90) {
          return prev;
        }
        return prev + 10;
      });
    };

    const interval = setInterval(handleProgress, 100);
    const timer = setTimeout(handleComplete, 500);

    handleStart();

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [pathname, searchParams]);

  return { isLoading, loadingProgress };
} 