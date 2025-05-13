import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { CategoryType, Category, Expense } from '@/types/expense';
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '@/types/expense';
import { normalizeUUID } from '@/utils/uuid';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { amount: number; category_id: string; memo: string; type: CategoryType } | null) => Promise<void>;
  selectedDate: Date;
  categories: Category[];
  dailyExpenses: Expense[];
  onDelete?: (id: string) => Promise<void>;
}

export const ExpenseModal = ({
  isOpen,
  onClose,
  onSubmit,
  selectedDate,
  categories,
  dailyExpenses,
  onDelete
}: Props) => {
  console.log('ExpenseModal: 受け取ったカテゴリー:', categories);
  const [type, setType] = useState<CategoryType>('expense');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [category_id, setCategoryId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [calculatorDisplay, setCalculatorDisplay] = useState('');

  useEffect(() => {
    setAmount(calculatorDisplay);
  }, [calculatorDisplay]);

  // categories配列を正規化
  const normalizedCategories = useMemo(() => {
    console.log('ExpenseModal: カテゴリーを正規化中...');
    const normalized = categories.map(cat => ({ ...cat, id: normalizeUUID(cat.id) }));
    console.log('ExpenseModal: 正規化後のカテゴリー:', normalized);
    return normalized;
  }, [categories]);

  const filteredCategories = useMemo(() => {
    console.log('ExpenseModal: カテゴリーをフィルタリング中...', { type, normalizedCategories });
    const filtered = normalizedCategories.filter(cat => cat.type === type);
    console.log('ExpenseModal: フィルタリング後のカテゴリー:', filtered);
    return filtered;
  }, [normalizedCategories, type]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setCategoryId(categoryId);
    const normalizedId = normalizeUUID(categoryId);
    const category = normalizedCategories.find(cat => cat.id === normalizedId);
    console.log('ExpenseModal: カテゴリー選択:', { categoryId, normalizedId, category });
    setSelectedCategory(category || null);
  };

  // 初期値を空文字列にセット
  useEffect(() => {
    setCategoryId('');
  }, [type]);

  // 本日分の登録済み明細リスト（dateをYYYY-MM-DD文字列で比較）
  const todayStr = format(selectedDate, 'yyyy-MM-dd');
  const filteredDailyExpenses = dailyExpenses.filter(item => item.date === todayStr);

  if (!isOpen) return null;

  const handleNumberClick = (num: string) => {
    setCalculatorDisplay(prev => {
      const newVal = prev + num;
      setAmount(newVal);
      return newVal;
    });
  };

  const handleOperatorClick = (operator: string) => {
    setCalculatorDisplay(prev => {
      const newVal = prev + operator;
      setAmount(newVal);
      return newVal;
    });
  };

  const handleCalculate = () => {
    try {
      const result = eval(calculatorDisplay);
      setCalculatorDisplay(result.toString());
      setAmount(result.toString());
    } catch (error) {
      setCalculatorDisplay('Error');
      setAmount('');
    }
  };

  const handleTaxCalculation = (rate: number) => {
    try {
      const baseAmount = parseFloat(calculatorDisplay);
      const withTax = Math.round(baseAmount * (1 + rate));
      setCalculatorDisplay(withTax.toString());
      setAmount(withTax.toString());
    } catch (error) {
      setCalculatorDisplay('Error');
      setAmount('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !selectedCategory) {
      console.log('[DEBUG] handleSubmit: amount or selectedCategory is missing', { amount, selectedCategory });
      return;
    }

    console.log('[DEBUG] ExpenseModal: 保存ボタン押下', {
      amount,
      availableCategories: categories,
      category_id: selectedCategory.id,
      filteredCategories,
      memo,
      selectedCategory,
      type
    });

    try {
      const normalizedCategoryId = normalizeUUID(selectedCategory.id);
      console.log('[DEBUG] Normalized category ID:', normalizedCategoryId);

      const data = {
        amount: Number(amount),
        category_id: normalizedCategoryId,
        memo,
        type
      };
      console.log('[DEBUG] Submitting data:', data);
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('[DEBUG] Error saving expense:', error);
      alert('保存に失敗しました: ' + (error instanceof Error ? error.message : '不明なエラー'));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center overflow-y-auto max-h-screen w-full p-4 sm:p-8">
      <div className="bg-white p-6 rounded-lg w-full max-w-md my-8 mx-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {format(selectedDate, 'yyyy年MM月dd日', { locale: ja })}の収支を入力
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">収支タイプ</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as CategoryType)}
            className="w-full p-2 border rounded"
          >
            <option value="expense">支出</option>
            <option value="income">収入</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">金額</label>
          <input
            type="text"
            value={calculatorDisplay}
            className="w-full p-2 border rounded"
            readOnly
          />
          <div className="grid grid-cols-4 gap-1 mt-2">
            <button
              onClick={() => handleTaxCalculation(0.1)}
              className="col-span-2 p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              税込み（10%）
            </button>
            <button
              onClick={() => handleTaxCalculation(0.08)}
              className="col-span-2 p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              税込み（8%）
            </button>
            {['7', '8', '9', '/'].map(btn => (
              <button
                key={btn}
                onClick={() => btn === '/' ? handleOperatorClick('/') : handleNumberClick(btn)}
                className="p-2 border rounded hover:bg-gray-100"
              >
                {btn}
              </button>
            ))}
            {['4', '5', '6', '*'].map(btn => (
              <button
                key={btn}
                onClick={() => btn === '*' ? handleOperatorClick('*') : handleNumberClick(btn)}
                className="p-2 border rounded hover:bg-gray-100"
              >
                {btn}
              </button>
            ))}
            {['1', '2', '3', '-'].map(btn => (
              <button
                key={btn}
                onClick={() => btn === '-' ? handleOperatorClick('-') : handleNumberClick(btn)}
                className="p-2 border rounded hover:bg-gray-100"
              >
                {btn}
              </button>
            ))}
            {['0', '.', '=', '+'].map(btn => (
              <button
                key={btn}
                onClick={() => {
                  if (btn === '=') handleCalculate();
                  else if (btn === '+') handleOperatorClick('+');
                  else handleNumberClick(btn);
                }}
                className="p-2 border rounded hover:bg-gray-100"
              >
                {btn}
              </button>
            ))}
            <button
              onClick={() => setCalculatorDisplay('')}
              className="p-2 border rounded hover:bg-gray-100 bg-red-50"
            >
              C
            </button>
            <button
              onClick={() => setCalculatorDisplay(prev => prev.slice(0, -1))}
              className="col-span-3 p-2 border rounded hover:bg-gray-100 bg-yellow-50"
            >
              ←
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">カテゴリー</label>
          <select
            value={category_id}
            onChange={handleCategoryChange}
            className="w-full p-2 border rounded"
          >
            <option value="">選択してください</option>
            {filteredCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">メモ</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            保存
          </button>
        </div>

        {/* 本日分の登録済み明細リスト */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">本日の明細</h3>
          {dailyExpenses.length === 0 ? (
            <p className="text-gray-500">明細はありません</p>
          ) : (
            <div className="space-y-2">
              {dailyExpenses.map((expense) => {
                console.log('Expense category debug:', {
                  expense_id: expense.id,
                  expense_category_id: expense.category_id,
                  found_category: normalizedCategories.find(cat => cat.id === normalizeUUID(expense.category_id)),
                  all_categories: normalizedCategories
                });
                return (
                  <div key={expense.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">
                        {(() => {
                          const category = normalizedCategories.find(cat => cat.id === normalizeUUID(expense.category_id));
                          return category ? category.name : '未分類';
                        })()}
                      </div>
                      <div className="text-sm text-gray-500">{expense.memo}</div>
                      <div className={`text-sm ${expense.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {expense.type === 'income' ? '+' : '-'}¥{expense.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 