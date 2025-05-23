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
      
      // ユーザーが存在する場合、usersテーブルにも存在するか確認
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        // ユーザーがusersテーブルに存在しない場合は作成
        if (error || !data) {
          const { error: insertError } = await supabase
            .from('users')
            .insert([{ id: user.id, email: user.email }]);
          
          if (insertError) {
            console.error('Error creating user:', insertError);
          }
        }
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user, isModalOpen]);

  const fetchTransactions = async () => {
    if (!user) return;
    // expenses取得
    const { data: expensesData, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    // transactions取得
    const { data: transactionsData, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    if (expensesError || transactionsError) {
      alert('データ取得エラー: ' + (expensesError?.message || transactionsError?.message));
      return;
    }
    // expenses正規化
    const mappedExpenses = (expensesData || []).map((row: any) => ({
      ...row,
      fromAccount: row.from_account,
      toAccount: row.to_account,
      payment_method: row.payment_method ?? '',
      type: row.type === 'income' ? '収入' : row.type === 'expense' ? '支払い' : row.type,
    }));
    // transactions正規化
    const mappedTransactions = (transactionsData || []).map((row: any) => ({
      ...row,
      fromAccount: row.from_account,
      toAccount: row.to_account,
      payment_method: row.payment_method ?? '',
      type: row.type === 'savings' ? '貯金' : row.type === 'transfer' ? '振替' : row.type,
      category_id: undefined, // transactionsにはカテゴリなし
    }));
    // マージ
    const all = [...mappedExpenses, ...mappedTransactions];
    // 日付降順
    all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setTransactions(all as Transaction[]);
    calculateBalance(all as Transaction[]);
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
    setBalance({
      ...newBalance,
      available: newBalance.total + newBalance.savings
    });
  };

  const handleAdd = () => {
    setEditTransaction(null);
    setIsModalOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, type?: string) => {
    if (!user) return;
    // typeでどちらのテーブルか判定
    if (type === '貯金' || type === '振替') {
      await supabase.from('transactions').delete().eq('id', id).eq('user_id', user.id);
    } else {
      await supabase.from('expenses').delete().eq('id', id).eq('user_id', user.id);
    }
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

  // usersテーブルにuser.idがなければinsertする
  const ensureUserExists = async (userId: string, email: string = '') => {
    try {
      // emailが空の場合はダミー値をセット
      const safeEmail = email && email.length > 0 ? email : `guest+${userId}@example.com`;
      
      // まずユーザーの存在確認
      const { data, error: selectError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('ユーザー確認エラー:', selectError);
        throw selectError;
      }

      // ユーザーが存在しない場合のみ作成
      if (!data) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ 
            id: userId, 
            email: safeEmail,
            created_at: new Date().toISOString()
          }]);

        if (insertError) {
          console.error('ユーザー作成エラー:', insertError);
          // 409や23505（重複）エラーは無視
          if (insertError.code !== '23505' && insertError.code !== '409') {
            throw insertError;
          }
        }
      }
    } catch (error) {
      console.error('ユーザー確認/作成エラー:', error);
      // エラーを上位に伝播させない
    }
  };

  const handleSave = async (transaction: Transaction) => {
    if (!user) return;

    // usersテーブルに必ず存在させる
    await ensureUserExists(user.id, user.email);

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
      const typeValue =
        transaction.type === '収入' ? 'income'
        : transaction.type === '支払い' ? 'expense'
        : null;

      if (!typeValue) {
        // 振替・貯金はtransactionsテーブルに保存
        const txInsertData: {
          user_id: any;
          amount: number;
          type: string;
          date: string;
          from_account: string | null;
          to_account: string | null;
          note: string;
          payment_method?: string;
        } = {
          user_id: user.id,
          amount: transaction.amount,
          type: transaction.type === '貯金' ? 'savings' : transaction.type === '振替' ? 'transfer' : transaction.type,
          date: transaction.date,
          from_account: transaction.fromAccount || null,
          to_account: transaction.toAccount || null,
          note: transaction.memo || transaction.note || ''
          // payment_methodが空文字の場合はnullとして送信
          // created_atとupdated_atはデフォルト値が設定されているため省略
        };

        // payment_methodがある場合のみ追加
        if (transaction.payment_method) {
          txInsertData.payment_method = transaction.payment_method;
        }

        const { error } = await supabase
          .from('transactions')
          .insert([txInsertData]);
        
        if (error) {
          alert('Insert error (transactions): ' + error.message);
          return;
        }
        setIsModalOpen(false);
        fetchTransactions();
        return;
      }

      const getDefaultCategoryId = (type: string) => {
        const found = categories.find(cat => cat.type === type);
        if (found) return found.id;
        const fallback = categories.find(cat => cat.name.includes('その他') || cat.name.includes('未分類'));
        if (fallback) return fallback.id;
        return categories[0]?.id || '';
      };
      const insertData = {
        user_id: user.id,
        category_id: transaction.category_id
          || getDefaultCategoryId(typeValue),
        amount: transaction.amount,
        type: typeValue,
        memo: transaction.memo || transaction.note || '',
        date: transaction.date,
        payment_method: transaction.payment_method || null,
      };
      const { error } = await supabase
        .from('expenses')
        .insert([insertData]);
      
      if (error) {
        alert('Insert error: ' + error.message);
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
        <TransactionList transactions={transactions} onEdit={handleEdit} onDelete={(id, type) => handleDelete(id, type)} categories={categories} />
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