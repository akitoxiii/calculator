'use client';

import { useState } from 'react';
import { insertTestData } from '@/utils/testData';

export const TestDataInserter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleInsertTestData = async () => {
    setIsLoading(true);
    setMessage('');
    setError(null);
    
    try {
      await insertTestData();
      setMessage('テストデータの挿入が完了しました');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
      setError(errorMessage);
      console.error('データ挿入エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={handleInsertTestData}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? '処理中...' : 'テストデータを挿入'}
      </button>

      {message && (
        <p className="mt-2 text-sm text-green-600">{message}</p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}; 