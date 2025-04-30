'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { Transaction } from '@/types/transaction';
import { TRANSACTION_TYPES, TransactionType } from '@/types/transactionTypes';

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
] as const;

interface Props {
  date: Date;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
}

export const TransactionModal = ({ date, onClose, onSave }: Props) => {
  const [type, setType] = useState<TransactionType>('支払い');
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PAYMENT_METHODS[0]);
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (!amount) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      date,
      type,
      amount: parseFloat(amount),
      fromAccount: fromAccount || undefined,
      toAccount: toAccount || undefined,
      paymentMethod: type === '支払い' ? paymentMethod : undefined,
      note: note || undefined,
    };

    onSave(transaction);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {format(date, 'yyyy年MM月dd日', { locale: ja })}の取引を追加
        </h2>

        <div className="space-y-4">
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