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
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (user) {
          const { data: categories } = await supabase
            .from('categories')
            .select('id')
            .eq('user_id', user.id)
            .limit(1);

          if (!categories || categories.length === 0) {
            await insertSampleData();
            window.location.reload();
          }
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('メールアドレスとパスワードを入力してください。');
      return;
    }

    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (error) {
        alert(error.message === 'Invalid login credentials' 
          ? 'メールアドレスまたはパスワードが正しくありません。'
          : `ログインエラー: ${error.message}`);
        return;
      }

      if (session?.user) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('ログインに失敗しました。');
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      alert('メールアドレスとパスワードを入力してください。');
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim()
      });

      if (error) {
        alert(error.message.includes('already registered')
          ? 'このメールアドレスは既に登録されています。'
          : `アカウント作成中にエラーが発生しました: ${error.message}`);
        return;
      }

      alert('アカウントが作成されました。ログインしてください。');
      setEmail('');
      setPassword('');
      window.location.reload();
    } catch (error) {
      console.error('Signup error:', error);
      alert('アカウント作成に失敗しました。');
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