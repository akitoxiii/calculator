'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { Transaction } from '@/types/transaction';
import { TRANSACTION_TYPES, TransactionType } from '@/types/transactionTypes';
import { useCategories } from '@/hooks/useCategories';

type PaymentMethod = typeof PAYMENT_METHODS[number];

const PAYMENT_METHODS = [
  'デビットカード',
  'クレジットカード',
  'プリペイドカード',
  'QRコード決済',
  '銀行振込',
  'コンビニ決済',
  '後払い',
  '代金引換',
  '携帯キャリア決済',
  '現金',
] as const;

interface Props {
  date: Date;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  transaction?: Transaction;
}

// UUID正規化関数
function normalizeUUID(id: string): string {
  const hex = id.replace(/-/g, '');
  if (hex.length !== 32) return id;
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20)
  ].join('-');
}

export const TransactionModal = ({ date, onClose, onSave, transaction }: Props) => {
  const [type, setType] = useState<TransactionType>(transaction ? transaction.type : '支払い');
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : '');
  const [fromAccount, setFromAccount] = useState(transaction?.fromAccount || '');
  const [toAccount, setToAccount] = useState(transaction?.toAccount || '');
  const initialPaymentMethod = transaction?.paymentMethod && PAYMENT_METHODS.includes(transaction.paymentMethod as PaymentMethod)
    ? transaction.paymentMethod as PaymentMethod
    : PAYMENT_METHODS[0];
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialPaymentMethod);
  const [note, setNote] = useState(transaction?.note || '');
  const [selectedDate, setSelectedDate] = useState(transaction ? new Date(transaction.date) : date);
  const { categories } = useCategories();
  const [categoryId, setCategoryId] = useState(transaction?.category_id || '');

  // 日付の範囲（前後2年）
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
  const maxDate = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate());

  // カテゴリ選択肢をtypeでフィルタ
  const filteredCategories = categories.filter(cat => {
    if (type === '収入') return cat.type === 'income';
    if (type === '支払い') return cat.type === 'expense';
    return false;
  });

  // 初期カテゴリIDセット
  useEffect(() => {
    if (filteredCategories.length > 0) {
      setCategoryId(filteredCategories[0].id);
    } else {
      setCategoryId('');
    }
  }, [type, categories]);

  const handleSave = () => {
    if (!amount) return;
    const newTransaction: Transaction = {
      id: transaction ? transaction.id : Date.now().toString(),
      date: format(selectedDate, 'yyyy-MM-dd'),
      type,
      amount: parseFloat(amount),
      fromAccount: fromAccount || undefined,
      toAccount: toAccount || undefined,
      paymentMethod: type === '支払い' ? paymentMethod : undefined,
      note: note || undefined,
      category_id: categoryId ? normalizeUUID(categoryId) : undefined,
    };
    onSave(newTransaction);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {format(selectedDate, 'yyyy年MM月dd日', { locale: ja })}の取引を追加
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">日付</label>
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              min={format(minDate, 'yyyy-MM-dd')}
              max={format(maxDate, 'yyyy-MM-dd')}
              onChange={e => setSelectedDate(new Date(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">取引種別</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
              className="w-full p-2 border rounded"
            >
              {TRANSACTION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">金額</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="金額を入力"
            />
          </div>

          {/* カテゴリ選択欄 */}
          {(type === '収入' || type === '支払い') && (
            <div>
              <label className="block text-sm font-medium mb-1">カテゴリ</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {filteredCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          )}

          {type === '振替' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">出金元</label>
                <input
                  type="text"
                  value={fromAccount}
                  onChange={(e) => setFromAccount(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="出金元を入力"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">入金先</label>
                <input
                  type="text"
                  value={toAccount}
                  onChange={(e) => setToAccount(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="入金先を入力"
                />
              </div>
            </>
          )}

          {type === '支払い' && (
            <div>
              <label className="block text-sm font-medium mb-1">支払い方法</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full p-2 border rounded"
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">メモ</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="メモを入力"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
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
}; 