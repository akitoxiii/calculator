'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar } from './Calendar';
import { ExpenseModal } from '../ExpenseModal';
import { ExpenseChart } from '../ExpenseChart';
import type { Expense, CategoryType } from '@/types/expense';
import { supabase } from '@/utils/supabase';
import { insertSampleData } from '@/utils/insertSampleData';
import { useCategories } from '@/hooks/useCategories';
import { storage } from '@/utils/storage';
import { useUser } from "@clerk/nextjs";
import type { Category } from '@/types/category';
import { format } from 'date-fns';
import { normalizeUUID } from '@/utils/uuid';

interface CalendarTabProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  expenses: Expense[];
  onExpenseDelete: (id: string) => void;
  onExpensesUpdate: (expenses: Expense[]) => void;
  onExpensesReload: () => Promise<void>;
  year: number;
  month: number;
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
}

export const CalendarTab = ({
  selectedDate: propSelectedDate,
  onDateSelect,
  expenses,
  onExpenseDelete,
  onExpensesUpdate,
  onExpensesReload,
  year,
  month,
  setYear,
  setMonth
}: CalendarTabProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(propSelectedDate);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { categories } = useCategories();
  const { isLoaded, isSignedIn, user } = useUser();

  // 年月の状態をpropsで管理
  const currentYear = year;
  const currentMonth = month;
  const setCurrentYear = setYear;
  const setCurrentMonth = setMonth;

  // 前後2年の範囲
  const today = new Date();
  const minYear = today.getFullYear() - 2;
  const maxYear = today.getFullYear() + 2;

  // 指定年月のカレンダー配列を生成
  const getCalendarMatrix = (year: number, month: number) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const firstDay = new Date(`${year}-${pad(month + 1)}-01T00:00:00`);
    const lastDay = new Date(year, month + 1, 0);
    const matrix: (Date | null)[][] = [];
    let week: (Date | null)[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) week.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      week.push(new Date(`${year}-${pad(month + 1)}-${pad(d)}T00:00:00`));
      if (week.length === 7) {
        matrix.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      matrix.push(week);
    }
    return matrix;
  };

  const calendarMatrix = getCalendarMatrix(currentYear, currentMonth);

  // 月送り
  const handlePrevMonth = () => {
    if (currentYear === minYear && currentMonth === 0) return;
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  const handleNextMonth = () => {
    if (currentYear === maxYear && currentMonth === 11) return;
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // 日付クリック
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const formatDate = (date: Date | string): Date => {
    try {
      if (typeof date === 'string') {
        const d = new Date(date + 'T00:00:00');
        if (isNaN(d.getTime())) {
          throw new Error('Invalid date format');
        }
        d.setHours(0, 0, 0, 0);
        return d;
      }
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    } catch (error) {
      console.error('Error formatting date:', error);
      return new Date();
    }
  };

  const isSameDay = (date1: Date | string, date2: Date | string): boolean => {
    const d1 = formatDate(date1);
    const d2 = formatDate(date2);
    return d1.getTime() === d2.getTime();
  };

  const isSameMonth = (date1: Date | string, date2: Date | string): boolean => {
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
        const normalizedSelectedDate = formatDate(selectedDate);
        
        const daily = expenses.filter(expense => {
          try {
            return isSameDay(expense.date, normalizedSelectedDate);
          } catch (error) {
            console.error('Error filtering daily expenses:', error);
            return false;
          }
        });

        const monthly = expenses.filter(expense => {
          try {
            return isSameMonth(expense.date, normalizedSelectedDate);
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

  const { daily: dailyExpenses, monthly: monthlyExpenses, monthlyTotal } = useFilteredExpenses(expenses, selectedDate);

  // categoriesを正規化し、ID重複を除去
  const normalizedCategories = useMemo(() => {
    const normalized = categories.map(cat => ({ ...cat, id: normalizeUUID(cat.id) }));
    // IDでユニーク化
    return Array.from(new Map(normalized.map(cat => [cat.id, cat])).values());
  }, [categories]);

  const handleExpenseSave = async (data: { amount: number; category_id: string; memo: string; type: CategoryType } | null) => {
    console.log('handleExpenseSave called', data);
    if (!isLoaded || !isSignedIn || !user || !data) return;
    try {
      const categoryObj: Category | undefined = normalizedCategories.find(cat => cat.id === data.category_id);
      console.log('保存時 user.id:', user.id);
      console.log('保存時 category_id:', data.category_id, '（型:', typeof data.category_id, '）');
      console.log('保存時 categoryObj:', categoryObj);
      if (!data.category_id) {
        alert('カテゴリーIDが指定されていません');
        return;
      }
      if (!categoryObj) {
        alert('カテゴリーが見つかりません');
        return;
      }
      // insert直前の値を出力
      const insertData = {
        user_id: user.id,
        category_id: data.category_id,
        amount: Number(data.amount),
        type: data.type,
        memo: data.memo,
        date: format(selectedDate, 'yyyy-MM-dd'),
      };
      console.log('insertData:', insertData, '（category_id型:', typeof insertData.category_id, '）');
      const { error, data: inserted } = await supabase.from('expenses').insert([
        insertData
      ]).select();
      if (error) {
        console.error('Error inserting expense:', error, insertData);
        alert('保存に失敗しました: ' + error.message);
        return;
      }
      const insertedExpense = Array.isArray(inserted) ? inserted[0] : null;
      if (!insertedExpense) {
        alert('保存後のデータ取得に失敗しました');
        return;
      }
      console.log('保存されたデータ:', insertedExpense);
      await onExpensesReload();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('保存時にエラーが発生しました');
    }
  };

  const handleExpenseDelete = async (id: string) => {
    try {
      if (!isLoaded || !isSignedIn || !user) return;
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) {
        console.error('Error deleting expense:', error);
        alert('削除に失敗しました: ' + error.message);
        return;
      }
      await onExpensesReload();
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('削除時にエラーが発生しました');
    }
  };

  console.log('Expenses summary:', {
    total: expenses.length,
    monthlyCount: monthlyExpenses.length,
    dailyCount: dailyExpenses.length,
    selectedDate: selectedDate.toISOString(),
    dailyExpenses,
    monthlyExpenses
  });

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>読み込み中...</div>
      </div>
    );
  }

  if (!isSignedIn || !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-gray-600 mb-4">ログインが必要です</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-full px-2">
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} disabled={currentYear === minYear && currentMonth === 0} className="px-2 py-1 rounded bg-gray-200">前月</button>
        <div className="text-lg font-semibold">{currentYear}年{currentMonth + 1}月</div>
        <button onClick={handleNextMonth} disabled={currentYear === maxYear && currentMonth === 11} className="px-2 py-1 rounded bg-gray-200">次月</button>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[600px] text-center">
          <thead>
            <tr>
              <th className="text-gray-500">日</th>
              <th className="text-gray-500">月</th>
              <th className="text-gray-500">火</th>
              <th className="text-gray-500">水</th>
              <th className="text-gray-500">木</th>
              <th className="text-gray-500">金</th>
              <th className="text-gray-500">土</th>
            </tr>
          </thead>
          <tbody>
            {calendarMatrix.map((week, i) => (
              <tr key={i}>
                {week.map((date, j) => (
                  <td key={j} className="h-16 align-top">
                    {date && (
                      <button
                        className={`w-10 h-10 rounded-full ${isSameDay(date, selectedDate) ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                        onClick={() => handleDayClick(date)}
                      >
                        {date.getDate()}
                      </button>
                    )}
                    {/* 支出・収入サマリー */}
                    {date && (
                      <div className="text-xs mt-1">
                        {(() => {
                          const dayExpenses = expenses.filter(e => isSameDay(e.date, date));
                          const totalExpense = dayExpenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
                          const totalIncome = dayExpenses.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
                          return (
                            <>
                              {totalExpense > 0 && <div className="text-red-500">-¥{totalExpense.toLocaleString()}</div>}
                              {totalIncome > 0 && <div className="text-green-500">+¥{totalIncome.toLocaleString()}</div>}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleExpenseSave}
        selectedDate={selectedDate}
        categories={normalizedCategories}
        dailyExpenses={dailyExpenses}
        onDelete={handleExpenseDelete}
      />
      <ExpenseChart
        expenses={expenses}
        year={currentYear}
        month={currentMonth}
        categories={normalizedCategories}
      />
    </div>
  );
};