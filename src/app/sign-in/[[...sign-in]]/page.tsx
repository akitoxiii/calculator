'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        switch (error.message) {
          case 'Invalid login credentials':
            setError('メールアドレスまたはパスワードが正しくありません');
            break;
          case 'Email not confirmed':
            setError('メールアドレスの確認が完了していません。確認メールをご確認ください');
            break;
          case 'Too many requests':
            setError('ログイン試行回数が多すぎます。しばらく時間をおいて再度お試しください');
            break;
          default:
            setError(`ログインエラー: ${error.message}`);
        }
        console.error('Login error:', error);
        return;
      }

      if (data?.user) {
        router.push('/');
      }
    } catch (error) {
      setError('サーバーとの通信に失敗しました。インターネット接続をご確認ください');
      console.error('Network or server error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">家計簿アプリ</h1>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm mb-2">
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-2">
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a href="/reset-password" className="text-sm text-blue-500 hover:text-blue-600 block mt-1">
              パスワードをお忘れの方
            </a>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '処理中...' : 'ログイン'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/sign-up')}
            className="w-full border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 mt-4"
          >
            新規登録
          </button>
        </form>
      </div>
    </div>
  );
} 