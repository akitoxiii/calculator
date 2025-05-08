import { useState } from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Expense } from '@/types/expense';

interface StatisticsProps {
  selectedDate: Date;
  expenses: Expense[];
}

export const Statistics = ({ selectedDate, expenses }: StatisticsProps) => {
  const [period, setPeriod] = useState<'month' | 'year'>('month');

  const getMonthlyData = () => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    
    const startStr = format(start, 'yyyy-MM-dd');
    const endStr = format(end, 'yyyy-MM-dd');
    return expenses.filter(
      (expense) => expense.date >= startStr && expense.date <= endStr
    );
  };

  const getYearlyData = () => {
    const start = new Date(selectedDate.getFullYear(), 0, 1);
    const end = new Date(selectedDate.getFullYear(), 11, 31);
    const startStr = format(start, 'yyyy-MM-dd');
    const endStr = format(end, 'yyyy-MM-dd');
    
    return expenses.filter(
      (expense) => expense.date >= startStr && expense.date <= endStr
    );
  };

  const calculateStatistics = (data: Expense[]) => {
    const income = data
      .filter((expense) => expense.type === 'income')
      .reduce((sum, expense) => sum + expense.amount, 0);

    const expense = data
      .filter((expense) => expense.type === 'expense')
      .reduce((sum, expense) => sum + expense.amount, 0);

    const balance = income - expense;
    const categoryBreakdown = data.reduce((acc, expense) => {
      if (!acc[expense.category_id]) {
        acc[expense.category_id] = { income: 0, expense: 0 };
      }
      acc[expense.category_id][expense.type] += expense.amount;
      return acc;
    }, {} as Record<string, { income: number; expense: number }>);

    return { income, expense, balance, categoryBreakdown };
  };

  const data = period === 'month' ? getMonthlyData() : getYearlyData();
  const stats = calculateStatistics(data);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {period === 'month'
            ? format(selectedDate, 'yyyy年MM月', { locale: ja })
            : format(selectedDate, 'yyyy年', { locale: ja })}
          の統計
        </h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'month' | 'year')}
          className="p-2 border rounded"
        >
          <option value="month">月次</option>
          <option value="year">年次</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-green-50 rounded">
          <div className="text-sm text-green-600">収入合計</div>
          <div className="text-2xl font-bold text-green-600">
            ¥{stats.income.toLocaleString()}
          </div>
        </div>
        <div className="p-4 bg-red-50 rounded">
          <div className="text-sm text-red-600">支出合計</div>
          <div className="text-2xl font-bold text-red-600">
            ¥{stats.expense.toLocaleString()}
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded">
          <div className="text-sm text-blue-600">収支差引</div>
          <div
            className={`text-2xl font-bold ${
              stats.balance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            ¥{stats.balance.toLocaleString()}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">カテゴリー別内訳</h3>
        <div className="space-y-4">
          {Object.entries(stats.categoryBreakdown).map(([category, amounts]) => (
            <div key={category} className="p-4 bg-gray-50 rounded">
              <div className="font-medium mb-2">{category}</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-green-600">収入</div>
                  <div className="text-lg font-medium text-green-600">
                    ¥{amounts.income.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-red-600">支出</div>
                  <div className="text-lg font-medium text-red-600">
                    ¥{amounts.expense.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 