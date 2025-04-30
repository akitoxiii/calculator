'use client';

import type { Transaction } from '@/types/transaction';

interface Props {
  transactions: Transaction[];
}

export const PaymentMethodList = ({ transactions }: Props) => {
  const calculatePaymentMethodSummary = () => {
    return transactions.reduce((acc, transaction) => {
      if (transaction.type === '支払い' && transaction.paymentMethod) {
        acc[transaction.paymentMethod] =
          (acc[transaction.paymentMethod] || 0) + transaction.amount;
      }
      return acc;
    }, {} as Record<string, number>);
  };

  const paymentMethodSummary = calculatePaymentMethodSummary();
  const hasData = Object.keys(paymentMethodSummary).length > 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">支払い方法別集計</h3>
      {hasData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(paymentMethodSummary).map(([method, amount]) => (
            <div key={method} className="p-4 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">{method}</div>
              <div className="text-lg font-bold">¥{amount.toLocaleString()}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          支払いデータがありません
        </div>
      )}
    </div>
  );
}; 