'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { Transaction } from '@/types/transaction';
import type { Category } from '@/types/expense';

interface Props {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string, type?: string) => void;
  categories: Category[];
}

export const TransactionList = ({ transactions, onEdit, onDelete, categories }: Props) => {
  const getCategoryName = (category_id?: string) => {
    if (!category_id) return '-';
    const cat = categories.find(c => c.id === category_id);
    return cat ? cat.name : '-';
  };

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
                <th className="px-4 py-2 text-left">支払方法</th>
                <th className="px-4 py-2 text-left">メモ</th>
                <th className="px-4 py-2 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {format(new Date(transaction.date), 'yyyy/MM/dd', { locale: ja })}
                  </td>
                  <td className="px-4 py-2">
                    {String(transaction.type) === 'expense' || String(transaction.type) === '支払い'
                      ? '支払い'
                      : String(transaction.type) === 'income' || String(transaction.type) === '収入'
                      ? '収入'
                      : transaction.type}
                  </td>
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
                    ) : (
                      getCategoryName(transaction.category_id)
                    )}
                  </td>
                  <td className="px-4 py-2">{transaction.payment_method || '-'}</td>
                  <td className="px-4 py-2">{transaction.memo || transaction.note || '-'}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => onEdit && onEdit(transaction)}
                    >
                      編集
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => onDelete && onDelete(transaction.id, transaction.type)}
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
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