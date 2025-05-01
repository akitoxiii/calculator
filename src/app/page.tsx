'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { ExpenseModal } from '@/components/ExpenseModal';
import { AssetsTab } from '@/components/assets/AssetsTab';
import type { Expense } from '@/types/expense';
import { storage } from '@/utils/storage';
import { CalendarTab } from '@/components/calendar/CalendarTab';
import StatisticsTab from '@/components/statistics/StatisticsTab';
import { CategoryTab } from '@/components/category/CategoryTab';
import { ResetPassword } from '@/components/auth/ResetPassword';
import { insertSampleData } from '@/utils/insertSampleData';

type TabType = 'calendar' | 'statistics' | 'category' | 'assets';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('calendar');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      console.log('ユーザーチェックを開始...');
      const { data: { user } } = await supabase.auth.getUser();
      console.log('取得したユーザー情報:', user);
      
      setUser(user);
      if (user) {
        // ユーザーが存在する場合、カテゴリーの存在チェック
        console.log('カテゴリーの存在チェックを開始...');
        const { data: categories, error } = await supabase
          .from('categories')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        if (error) {
          console.error('カテゴリー取得エラー:', error);
          return;
        }

        console.log('既存のカテゴリー:', categories);

        // カテゴリーが存在しない場合、サンプルデータを挿入
        if (!categories || categories.length === 0) {
          console.log('カテゴリーが存在しないため、サンプルデータを挿入します...');
          try {
            await insertSampleData();
            console.log('サンプルデータの挿入が完了しました');
            // サンプルデータ挿入後に画面をリロード
            window.location.reload();
          } catch (error) {
            console.error('サンプルデータの挿入に失敗しました:', error);
          }
        } else {
          console.log('カテゴリーが既に存在するため、サンプルデータは挿入しません');
        }
      } else {
        console.log('ユーザーが見つかりません');
      }
    } catch (error) {
      console.error('ユーザーチェックエラー:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('ログイン処理を開始...');

      if (!email || !password) {
        alert('メールアドレスとパスワードを入力してください。');
        return;
      }

      console.log('ログイン試行:', { email });

      // セッションの確認
      const { data: { session: existingSession } } = await supabase.auth.getSession();
      if (existingSession) {
        await supabase.auth.signOut();
      }

      // ログイン処理
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (error) {
        console.error('ログインエラー:', error);
        if (error.message === 'Invalid login credentials') {
          alert('メールアドレスまたはパスワードが正しくありません。');
        } else {
          alert(`ログインエラー: ${error.message}`);
        }
        return;
      }

      if (!session || !session.user) {
        console.error('セッションデータが取得できません');
        alert('ログインに失敗しました。再度お試しください。');
        return;
      }

      console.log('ログイン成功:', session.user);
      setUser(session.user);

      try {
        // カテゴリーの存在チェック
        console.log('カテゴリーの存在チェックを開始...');
        const { data: categories, error: categoryError } = await supabase
          .from('categories')
          .select('id')
          .eq('user_id', session.user.id)
          .limit(1);

        if (categoryError) {
          console.error('カテゴリー取得エラー:', categoryError);
          return;
        }

        // カテゴリーが存在しない場合、サンプルデータを挿入
        if (!categories || categories.length === 0) {
          console.log('カテゴリーが存在しないため、サンプルデータを挿入します...');
          await insertSampleData();
          console.log('サンプルデータの挿入が完了しました');
        }

        // セッションの永続化を確認
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession) {
          // ページをリロード
          window.location.href = '/';
        } else {
          throw new Error('セッションが失われました');
        }
      } catch (error) {
        console.error('データ初期化エラー:', error);
        alert('初期設定中にエラーが発生しました。ページをリロードしてください。');
      }
    } catch (error) {
      console.error('予期せぬエラー:', error);
      alert('予期せぬエラーが発生しました。');
    }
  };

  const handleSignUp = async () => {
    try {
      // ローカルストレージをクリア
      localStorage.clear();
      
      if (!email || !password) {
        alert('メールアドレスとパスワードを入力してください。');
        return;
      }

      console.log('Attempting signup with:', { email });

      // セッションを明示的にクリア
      await supabase.auth.signOut();

      // サインアップ処理
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            email: email.trim(),
          }
        }
      });

      if (signUpError) {
        console.error('Error signing up:', signUpError);
        if (signUpError.message.includes('already registered')) {
          alert('このメールアドレスは既に登録されています。');
        } else {
          alert(`アカウント作成中にエラーが発生しました: ${signUpError.message}`);
        }
        return;
      }

      if (!signUpData.user) {
        console.error('No user data received after sign up');
        alert('アカウント作成に失敗しました。');
        return;
      }

      console.log('Sign up successful:', signUpData.user);
      alert('アカウントが作成されました。ログインしてください。');
      setEmail('');
      setPassword('');
      
      // 画面をリロード
      window.location.reload();
      return;

    } catch (error) {
      console.error('Unexpected error:', error);
      alert('予期せぬエラーが発生しました。');
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleExpenseSubmit = (data: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      date: selectedDate,
      ...data,
    };
    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    storage.saveExpenses(updatedExpenses);
  };

  const handleExpenseDelete = (id: string) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(updatedExpenses);
    storage.saveExpenses(updatedExpenses);
  };

  const getDailyExpenses = (date: Date) => {
    return expenses.filter(
      (expense) =>
        expense.date.getFullYear() === date.getFullYear() &&
        expense.date.getMonth() === date.getMonth() &&
        expense.date.getDate() === date.getDate()
    );
  };

  const dailyExpenses = getDailyExpenses(selectedDate);
  const totalIncome = dailyExpenses
    .filter((expense) => expense.type === 'income')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const totalExpense = dailyExpenses
    .filter((expense) => expense.type === 'expense')
    .reduce((sum, expense) => sum + expense.amount, 0);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold text-center mb-8">家計簿アプリ</h1>
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowResetPassword(true)}
                className="text-sm text-primary hover:text-primary/80 mt-1"
              >
                パスワードをお忘れの方
              </button>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              ログイン
            </button>
          </form>
          <div className="mt-4 pt-4 border-t">
            <button
              onClick={handleSignUp}
              className="w-full px-4 py-2 text-primary border border-primary rounded hover:bg-primary/10"
            >
              新規登録
            </button>
          </div>
        </div>
        {showResetPassword && (
          <ResetPassword onClose={() => setShowResetPassword(false)} />
        )}
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Calculator App</h1>
    </main>
  );
} 