'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { Transaction } from '@/types/transaction';

interface Props {
  transactions: Transaction[];
}

export const TransactionList = ({ transactions }: Props) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-bold mb-4">取引履歴</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">日付</th>
                <th className="px-4 py-2 text-left">種別</th>
                <th className="px-4 py-2 text-left">金額</th>
                <th className="px-4 py-2 text-left">詳細</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {format(transaction.date, 'yyyy/MM/dd', { locale: ja })}
                  </td>
                  <td className="px-4 py-2">{transaction.type}</td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        transaction.type === '収入'
                          ? 'text-green-600'
                          : transaction.type === '支払い'
                          ? 'text-red-600'
                          : ''
                      }
                    >
                      ¥{transaction.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {transaction.type === '振替' ? (
                      <>
                        {transaction.fromAccount} → {transaction.toAccount}
                      </>
                    ) : transaction.type === '支払い' ? (
                      transaction.paymentMethod
                    ) : (
                      transaction.note || '-'
                    )}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    取引データがありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 