'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="mb-8 flex flex-col items-center">
        <img src="/favicon.ico" alt="Myly家計簿" className="h-12 w-12 mb-2" />
        <h1 className="text-2xl font-extrabold text-primary mb-1">マイリー家計簿</h1>
        <p className="text-gray-600 text-center text-sm">カレンダー・統計・資産管理・カテゴリ編集など、<br />シンプル＆直感的な操作で毎日続く家計簿アプリです。</p>
      </div>
      <form onSubmit={handleSignIn} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">ログイン</h2>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
          required
        />
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button type="submit" className="w-full bg-primary text-white py-2 rounded">ログイン</button>
        <div className="mt-4 text-center">
          <a href="/auth/reset-password" className="text-blue-600 hover:underline mr-4">パスワードをお忘れですか？</a>
          <a href="/sign-up" className="text-blue-600 hover:underline">新規登録はこちら</a>
        </div>
      </form>
    </div>
  );
} 