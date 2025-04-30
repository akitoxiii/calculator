import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Category } from '@/types/expense';

interface DailyExpenseFormProps {
  date: Date;
  onSubmit: (data: ExpenseData) => void;
  categories: Category[];
}

interface ExpenseData {
  amount: number;
  category: string;
  memo: string;
  type: 'income' | 'expense';
}

export const DailyExpenseForm = ({ date, onSubmit, categories }: DailyExpenseFormProps) => {
  const [formData, setFormData] = useState<ExpenseData>({
    amount: 0,
    category: '',
    memo: '',
    type: 'expense',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      amount: 0,
      category: '',
      memo: '',
      type: 'expense',
    });
  };

  const filteredCategories = categories.filter(
    (category) => category.type === formData.type
  );

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">
        {format(date, 'yyyy年MM月dd日', { locale: ja })}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            収支タイプ
          </label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as 'income' | 'expense', category: '' })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="expense">支出</option>
            <option value="income">収入</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            金額
          </label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: Number(e.target.value) })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            カテゴリー
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">選択してください</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            メモ
          </label>
          <textarea
            value={formData.memo}
            onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          保存
        </button>
      </form>
    </div>
  );
}; 