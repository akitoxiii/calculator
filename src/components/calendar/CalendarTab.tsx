'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar } from './Calendar';
import { ExpenseModal } from '../ExpenseModal';
import { ExpenseChart } from '../ExpenseChart';
import type { Expense } from '@/types/expense';
import { supabase } from '@/utils/supabase';
import { insertSampleData } from '@/utils/insertSampleData';

export const CalendarTab = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        await fetchExpenses(user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | string): Date => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        throw new Error('Invalid date format');
      }
      d.setHours(0, 0, 0, 0);
      return d;
    } catch (error) {
      console.error('Error formatting date:', error);
      return new Date(); // デフォルト値として現在の日付を返す
    }
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    const d1 = formatDate(date1);
    const d2 = formatDate(date2);
    return d1.getTime() === d2.getTime();
  };

  const isSameMonth = (date1: Date, date2: Date): boolean => {
    const d1 = formatDate(date1);
    const d2 = formatDate(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth()
    );
  };

  const useFilteredExpenses = (expenses: Expense[], selectedDate: Date) => {
    return useMemo(() => {
      try {
        const daily = expenses.filter(expense => {
          try {
            return isSameDay(expense.date, selectedDate);
          } catch (error) {
            console.error('Error filtering daily expenses:', error);
            return false;
          }
        });

        const monthly = expenses.filter(expense => {
          try {
            return isSameMonth(expense.date, selectedDate);
          } catch (error) {
            console.error('Error filtering monthly expenses:', error);
            return false;
          }
        });
        
        const monthlyTotal = monthly.reduce((acc, expense) => {
          try {
            if (expense.type === 'expense') {
              acc.expense += expense.amount;
            } else {
              acc.income += expense.amount;
            }
            return acc;
          } catch (error) {
            console.error('Error calculating monthly total:', error);
            return acc;
          }
        }, { income: 0, expense: 0 });

        return {
          daily,
          monthly,
          monthlyTotal
        };
      } catch (error) {
        console.error('Error in useFilteredExpenses:', error);
        return {
          daily: [],
          monthly: [],
          monthlyTotal: { income: 0, expense: 0 }
        };
      }
    }, [expenses, selectedDate]);
  };

  const fetchExpenses = async (userId: string) => {
    try {
      setIsLoading(true);

      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId);

      if (expensesError) {
        console.error('Error fetching expenses:', expensesError);
        // エラー時のフォールバック処理
        const localExpenses = localStorage.getItem('expenses');
        if (localExpenses) {
          try {
            const parsedExpenses = JSON.parse(localExpenses);
            setExpenses(parsedExpenses);
          } catch (error) {
            console.error('Error parsing local expenses:', error);
          }
        }
        return;
      }

      if (expensesData && expensesData.length > 0) {
        const categoryIds = Array.from(new Set(expensesData.map(e => e.category_id)));
        const { data: categories, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .in('id', categoryIds);

        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
          return;
        }

        const categoryMap = categories?.reduce((acc, cat) => {
          acc[cat.id] = cat;
          return acc;
        }, {} as Record<string, any>) || {};

        const formattedExpenses: Expense[] = expensesData
          .map(expense => {
            try {
              return {
                id: expense.id,
                date: formatDate(expense.date),
                amount: expense.amount,
                category: categoryMap[expense.category_id]?.name || 'Unknown',
                type: expense.type,
                memo: expense.memo || undefined
              };
            } catch (error) {
              console.error('Error formatting expense:', error);
              return null;
            }
          })
          .filter((expense): expense is NonNullable<typeof expense> => expense !== null);

        setExpenses(formattedExpenses);
        // ローカルストレージにバックアップ
        try {
          localStorage.setItem('expenses', JSON.stringify(formattedExpenses));
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }
      } else {
        setExpenses([]);
      }
    } catch (error) {
      console.error('Error in fetchExpenses:', error);
      // エラー時のフォールバック処理
      const localExpenses = localStorage.getItem('expenses');
      if (localExpenses) {
        try {
          const parsedExpenses = JSON.parse(localExpenses);
          setExpenses(parsedExpenses);
        } catch (error) {
          console.error('Error parsing local expenses:', error);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const { daily: dailyExpenses, monthly: monthlyExpenses, monthlyTotal } = useFilteredExpenses(expenses, selectedDate);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleExpenseSave = async (data: { amount: number; category: string; memo: string; type: "income" | "expense" }) => {
    if (!user) return;

    try {
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', data.category)
        .single();

      if (categoryError || !categoryData) {
        console.error('Category error:', categoryError);
        return;
      }

      const { error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          category_id: categoryData.id,
          amount: data.amount,
          type: data.type,
          memo: data.memo,
          date: selectedDate.toISOString().split('T')[0]
        });

      if (error) {
        console.error('Error saving expense:', error);
        return;
      }

      await fetchExpenses(user.id);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleExpenseDelete = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      await fetchExpenses(user.id);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  // テスト用のモックデータを生成
  useEffect(() => {
    const generateMockData = async () => {
      if (!user) return;

      try {
        // カテゴリーを取得
        const { data: categories } = await supabase
          .from('categories')
          .select('*')
          .eq('user_id', user.id);

        if (!categories || categories.length === 0) return;

        // 1日から30日までのモックデータを生成
        const mockData = [];
        const currentMonth = new Date().getMonth();
        const mockCategories = categories.filter(cat => cat.type === 'expense');
        const amounts = [1000, 2000, 3000, 5000, 8000, 10000, 15000];

        for (let day = 1; day <= 30; day++) {
          const date = new Date(2024, currentMonth, day);
          const randomCategory = mockCategories[Math.floor(Math.random() * mockCategories.length)];
          const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];

          mockData.push({
            user_id: user.id,
            category_id: randomCategory.id,
            amount: randomAmount,
            type: 'expense',
            memo: `テストデータ ${day}日`,
            date: date.toISOString().split('T')[0]
          });
        }

        // 既存のデータを削除
        await supabase
          .from('expenses')
          .delete()
          .eq('user_id', user.id);

        // モックデータを挿入
        const { error } = await supabase
          .from('expenses')
          .insert(mockData);

        if (error) {
          console.error('Error inserting mock data:', error);
          return;
        }

        // データを再取得
        await fetchExpenses(user.id);
      } catch (error) {
        console.error('Error generating mock data:', error);
      }
    };

    generateMockData();
  }, [user]);

  console.log('Expenses summary:', {
    total: expenses.length,
    monthlyCount: monthlyExpenses.length,
    dailyCount: dailyExpenses.length,
    selectedDate: selectedDate.toISOString(),
    dailyExpenses,
    monthlyExpenses
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-gray-600 mb-4">ログインが必要です</p>
          <button
            onClick={checkUser}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <Calendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          収支を追加
        </button>

        {/* 月別サマリーを追加 */}
        <div className="mt-4 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">{selectedDate.getMonth() + 1}月の収支サマリー</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-green-600">月間収入</span>
              <span className="text-green-600">¥{monthlyTotal.income.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">月間支出</span>
              <span className="text-red-600">¥{monthlyTotal.expense.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>月間収支</span>
              <span className={monthlyTotal.income - monthlyTotal.expense >= 0 ? 'text-green-600' : 'text-red-600'}>
                ¥{(monthlyTotal.income - monthlyTotal.expense).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        {dailyExpenses.length > 0 && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">本日の収支</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-green-600">収入合計</span>
                <span className="text-green-600">
                  ¥{monthlyExpenses.filter((expense) => expense.type === 'income').reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">支出合計</span>
                <span className="text-red-600">
                  ¥{monthlyExpenses.filter((expense) => expense.type === 'expense').reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span>差引</span>
                <span
                  className={
                    monthlyExpenses.filter((expense) => expense.type === 'income').reduce((sum, expense) => sum + expense.amount, 0) -
                    monthlyExpenses.filter((expense) => expense.type === 'expense').reduce((sum, expense) => sum + expense.amount, 0) >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  ¥{(monthlyExpenses.filter((expense) => expense.type === 'income').reduce((sum, expense) => sum + expense.amount, 0) -
                    monthlyExpenses.filter((expense) => expense.type === 'expense').reduce((sum, expense) => sum + expense.amount, 0)).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">明細</h3>
              <div className="space-y-2">
                {dailyExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <span
                        className={`font-medium ${
                          expense.type === 'income'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {expense.category}
                      </span>
                      {expense.memo && (
                        <span className="text-gray-500 text-sm ml-2">
                          ({expense.memo})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${
                          expense.type === 'income'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        ¥{expense.amount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleExpenseDelete(expense.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <ExpenseChart selectedDate={selectedDate} expenses={monthlyExpenses} />
      </div>

      {isModalOpen && (
        <ExpenseModal
          date={selectedDate}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleExpenseSave}
        />
      )}
    </div>
  );
};