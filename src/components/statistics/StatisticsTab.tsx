'use client';

import { useState, useEffect } from 'react';
import { format, setMonth, getYear, setYear } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { Expense } from '@/types/expense';
import { useCategories } from '@/hooks/useCategories';
import { normalizeUUID } from '@/utils/uuid';
import dynamic from 'next/dynamic';

// Chart.jsのコンポーネントを動的インポート
const Pie = dynamic(() => import('react-chartjs-2').then(mod => mod.Pie), { ssr: false });
const Bar = dynamic(() => import('react-chartjs-2').then(mod => mod.Bar), { ssr: false });

// Chart.jsの登録を動的インポート内で行う
useEffect(() => {
  const registerChart = async () => {
    const { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } = await import('chart.js');
    Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
  };
  registerChart();
}, []);

const MONTHS = [
  { value: 0, label: '1月' },
  { value: 1, label: '2月' },
  { value: 2, label: '3月' },
  { value: 3, label: '4月' },
  { value: 4, label: '5月' },
  { value: 5, label: '6月' },
  { value: 6, label: '7月' },
  { value: 7, label: '8月' },
  { value: 8, label: '9月' },
  { value: 9, label: '10月' },
  { value: 10, label: '11月' },
  { value: 11, label: '12月' },
];

interface StatisticsTabProps {
  expenses: Expense[];
  year: number;
  month: number;
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
}

export default function StatisticsTab({ expenses, year, month, setYear, setMonth }: StatisticsTabProps) {
  const { categories } = useCategories();
  const currentYear = new Date().getFullYear();
  const [localExpenses, setLocalExpenses] = useState<Expense[]>(expenses);

  // 受け取ったexpensesのdateを必ずDate型に変換
  const normalizedExpenses = expenses.map(expense => ({
    ...expense,
    date: typeof expense.date === 'string' ? new Date(expense.date) : expense.date,
  }));

  // 月間支出データのみ抽出
  const monthlyExpenses = normalizedExpenses.filter(expense => {
    const d = expense.date;
    return (
      expense.type === 'expense' &&
      d.getFullYear() === year &&
      d.getMonth() === month
    );
  });

  const categoryData = monthlyExpenses.reduce((acc, expense) => {
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

  const pieData = {
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
        ],
      },
    ],
  };

  const monthlyData = monthlyExpenses.reduce((acc, expense) => {
    const month = format(expense.date, 'yyyy-MM');
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const barData = {
    labels: Object.keys(monthlyData).map(month => 
      format(new Date(month), 'yyyy年MM月')
    ),
    datasets: [
      {
        label: '月別支出',
        data: Object.values(monthlyData),
        backgroundColor: '#36A2EB',
      },
    ],
  };

  const handleExpenseSave = (data: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      date: format(new Date(), 'yyyy-MM-dd'),
      ...data,
    };
    setLocalExpenses([...localExpenses, newExpense]);
    // 必要に応じてlocalStorage等にも保存
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end gap-4">
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="p-2 border rounded"
        >
          {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map((yearOption) => (
            <option key={yearOption} value={yearOption}>
              {yearOption}年
            </option>
          ))}
        </select>
        <select
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
          className="p-2 border rounded"
        >
          {MONTHS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">カテゴリ別支出</h3>
          <div className="aspect-square">
            <Pie data={pieData} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">月別支出推移</h3>
          <div className="aspect-[4/3]">
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">支出サマリー</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">総支出</div>
            <div className="text-2xl font-bold">
              ¥{monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">平均支出（日）</div>
            <div className="text-2xl font-bold">
              ¥{Math.round(
                monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0) / 
                (monthlyExpenses.length || 1)
              ).toLocaleString()}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">最大支出カテゴリ</div>
            <div className="text-2xl font-bold">
              {Object.entries(categoryData).sort(([,a], [,b]) => b - a)[0]?.[0] || '-'}
            </div>
          </div>
        </div>
      </div>

      {/* <DailyExpenseForm
        date={new Date()}
        onSubmit={handleExpenseSave}
        categories={categories}
      /> */}
    </div>
  );
} 