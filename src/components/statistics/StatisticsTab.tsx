'use client';

import { useState } from 'react';
import { format, setMonth, getYear, setYear } from 'date-fns';
import { ja } from 'date-fns/locale';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import type { Expense } from '../household/HouseholdTab';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

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

export default function StatisticsTab() {
  const currentYear = getYear(new Date());
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [expenses] = useState<Expense[]>([]); // 実際にはpropsまたはグローバルステートから取得

  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return (
      getYear(expenseDate) === selectedYear &&
      expenseDate.getMonth() === selectedMonth
    );
  });

  const categoryData = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
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

  const monthlyData = filteredExpenses.reduce((acc, expense) => {
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

  return (
    <div className="space-y-8">
      <div className="flex justify-end gap-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="p-2 border rounded"
        >
          {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map((year) => (
            <option key={year} value={year}>
              {year}年
            </option>
          ))}
        </select>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
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
              ¥{filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">平均支出（日）</div>
            <div className="text-2xl font-bold">
              ¥{Math.round(
                filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0) / 
                (filteredExpenses.length || 1)
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
    </div>
  );
} 