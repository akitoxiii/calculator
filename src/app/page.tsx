'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Expense, CategoryType } from '@/types/expense';
import { storage } from '@/utils/storage';
import { supabase } from '@/utils/supabase';
import { useCategories } from '@/hooks/useCategories';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import CookieConsent from '../components/CookieConsent';
import { Inter } from 'next/font/google';
import { CalendarIcon, ChartBarIcon, Cog6ToothIcon, BanknotesIcon, UserPlusIcon, ArrowRightOnRectangleIcon, UserIcon } from '@heroicons/react/24/outline';
import { Toast } from '../components/Toast';

const inter = Inter({ subsets: ['latin'] });

// 動的インポートを使用してモーダルを遅延読み込み
const StatisticsTab = dynamic(() => import('../components/statistics/StatisticsTab'), { ssr: false });
const CategoryTab = dynamic(() => import('../components/category/CategoryTab').then(mod => mod.CategoryTab), { ssr: false });
const AssetsTab = dynamic(() => import('../components/AssetsTab').then(mod => mod.AssetsTab), { ssr: false });
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
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);
  const [activeForm, setActiveForm] = useState<'login' | 'signup' | null>(null);

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
      showToast('ユーザー情報が取得できていません。再度ログインしてください。', 'error');
      return;
    }

    if (!user.id) {
      console.log('[DEBUG] handleExpenseSubmit: user.id is empty', { user });
      showToast('ユーザーIDが不正です。', 'error');
      return;
    }

    const categoryObj = categories.find(cat => cat.id === data.category_id);
    if (!categoryObj) {
      console.log('[DEBUG] handleExpenseSubmit: category not found', { category_id: data.category_id, categories });
      showToast('カテゴリーが見つかりません', 'error');
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
      showToast('保存に失敗しました: ' + error.message, 'error');
      return;
    }
    console.log('[DEBUG] handleExpenseSubmit: insert successful');
    await fetchExpenses();
  };

  const handleExpenseDelete = async (id: string) => {
    if (!user) return;
    const { error } = await supabase.from('expenses').delete().eq('id', id).eq('user_id', user.id);
    if (error) {
      showToast('削除に失敗しました: ' + error.message, 'error');
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

  // ログアウト処理
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/sign-in');
  };

  const showToast = (message: string, type?: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  // スケルトンスクリーン
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-2xl mx-auto p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-40 bg-gray-200 rounded mb-4" />
            <div className="h-10 bg-gray-200 rounded w-full mb-2" />
            <div className="h-10 bg-gray-200 rounded w-full mb-2" />
            <div className="h-10 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  // ゲストモード時のUI
  if (isGuest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl gap-12 py-16 px-4">
          {/* 左側：テキスト・ボタン */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4 mb-2">マイリー家計簿！</h1>
            <div>
              <span className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                自分に合った <span className="text-blue-500">家計管理スタイル</span> を作れる<br />家計簿アプリ
              </span>
            </div>
            <p className="text-base md:text-lg text-gray-700 font-medium mb-2">
              カレンダー・統計・資産管理・カテゴリ編集など、<br />必要な機能だけONにして自由にカスタマイズ。<br />シンプル＆直感的な操作で毎日続く！
            </p>
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto justify-center md:justify-start">
              <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition w-full md:w-auto">ユーザー登録</button>
              <button className="px-6 py-3 bg-white text-blue-600 font-bold border border-blue-600 rounded-lg shadow hover:bg-blue-50 transition w-full md:w-auto">ログイン</button>
              <button className="px-6 py-3 bg-white text-gray-700 font-bold border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition w-full md:w-auto">ゲストログイン</button>
            </div>
            <a href="#" className="text-blue-500 underline text-sm mt-2">お問い合わせ</a>
          </div>
          {/* 右側：イラスト画像 */}
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow p-8 flex items-center justify-center">
              <img src="/kakeibo-illust.png" alt="家計簿アプリイラスト" className="w-64 h-auto transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl cursor-pointer" />
            </div>
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
        <button
          onClick={handleLogout}
          className="ml-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          ログアウト
        </button>
      </header>
      <div className="container mx-auto px-4 py-8">
        {/* タブUI */}
        <div className="flex space-x-4 mb-8 overflow-x-auto scrollbar-hide border-b border-gray-200">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold text-lg transition ${activeTab === 'calendar' ? 'bg-white text-primary border-b-4 border-primary shadow-inner' : 'text-gray-700 hover:bg-gray-100 hover:text-primary'}`}
          >
            <CalendarIcon className={`h-6 w-6 ${activeTab === 'calendar' ? 'text-primary' : 'text-gray-500'}`} /> カレンダー
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold text-lg transition ${activeTab === 'statistics' ? 'bg-white text-primary border-b-4 border-primary shadow-inner' : 'text-gray-700 hover:bg-gray-100 hover:text-primary'}`}
          >
            <ChartBarIcon className={`h-6 w-6 ${activeTab === 'statistics' ? 'text-primary' : 'text-gray-500'}`} /> 統計
          </button>
          <button
            onClick={() => setActiveTab('category')}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold text-lg transition ${activeTab === 'category' ? 'bg-white text-primary border-b-4 border-primary shadow-inner' : 'text-gray-700 hover:bg-gray-100 hover:text-primary'}`}
          >
            <Cog6ToothIcon className={`h-6 w-6 ${activeTab === 'category' ? 'text-primary' : 'text-gray-500'}`} /> カテゴリー
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-bold text-lg transition ${activeTab === 'assets' ? 'bg-white text-primary border-b-4 border-primary shadow-inner' : 'text-gray-700 hover:bg-gray-100 hover:text-primary'}`}
          >
            <BanknotesIcon className={`h-6 w-6 ${activeTab === 'assets' ? 'text-primary' : 'text-gray-500'}`} /> 資産
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
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <div className="mt-auto w-full">
        <CookieConsent />
        <footer className="w-full text-center text-xs text-gray-500 py-4 flex flex-col md:flex-row items-center justify-center gap-4">
          <a href="/privacy-policy" className="underline hover:text-primary">プライバシーポリシー</a>
          <span className="hidden md:inline">|</span>
          <a href="/contact" className="underline hover:text-primary">お問い合わせ</a>
        </footer>
      </div>
    </div>
  );
}