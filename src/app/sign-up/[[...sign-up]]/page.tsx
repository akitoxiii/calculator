'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push('/sign-in'), 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSignUp} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">新規登録</h2>
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
        {success && <div className="text-green-600 mb-4">登録が完了しました。ログインしてください。</div>}
        <button type="submit" className="w-full bg-primary text-white py-2 rounded">新規登録</button>
        <div className="mt-4 text-center">
          <a href="/sign-in" className="text-blue-600 hover:underline">ログインはこちら</a>
        </div>
      </form>
    </div>
  );
} 