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
        type: row.type === 'income' ? '収入' : row.type === 'expense' ? '支払い' : row.type === 'savings' ? '貯金' : row.type === 'transfer' ? '振替' : row.type,
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

  const cleanUpdateData = (data: any) => {
    const allowed = ['category_id', 'payment_method', 'amount', 'type', 'date', 'note', 'memo', 'from_account', 'to_account'];
    const result: any = {};
    for (const key of allowed) {
      if (data[key] !== undefined) {
        if (key === 'type') {
          result[key] = data[key] === '収入' ? 'income' : 
                       data[key] === '支払い' ? 'expense' : 
                       data[key] === '貯金' ? 'savings' : 
                       data[key] === '振替' ? 'transfer' : data[key];
        } else {
          result[key] = data[key];
        }
      }
    }
    return result;
  };

  const handleSave = async (transaction: Transaction) => {
    if (!user) return;
    if (transaction.id && transactions.some(t => t.id === transaction.id)) {
      // update
      const { id, ...rawUpdateData } = transaction;
      const updateData = cleanUpdateData(rawUpdateData);
      const { error } = await supabase
        .from('expenses')
        .update(updateData)
        .eq('id', transaction.id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Update error:', error);
        return;
      }
    } else {
      // insert
      const insertData = {
        user_id: user.id,
        category_id: transaction.category_id,
        amount: transaction.amount,
        type: transaction.type === '収入' ? 'income'
             : transaction.type === '支払い' ? 'expense'
             : transaction.type === '貯金' ? 'savings'
             : transaction.type === '振替' ? 'transfer'
             : transaction.type,
        memo: transaction.memo || transaction.note || '',
        date: transaction.date,
        payment_method: transaction.payment_method || null,
      };
      const { error } = await supabase
        .from('expenses')
        .insert([insertData]);
      
      if (error) {
        console.error('Insert error:', error);
        return;
      }
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
        <TransactionList transactions={transactions} onEdit={handleEdit} onDelete={handleDelete} categories={categories} />
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