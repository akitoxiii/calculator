'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { Transaction } from '@/types/transaction';
import { TransactionType } from '@/types/transactionTypes';
import { PAYMENT_METHODS } from '@/data/initialData';
import { useCategories } from '@/hooks/useCategories';
import { DailyExpenseForm } from '@/components/DailyExpenseForm';
import { supabase } from '@/utils/supabase';
import type { Expense } from '@/types/expense';

export const AssetsTab = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<{
    total: number;
    savings: number;
    available: number;
  }>({
    total: 0,
    savings: 0,
    available: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { categories } = useCategories();
  const [user, setUser] = useState<any>(null);

  // Expense型→Transaction型変換
  const expenseToTransaction = (expense: Expense): Transaction => {
    return {
      id: expense.id,
      date: expense.date,
      type: expense.type === 'income' ? '収入' : '支払い',
      amount: expense.amount,
      paymentMethod: undefined, // 必要に応じてマッピング
      note: expense.memo || undefined,
    };
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      const { data: expenses, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id);
      if (!error && expenses) {
        const txs = (expenses as Expense[]).map(expenseToTransaction);
        setTransactions(txs);
        calculateBalance(txs);
      }
    };
    fetchTransactions();
  }, [isModalOpen, user]);

  const calculateBalance = (transactions: Transaction[]) => {
    const newBalance = transactions.reduce(
      (acc, transaction) => {
        switch (transaction.type) {
          case '収入':
            acc.total += transaction.amount;
            acc.available += transaction.amount;
            break;
          case '貯金':
            acc.savings += transaction.amount;
            acc.available -= transaction.amount;
            break;
          case '支払い':
            acc.total -= transaction.amount;
            acc.available -= transaction.amount;
            break;
          case '振替':
            // 振替は合計には影響しない
            break;
        }
        return acc;
      },
      { total: 0, savings: 0, available: 0 }
    );
    setBalance(newBalance);
  };

  // DailyExpenseFormのonSubmit用ラッパー
  const handleExpenseFormSubmit = async (data: any) => {
    if (!user) return;
    // data: { amount, category, memo, ... }
    const expense: Omit<Expense, 'id'> = {
      user_id: user.id,
      category_id: data.category, // 必要に応じて変換
      amount: Number(data.amount),
      type: data.type || 'expense',
      memo: data.memo || '',
      date: typeof data.date === 'string' ? data.date : format(data.date, 'yyyy-MM-dd'),
    };
    const { error } = await supabase.from('expenses').insert([expense]);
    if (!error) {
      setIsModalOpen(false);
      // 再取得
      const { data: expenses } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id);
      if (expenses) {
        const txs = (expenses as Expense[]).map(expenseToTransaction);
        setTransactions(txs);
        calculateBalance(txs);
      }
    }
  };

  // 取引削除
  const handleDeleteTransaction = async (id: string) => {
    if (!user) return;
    await supabase.from('expenses').delete().eq('id', id).eq('user_id', user.id);
    // 再取得
    const { data: expenses } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id);
    if (expenses) {
      const txs = (expenses as Expense[]).map(expenseToTransaction);
      setTransactions(txs);
      calculateBalance(txs);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* 残高サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">総資産</h3>
          <p className="text-3xl font-bold text-blue-600">
            ¥{balance.total.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">貯金残高</h3>
          <p className="text-3xl font-bold text-green-600">
            ¥{balance.savings.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">利用可能残高</h3>
          <p className="text-3xl font-bold text-gray-900">
            ¥{balance.available.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 取引履歴 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">取引履歴</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            取引を追加
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日付
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  種類
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金額
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  説明
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  支払方法
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(transaction.date), 'yyyy/MM/dd', { locale: ja })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={
                        transaction.type === '収入'
                          ? 'text-green-600'
                          : transaction.type === '支払い'
                          ? 'text-red-600'
                          : 'text-gray-900'
                      }
                    >
                      ¥{transaction.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.note}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.paymentMethod}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DailyExpenseForm
        date={new Date()}
        onSubmit={handleExpenseFormSubmit}
        categories={categories}
      />
    </div>
  );
}; 