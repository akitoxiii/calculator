'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Expense, CategoryType } from '@/types/expense';
import { storage } from '@/utils/storage';
import { supabase } from '@/utils/supabase';
import { useCategories } from '@/hooks/useCategories';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// 動的インポートを使用してモーダルを遅延読み込み
const StatisticsTab = dynamic(() => import('../components/statistics/StatisticsTab'), { ssr: false });
const CategoryTab = dynamic(() => import('../components/category/CategoryTab').then(mod => mod.CategoryTab), { ssr: false });
const AssetsTab = dynamic(() => import('../components/assets/AssetsTab').then(mod => mod.AssetsTab), { ssr: false });
const CalendarTab = dynamic(() => import('../components/calendar/CalendarTab').then(mod => mod.CalendarTab), { ssr: false });

type TabType = 'calendar' | 'statistics' | 'category' | 'assets';

export default function Home() {
  // メンテナンスモードの場合は503エラーページを表示
  const isMaintenanceMode = false;
  if (isMaintenanceMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">503 Service Unavailable</h1>
          <p className="text-xl text-gray-600 mb-4">申し訳ありませんが、現在サービスを停止しております。</p>
          <p className="text-gray-500">メンテナンス作業が完了次第、サービスを再開いたします。</p>
        </div>
      </div>
    );
  }

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('calendar');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [, setShowSignIn] = useState(false);
  const [, setShowSignUp] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { categories } = useCategories();
  const router = useRouter();

  useEffect(() => {
    import('../instrumentation-client');
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        console.log('[DEBUG] Auth getUser result:', { data, error });
        setUser(data?.user ?? null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  console.log('[DEBUG] Current user state:', user);

  const fetchExpenses = useCallback(async () => {
    if (!user) {
      console.log('[DEBUG] fetchExpenses: user is null');
      return;
    }
    try {
      console.log('[DEBUG] fetchExpenses: fetching for user:', user.id);
      // supabaseから取得
      const { data } = await supabase.from('expenses').select('*').eq('user_id', user.id);
      const formattedExpenses = (data || []).map(expense => ({
        ...expense,
        date: expense.date
      }));
      setExpenses(formattedExpenses);
    } catch (error) {
      console.error('[DEBUG] fetchExpenses error:', error);
    }
  }, [user]);

  // 初回マウント時のみfetchExpensesを呼ぶ
  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user, fetchExpenses, activeTab]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleExpenseSubmit = async (data: { amount: number; category_id: string; memo: string; type: CategoryType } | null) => {
    console.log('[DEBUG] handleExpenseSubmit called with:', { user, data });
    
    if (!user || !data) {
      console.log('[DEBUG] handleExpenseSubmit: user or data is null', { user, data });
      alert('ユーザー情報が取得できていません。再度ログインしてください。');
      return;
    }

    if (!user.id) {
      console.log('[DEBUG] handleExpenseSubmit: user.id is empty', { user });
      alert('ユーザーIDが不正です。');
      return;
    }

    const categoryObj = categories.find(cat => cat.id === data.category_id);
    if (!categoryObj) {
      console.log('[DEBUG] handleExpenseSubmit: category not found', { category_id: data.category_id, categories });
      alert('カテゴリーが見つかりません');
      return;
    }

    const insertData = {
      user_id: user.id,
      category_id: categoryObj.id,
      amount: data.amount,
      type: data.type,
      memo: data.memo,
      date: format(selectedDate, 'yyyy-MM-dd'),
    };
    console.log('[DEBUG] handleExpenseSubmit: inserting data:', insertData);

    const { error } = await supabase.from('expenses').insert([insertData]);
    if (error) {
      console.error('[DEBUG] handleExpenseSubmit: insert error:', error);
      alert('保存に失敗しました: ' + error.message);
      return;
    }
    console.log('[DEBUG] handleExpenseSubmit: insert successful');
    await fetchExpenses();
  };

  const handleExpenseDelete = async (id: string) => {
    if (!user) return;
    const { error } = await supabase.from('expenses').delete().eq('id', id).eq('user_id', user.id);
    if (error) {
      alert('削除に失敗しました: ' + error.message);
      return;
    }
    await fetchExpenses();
  };

  const getDailyExpenses = (date: Date) => {
    const target = format(date, 'yyyy-MM-dd');
    return expenses.filter(
      (expense) => expense.date === target
    );
  };

  const dailyExpenses = getDailyExpenses(selectedDate);
  const totalIncome = dailyExpenses
    .filter((expense) => expense.type === 'income')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const totalExpense = dailyExpenses
    .filter((expense) => expense.type === 'expense')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const handleExpensesUpdate = (_updatedExpenses: Expense[]) => {
    fetchExpenses();
  };

  const getDefaultCategoryId = (type: CategoryType) => {
    if (categories.length === 0) return '';
    if (type === 'income') {
      const other = categories.find(cat => cat.type === 'income' && (cat.name.includes('その他') || cat.name.includes('未分類')));
      if (other) return other.id;
      const firstIncome = categories.find(cat => cat.type === 'income');
      if (firstIncome) return firstIncome.id;
    } else {
      const other = categories.find(cat => cat.type === 'expense' && (cat.name.includes('その他') || cat.name.includes('未分類')));
      if (other) return other.id;
      const firstExpense = categories.find(cat => cat.type === 'expense');
      if (firstExpense) return firstExpense.id;
    }
    return categories[0].id; // どれもなければ最初
  };

  const convertTransactionToExpense = (tx: any): Expense => {
    const type: CategoryType = tx.type === '収入' ? 'income' : 'expense';
    return {
      id: tx.id,
      user_id: '',
      category_id: tx.category_id ? tx.category_id : getDefaultCategoryId(type),
      amount: tx.amount,
      type,
      memo: tx.note || '',
      date: typeof tx.date === 'string' ? tx.date : format(tx.date, 'yyyy-MM-dd'),
    };
  };

  useEffect(() => {
    const transactions = storage.getTransactions();
    const txExpenses = transactions.map(convertTransactionToExpense);
    setExpenses(prev => {
      const all = [...prev, ...txExpenses];
      const unique = Array.from(new Map(all.map(e => [e.id, e])).values());
      return unique;
    });
  }, [activeTab, categories]);

  // ゲストログイン処理
  const handleGuestLogin = () => {
    setIsGuest(true);
    setShowSignIn(false);
    setShowSignUp(false);
  };

  // 未ログインかつゲストでない場合は/sign-inへリダイレクト
  useEffect(() => {
    if (!user && !isGuest && !isLoading) {
      router.push('/sign-in');
    }
  }, [user, isGuest, isLoading, router]);

  if ((!user) && !isGuest) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  }

  // ゲストモード時のUI
  if (isGuest) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="w-full flex justify-end items-center px-4 py-2">
          <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded font-bold">ゲストモード</span>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-2 rounded ${
                activeTab === 'calendar'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              カレンダー
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`px-4 py-2 rounded ${
                activeTab === 'statistics'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              統計
            </button>
            <button
              onClick={() => setActiveTab('category')}
              className={`px-4 py-2 rounded ${
                activeTab === 'category'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              カテゴリー
            </button>
            <button
              onClick={() => setActiveTab('assets')}
              className={`px-4 py-2 rounded ${
                activeTab === 'assets'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              資産
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ログイン済みユーザー用のトップページUI
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full flex justify-end items-center px-4 py-2">
        <span className="px-4 py-2 bg-green-100 text-green-800 rounded font-bold">ログイン中</span>
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded ${activeTab === 'calendar' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
          >
            カレンダー
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`px-4 py-2 rounded ${activeTab === 'statistics' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
          >
            統計
          </button>
          <button
            onClick={() => setActiveTab('category')}
            className={`px-4 py-2 rounded ${activeTab === 'category' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
          >
            カテゴリー
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-4 py-2 rounded ${activeTab === 'assets' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
          >
            資産
          </button>
        </div>
        {/* タブごとのコンテンツ表示 */}
        {activeTab === 'calendar' && (
          <CalendarTab
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            expenses={expenses}
            onExpenseDelete={handleExpenseDelete}
            onExpensesUpdate={handleExpensesUpdate}
            onExpensesReload={fetchExpenses}
            year={selectedYear}
            month={selectedMonth}
            setYear={setSelectedYear}
            setMonth={setSelectedMonth}
            user_id={user?.id || ''}
          />
        )}
        {activeTab === 'statistics' && (
          <StatisticsTab
            expenses={expenses}
            year={selectedYear}
            month={selectedMonth}
            setYear={setSelectedYear}
            setMonth={setSelectedMonth}
          />
        )}
        {activeTab === 'category' && <CategoryTab />}
        {activeTab === 'assets' && <AssetsTab />}
      </div>
    </div>
  );
}