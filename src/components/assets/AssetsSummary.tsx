'use client';

import type { Transaction } from '@/types/transaction';

interface Props {
  transactions: Transaction[];
}

export const AssetsSummary = ({ transactions }: Props) => {
  const calculateTotals = () => {
    return transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === '収入') {
          acc.income += transaction.amount;
        } else if (transaction.type === '支払い') {
          acc.expense += transaction.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );
  };

  const { income, expense } = calculateTotals();
  const balance = income - expense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-2">総収入</h3>
        <p className="text-2xl text-green-600">¥{income.toLocaleString()}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-2">総支出</h3>
        <p className="text-2xl text-red-600">¥{expense.toLocaleString()}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-2">収支バランス</h3>
        <p
          className={`text-2xl ${
            balance >= 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          ¥{balance.toLocaleString()}
        </p>
      </div>
    </div>
  );
}; 