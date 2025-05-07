'use client';

import { useState, useEffect, useCallback } from 'react';
import { ExpenseModal } from '@/components/ExpenseModal';
import { AssetsTab } from '@/components/assets/AssetsTab';
import type { Expense, CategoryType } from '@/types/expense';
import { storage } from '@/utils/storage';
import { supabase } from '@/utils/supabase';
import { CalendarTab } from '@/components/calendar/CalendarTab';
import StatisticsTab from '@/components/statistics/StatisticsTab';
import { CategoryTab } from '@/components/category/CategoryTab';
import { useUser, useAuth, SignIn, SignUp, useSignIn, useClerk } from '@clerk/nextjs';
import { useCategories } from '@/hooks/useCategories';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';

// 動的インポートを使用してモーダルを遅延読み込み
const SignInModal = dynamic(() => import('../components/SignInModal'), { ssr: false });
const SignUpModal = dynamic(() => import('../components/SignUpModal'), { ssr: false });

type TabType = 'calendar' | 'statistics' | 'category' | 'assets';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('calendar');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const { isLoaded, isSignedIn, user } = useUser();
  const { categories } = useCategories();
  const { getToken } = useAuth();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signOut } = useClerk();

  console.log({ isLoaded, isSignedIn, user });

  const fetchExpenses = useCallback(async () => {
    if (!isLoaded || !isSignedIn || !user) return;
    try {
      // supabaseから取得
      const { data } = await supabase.from('expenses').select('*').eq('user_id', user.id);
      const formattedExpenses = (data || []).map(expense => ({
        ...expense,
        date: expense.date
      }));
      // storageの取引もExpense型に変換してマージ
      const transactions = storage.getTransactions();
      const txExpenses = transactions.map(convertTransactionToExpense);
      // idでユニーク化
      const all = [...formattedExpenses, ...txExpenses];
      const unique = Array.from(new Map(all.map(e => [e.id, e])).values());
      setExpenses(unique);
    } catch (error) {
      console.error('fetchExpensesエラー:', error);
    }
  }, [isLoaded, isSignedIn, user, categories]);

  // 初回マウント時のみfetchExpensesを呼ぶ
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      fetchExpenses();
    }
  }, [isLoaded, isSignedIn, user, fetchExpenses, activeTab]);

  useEffect(() => {
    const updateSession = async () => {
      try {
        const token = await getToken();
        if (token) {
          const { error } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: token
          });
          if (error) {
            console.error('Error setting session:', error);
          }
        }
      } catch (error) {
        console.error('Error updating session:', error);
      }
    };
    updateSession();
  }, [getToken]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleExpenseSubmit = async (data: { amount: number; category_id: string; memo: string; type: CategoryType } | null) => {
    if (!user || !data) return;
    const categoryObj = categories.find(cat => cat.id === data.category_id);
    if (!categoryObj) {
      alert('カテゴリーが見つかりません');
      return;
    }
    console.log('handleExpenseSubmit insert payload:', {
      user_id: user.id,
      category_id: categoryObj.id,
      amount: data.amount,
      type: data.type,
      memo: data.memo,
      date: format(selectedDate, 'yyyy-MM-dd'),
    });
    const { error } = await supabase.from('expenses').insert([
      {
        user_id: user.id,
        category_id: categoryObj.id,
        amount: data.amount,
        type: data.type,
        memo: data.memo,
        date: format(selectedDate, 'yyyy-MM-dd'),
      }
    ]);
    if (error) {
      alert('保存に失敗しました: ' + error.message);
      return;
    }
    await fetchExpenses();
    setIsModalOpen(false);
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

  // 未ログインかつゲストでない場合はLPを表示
  if ((!isSignedIn || !user) && !isGuest) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-2 sm:px-4">
        <header className="w-full max-w-3xl mx-auto py-6 flex justify-center md:justify-between items-center">
          <div className="text-2xl font-bold">マイリー家計簿!</div>
        </header>
        <main className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl gap-8 md:gap-12 py-4 md:py-8">
          {/* 左：説明 */}
          <div className="flex-1 w-full max-w-lg space-y-6 text-center md:text-left mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              自分に合った <span className="text-primary">家計管理スタイル</span> を作れる<br className="hidden md:block" />家計簿アプリ
            </h1>
            <p className="text-base sm:text-lg text-gray-700 mb-4">
              カレンダー・統計・資産管理・カテゴリ編集など、<br className="hidden sm:block" />必要な機能だけONにして自由にカスタマイズ。<br className="hidden sm:block" />シンプル＆直感的な操作で毎日続く！
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start w-full">
              <button
                className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 rounded bg-primary text-white font-semibold hover:bg-primary/90 text-base shadow-md"
                onClick={() => setShowSignUp(true)}
              >
                ユーザー登録
              </button>
              <button
                className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 rounded border-2 border-primary text-primary font-semibold hover:bg-primary/10 text-base shadow-md"
                onClick={() => setShowSignIn(true)}
              >
                ログイン
              </button>
              <button
                className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 rounded border-2 border-gray-600 text-gray-800 font-semibold hover:bg-gray-100 text-base shadow-md"
                onClick={handleGuestLogin}
              >
                ゲストログイン
              </button>
            </div>
          </div>
          {/* 右：スマホUIイメージ */}
          <div className="flex-1 flex justify-center w-full max-w-xs mx-auto mt-8 md:mt-0">
            <img
              src="/lp-demo-mobile.webp"
              alt="家計簿アプリのスマホUIイメージ"
              className="w-full max-w-xs h-auto rounded-xl shadow-lg border"
              style={{ background: '#fff' }}
              width={375}
              height={812}
              loading="eager"
            />
          </div>
        </main>
        {/* SignIn/SignUpモーダル */}
        {showSignIn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-md mx-auto">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowSignIn(false)}>&times;</button>
              <SignIn afterSignInUrl="/" />
            </div>
          </div>
        )}
        {showSignUp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-md mx-auto">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowSignUp(false)}>&times;</button>
              <SignUp afterSignUpUrl="/" />
            </div>
          </div>
        )}
      </div>
    );
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
          {/* 各タブの中身はローカルストレージのみで動作するように、今後修正 */}
          {activeTab === 'calendar' && (
            <CalendarTab
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              expenses={expenses}
              onExpenseDelete={async () => {}}
              onExpensesUpdate={() => {}}
              onExpensesReload={async () => {}}
              year={selectedYear}
              month={selectedMonth}
              setYear={setSelectedYear}
              setMonth={setSelectedMonth}
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
          <ExpenseModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={async () => {}}
            selectedDate={selectedDate}
            categories={categories}
            dailyExpenses={[]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full flex justify-end items-center px-4 py-2">
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          ログアウト
        </button>
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

        <ExpenseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleExpenseSubmit}
          selectedDate={selectedDate}
          categories={categories}
          dailyExpenses={dailyExpenses}
        />
      </div>
    </div>
  );
} 