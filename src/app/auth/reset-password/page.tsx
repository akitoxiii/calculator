'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setError(error.message);
    } else {
      setMessage('パスワードリセット用のメールを送信しました。メールをご確認ください。');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleReset} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">パスワードリセット</h2>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
          required
        />
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {message && <div className="text-green-600 mb-4">{message}</div>}
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? '送信中...' : 'リセットメール送信'}
        </button>
        <div className="mt-4 text-center">
          <a href="/sign-in" className="text-blue-600 hover:underline">ログインはこちら</a>
        </div>
      </form>
    </div>
  );
} 