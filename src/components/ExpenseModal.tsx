import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { CategoryType } from '@/types/expense';
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '@/types/expense';

type Props = {
  date: Date;
  onClose: () => void;
  onSubmit: (data: { amount: number; category: string; memo: string; type: CategoryType }) => void;
};

export function ExpenseModal({ date, onClose, onSubmit }: Props) {
  const [type, setType] = useState<CategoryType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [memo, setMemo] = useState('');
  const [calculatorDisplay, setCalculatorDisplay] = useState('');

  const handleNumberClick = (num: string) => {
    setCalculatorDisplay(prev => prev + num);
  };

  const handleOperatorClick = (operator: string) => {
    setCalculatorDisplay(prev => prev + operator);
  };

  const handleCalculate = () => {
    try {
      const result = eval(calculatorDisplay);
      setCalculatorDisplay(result.toString());
      setAmount(result.toString());
    } catch (error) {
      setCalculatorDisplay('Error');
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
    }
  };

  const handleSubmit = () => {
    if (!amount || !category) return;
    
    onSubmit({
      amount: parseFloat(amount),
      category,
      memo,
      type
    });
  };

  const categories = type === 'expense' ? DEFAULT_EXPENSE_CATEGORIES : DEFAULT_INCOME_CATEGORIES;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {format(date, 'yyyy年MM月dd日', { locale: ja })}の収支を入力
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
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">選択してください</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
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
      </div>
    </div>
  );
} 