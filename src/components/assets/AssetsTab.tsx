'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { storage } from '@/utils/storage';
import type { Transaction } from '@/types/transaction';
import { TransactionType, TRANSACTION_TYPES } from '@/types/transactionTypes';
import { TransactionModal } from './TransactionModal';
import { TransactionList } from './TransactionList';
import { AssetsSummary } from './AssetsSummary';
import { PaymentMethodList } from './PaymentMethodList';
import type { Expense } from '@/types/expense';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';

interface AssetsTabProps {
  // expenses: Expense[]; // 不要
}

// Expense.type: 'income'|'expense' → TransactionType: '収入'|'支払い'
const mapCategoryTypeToTransactionType = (type: 'income' | 'expense'): '収入' | '支払い' => {
  return type === 'income' ? '収入' : '支払い';
};

export const AssetsTab = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate] = useState(new Date());
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const { user, isSignedIn } = useUser();

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
    const fetchAllTransactions = async () => {
      // ローカルstorageのTransaction
      const localTransactions = storage.getTransactions();
      // supabaseのexpenses（カレンダー画面のデータ）
      let supabaseTransactions: Transaction[] = [];
      if (user) {
        const { data: expenses, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', user.id);
        if (!error && expenses) {
          supabaseTransactions = (expenses as Expense[]).map(expenseToTransaction);
        }
      }
      // idで重複排除してマージ
      const merged = [...localTransactions, ...supabaseTransactions].filter(
        (t, i, arr) => arr.findIndex(x => x.id === t.id) === i
      );
      setTransactions(merged);
    };
    fetchAllTransactions();
  }, [isModalOpen, user]);

  // 編集
  const handleEditTransaction = (transaction: Transaction) => {
    setEditTransaction(transaction);
    setIsModalOpen(true);
  };

  // 保存（新規・編集共通）
  const handleSaveTransaction = (transaction: Transaction) => {
    let updated;
    if (editTransaction) {
      updated = transactions.map(t => t.id === transaction.id ? transaction : t);
    } else {
      updated = [...transactions, transaction];
    }
    storage.saveTransactions(updated);
    setIsModalOpen(false);
    setEditTransaction(null);
    setTransactions(updated); // category_idも反映
  };

  // 削除
  const handleDeleteTransaction = async (id: string) => {
    // ローカルストレージから削除
    let updated = transactions.filter(t => t.id !== id);
    storage.saveTransactions(updated);

    // ログインユーザーの場合はsupabaseからも削除
    if (isSignedIn && user) {
      try {
        await supabase.from('expenses').delete().eq('id', id).eq('user_id', user.id);
      } catch (e) {
        // エラーは無視（ローカルは必ず消す）
      }
    }
    setTransactions(updated);
    setIsModalOpen(false);
    setEditTransaction(null);
  };

  // 取引履歴の表示部分でdateをDate型に変換
  const renderTransactions = transactions.map((transaction) => {
    const d = new Date(transaction.date);
    return (
      <tr key={transaction.id}>
        <td>{format(d, 'yyyy-MM-dd')}</td>
        <td>{transaction.type}</td>
        <td>{transaction.type === '収入' ? '+' : '-'}{transaction.amount.toLocaleString()}</td>
      </tr>
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">資産管理</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          取引を追加
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <AssetsSummary transactions={transactions} />
          <PaymentMethodList transactions={transactions} />
        </div>
        {/* カレンダーやグラフのサイズを大きくする場合はここでclassNameを調整 */}
        <div className="w-full max-w-3xl mx-auto">
          <TransactionList
            transactions={transactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </div>

      {isModalOpen && (
        <TransactionModal
          date={editTransaction ? new Date(editTransaction.date) : selectedDate}
          onClose={() => { setIsModalOpen(false); setEditTransaction(null); }}
          onSave={handleSaveTransaction}
          transaction={editTransaction || undefined}
        />
      )}
    </div>
  );
}; 