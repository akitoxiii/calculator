'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { Transaction } from '@/types/transaction';
import { useCategories } from '@/hooks/useCategories';
import { supabase } from '@/utils/supabase';
import { TransactionModal } from './assets/TransactionModal';
import { TransactionList } from './assets/TransactionList';

export const AssetsTab = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState({ total: 0, savings: 0, available: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const { categories } = useCategories();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user, isModalOpen]);

  const fetchTransactions = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    if (!error && data) {
      const mapped = data.map((row: any) => ({
        ...row,
        fromAccount: row.from_account,
        toAccount: row.to_account,
        payment_method: row.payment_method ?? '',
        type: row.type === 'income' ? '収入' : row.type === 'expense' ? '支払い' : row.type,
      }));
      setTransactions(mapped as Transaction[]);
      calculateBalance(mapped as Transaction[]);
    }
  };

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
            break;
        }
        return acc;
      },
      { total: 0, savings: 0, available: 0 }
    );
    setBalance(newBalance);
  };

  const handleAdd = () => {
    setEditTransaction(null);
    setIsModalOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    await supabase.from('expenses').delete().eq('id', id).eq('user_id', user.id);
    fetchTransactions();
  };

  const handleSave = async (transaction: Transaction) => {
    if (!user) return;
    if (transaction.id && transactions.some(t => t.id === transaction.id)) {
      // update
      const { id, ...updateData } = transaction;
      await supabase.from('expenses').update(updateData).eq('id', id).eq('user_id', user.id);
    } else {
      // insert
      await supabase.from('expenses').insert([{ ...transaction, user_id: user.id }]);
    }
    setIsModalOpen(false);
    fetchTransactions();
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
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            取引を追加
          </button>
        </div>
        <TransactionList transactions={transactions} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* 取引追加・編集モーダル */}
      {isModalOpen && (
        <TransactionModal
          date={new Date()}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          transaction={editTransaction || undefined}
        />
      )}
    </div>
  );
}; 