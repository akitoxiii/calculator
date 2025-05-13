'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '@/types/expense';

// デフォルトカテゴリー定義
const getDefaultCategories = (userId: string) => [
  ...DEFAULT_EXPENSE_CATEGORIES.map(cat => ({ ...cat, user_id: userId })),
  ...DEFAULT_INCOME_CATEGORIES.map(cat => ({ ...cat, user_id: userId })),
];

async function insertDefaultCategories(userId: string) {
  const categoriesWithUser = getDefaultCategories(userId);
  const { error } = await supabase.from('categories').insert(categoriesWithUser);
  if (error) {
    console.error('デフォルトカテゴリー挿入エラー:', error);
    throw error;
  }
}

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      // サインアップ直後のユーザーID取得
      const user = data.user;
      if (user) {
        try {
          await insertDefaultCategories(user.id);
        } catch (e) {
          setError('カテゴリー初期化に失敗しました');
        }
      }
      setSuccess('確認メールを送信しました。メールをご確認ください。');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-12 py-16 px-4">
        {/* 左側：テキスト・フォーム */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-8">
          <div>
            <span className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              新規ユーザー登録
            </span>
          </div>
          <form onSubmit={handleSignUp} className="flex flex-col gap-4 w-full max-w-sm">
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition w-full"
            >
              {loading ? '登録中...' : 'ユーザー登録'}
            </button>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
          </form>
          <div className="flex gap-4 mt-4">
            <button onClick={() => router.push('/sign-in')} className="px-6 py-2 bg-white text-blue-600 font-bold border border-blue-600 rounded-lg shadow hover:bg-blue-50 transition">ログインへ</button>
          </div>
        </div>
        {/* 右側：イラスト画像 */}
        <div className="flex-1 flex items-center justify-center gap-8">
          <div className="bg-white rounded-2xl shadow p-8 flex items-center justify-center">
            <img src="/kakeibo-illust.png" alt="家計簿アプリイラスト" className="w-64 h-auto" />
          </div>
          <div className="bg-white rounded-2xl shadow p-8 flex items-center justify-center">
            <img src="/kakeibo-illust2.png" alt="家計簿アプリイラスト2" className="w-64 h-auto" />
          </div>
        </div>
      </div>
    </div>
  );
} 