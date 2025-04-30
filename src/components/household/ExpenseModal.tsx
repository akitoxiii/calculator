'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { Expense } from './HouseholdTab';

const CATEGORIES = [
  'サブスク', 'ネットショッピング', '家賃', '通信費', 'ガス', '水道', '電気代',
  '病院', 'スポーツ', 'レジャー', 'ダイエット', '薬局', '生活用品', '交際費',
  '交通費', 'コンビニ', 'ファッション', '美容', '食費'
];

const PAYMENT_METHODS = [
  'デビットカード', 'クレジットカード', 'プリペイドカード', 'QRコード決済',
  '銀行振込', 'コンビニ決済', '後払い', '代金引換', '携帯キャリア決済'
];

type Props = {
  date: Date;
  onClose: () => void;
  onSave: (expense: Expense) => void;
};

export default function ExpenseModal({ date, onClose, onSave }: Props) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [note, setNote] = useState('');
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

  const handleTaxCalculation = () => {
    try {
      const baseAmount = parseFloat(calculatorDisplay);
      const withTax = Math.round(baseAmount * 1.1);
      setCalculatorDisplay(withTax.toString());
      setAmount(withTax.toString());
    } catch (error) {
      setCalculatorDisplay('Error');
    }
  };

  const handleSave = () => {
    if (!amount) return;
    
    const expense: Expense = {
      id: Date.now().toString(),
      date,
      category,
      amount: parseFloat(amount),
      paymentMethod,
      note
    };
    
    onSave(expense);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {format(date, 'yyyy年MM月dd日', { locale: ja })}の支出を入力
        </h2>

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
              onClick={() => setCalculatorDisplay('')}
              className="p-2 border rounded hover:bg-gray-100 bg-red-50"
            >
              C
            </button>
            <button
              onClick={() => setCalculatorDisplay(prev => prev.slice(0, -1))}
              className="p-2 border rounded hover:bg-gray-100 bg-yellow-50"
            >
              ←
            </button>
            <button
              onClick={handleTaxCalculation}
              className="col-span-2 p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              税込み（10%）
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
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">カテゴリ</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">支払い方法</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {PAYMENT_METHODS.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">メモ</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
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
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
} 