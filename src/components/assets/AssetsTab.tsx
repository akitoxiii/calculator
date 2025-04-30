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

export const AssetsTab = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate] = useState(new Date());

  useEffect(() => {
    const savedTransactions = storage.getTransactions() || [];
    setTransactions(savedTransactions);
  }, []);

  const handleSaveTransaction = (transaction: Transaction) => {
    const updatedTransactions = [...transactions, transaction];
    setTransactions(updatedTransactions);
    storage.saveTransactions(updatedTransactions);
    setIsModalOpen(false);
  };

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
        <TransactionList transactions={transactions} />
      </div>

      {isModalOpen && (
        <TransactionModal
          date={selectedDate}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTransaction}
        />
      )}
    </div>
  );
}; 