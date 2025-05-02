'use client';

import { useMemo } from 'react';
import { Chart } from 'chart.js/auto';
import { Pie } from 'react-chartjs-2';
import type { Expense } from '@/types/expense';

interface ExpenseChartProps {
  selectedDate: Date;
  expenses: Expense[];
}

export const ExpenseChart = ({ selectedDate, expenses }: ExpenseChartProps) => {
  const monthlyExpenses = useMemo(() => {
    return expenses.filter(
      (expense) =>
        expense.date.getFullYear() === selectedDate.getFullYear() &&
        expense.date.getMonth() === selectedDate.getMonth() &&
        expense.type === 'expense' // 支出のみを表示
    );
  }, [selectedDate, expenses]);

  const categoryData = useMemo(() => {
    return monthlyExpenses.reduce((acc, expense) => {
      if (expense.category) {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [monthlyExpenses]);

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
      <div className="aspect-square">
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