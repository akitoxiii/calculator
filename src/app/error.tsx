'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            申し訳ありません
          </h1>
          <p className="text-gray-600 mb-8">
            予期せぬエラーが発生しました。時間をおいて再度お試しください。
          </p>
          <button
            onClick={reset}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            もう一度試す
          </button>
        </div>
      </div>
    </div>
  );
} 