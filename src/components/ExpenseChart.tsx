'use client';

import { useMemo, useEffect } from 'react';
import type { Expense } from '@/types/expense';
import { useCategories } from '@/hooks/useCategories';
import { normalizeUUID } from '@/utils/uuid';
import dynamic from 'next/dynamic';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

// Chart.jsのコンポーネントを動的インポート
const Pie = dynamic(() => import('react-chartjs-2').then(mod => mod.Pie), { ssr: false });

interface ExpenseChartProps {
  expenses: Expense[];
  year: number;
  month: number;
  categories: { id: string; name: string; type: string; user_id: string; color: string }[];
}

export const ExpenseChart = ({ expenses, year, month, categories }: ExpenseChartProps) => {
  const monthlyExpenses = useMemo(() => {
    return expenses.filter(
      (expense) => {
        const d = typeof expense.date === 'string'
          ? new Date(expense.date + 'T00:00:00')
          : new Date(expense.date);
        return (
          d.getFullYear() === year &&
          d.getMonth() === month &&
          expense.type === 'expense'
        );
      }
    );
  }, [expenses, year, month]);

  const categoryData = useMemo(() => {
    return monthlyExpenses.reduce((acc, expense) => {
      const category = categories.find(cat => normalizeUUID(cat.id) === normalizeUUID(expense.category_id));
      let categoryName = '';
      if (category) {
        categoryName = category.name;
      } else if (!expense.category_id) {
        categoryName = '未分類';
      } else {
        categoryName = `ID不一致(${expense.category_id})`;
      }
      acc[categoryName] = (acc[categoryName] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
  }, [monthlyExpenses, categories]);

  const data = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#2ECC71',
          '#E74C3C',
          '#9B59B6',
          '#F1C40F',
        ],
      },
    ],
  };

  const totalExpense = Object.values(categoryData).reduce((a, b) => a + b, 0);

  if (monthlyExpenses.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">カテゴリー別支出グラフ（月間）</h3>
        <div className="text-center text-gray-500 py-8">
          この月の支出データはありません
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">カテゴリー別支出グラフ（月間）</h3>
      <div className="text-xl font-bold text-gray-900 mb-4">
        月間総支出: ¥{totalExpense.toLocaleString()}
      </div>
      <div className="aspect-square max-w-xs mx-auto">
        <Pie
          data={data}
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  label: (tooltipItem: any) => {
                    const value = tooltipItem.raw as number;
                    const percentage = ((value / totalExpense) * 100).toFixed(1);
                    return `¥${value.toLocaleString()} (${percentage}%)`;
                  },
                },
              },
              legend: {
                position: 'bottom',
                labels: {
                  boxWidth: 12,
                  padding: 15
                }
              }
            },
          }}
        />
      </div>
    </div>
  );
}; 