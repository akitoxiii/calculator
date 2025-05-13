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
  console.log('[DEBUG] insertDefaultCategories: userId =', userId);
  const categoriesWithUser = getDefaultCategories(userId);
  console.log('[DEBUG] insertDefaultCategories: categoriesWithUser =', categoriesWithUser);
  const { error } = await supabase.from('categories').insert(categoriesWithUser);
  if (error) {
    console.error('デフォルトカテゴリー挿入エラー:', error);
    throw error;
  }
}

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 通常ログイン処理
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('ログインエラー:', error);
        setError(error.message);
      } else {
        console.log('ログイン成功:', data);
        router.push('/');
      }
    } catch (e) {
      console.error('予期せぬエラー:', e);
      setError('予期せぬエラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  // ゲストログイン処理（Supabase匿名認証）
  const handleGuestLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        console.error('ゲストログインエラー:', error);
        setError(error.message);
        return;
      }
      console.log('ゲストログイン成功:', data);
      // デフォルトカテゴリー挿入
      if (data.user) {
        try {
          await insertDefaultCategories(data.user.id);
        } catch (e) {
          setError('カテゴリー初期化に失敗しました');
        }
      }
      router.push('/');
    } catch (e) {
      console.error('予期せぬエラー:', e);
      setError('予期せぬエラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-5xl text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 select-none mb-4" style={{letterSpacing: '-0.03em'}}>マイリー家計簿</h1>
        <div className="relative mb-2">
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            自分に合った<span className="text-blue-600 font-semibold relative">
            家計管理スタイル</span>
            を作れる家計簿アプリ
          </p>
        </div>
        <p className="text-lg text-gray-500 max-w-3xl mx-auto mt-2">
          カレンダー・統計・資産管理・カテゴリ編集など、必要な機能だけONにして自由にカスタマイズ。
          シンプル＆直感的な操作で毎日続く家計簿アプリです。
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-12 py-8 px-4">
        {/* 左側：テキスト・フォーム・ボタン */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-8">
          <div>
            <span className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              ログイン
            </span>
          </div>
          <form onSubmit={handleSignIn} className="flex flex-col gap-4 w-full max-w-sm">
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
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </form>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto justify-center md:justify-start mt-4">
            <button onClick={() => router.push('/sign-up')} className="px-6 py-2 bg-white text-blue-600 font-bold border border-blue-600 rounded-lg shadow hover:bg-blue-50 transition">ユーザー登録</button>
            <button onClick={handleGuestLogin} className="px-6 py-2 bg-white text-gray-700 font-bold border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition">ゲストログイン</button>
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