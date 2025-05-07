'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

type AssetType = Database['public']['Tables']['assets']['Row']['type'];
type PaymentMethod = 'デビットカード' | 'クレジットカード' | 'プリペイドカード' | 'QRコード決済' | '銀行振込' | 'コンビニ決済' | '後払い' | '代金引換' | '携帯キャリア決済' | 'PayPay';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function AssetModal({ isOpen, onClose, onSave }: Props) {
  const [type, setType] = useState<AssetType>('収入');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('デビットカード');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('assets')
        .insert({
          type,
          amount: parseFloat(amount),
          payment_method: paymentMethod,
          note,
          user_id: 'dummy-user-id', // TODO: 実際のユーザーIDを使用
        });

      if (error) throw error;
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving asset:', error);
      // TODO: エラー処理
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">資産を追加</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">種別</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AssetType)}
              className="w-full p-2 border rounded"
            >
              <option value="収入">収入</option>
              <option value="支払い">支払い</option>
              <option value="振替">振替</option>
              <option value="貯金">貯金</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">金額</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="金額を入力"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">支払方法</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full p-2 border rounded"
            >
              <option value="デビットカード">デビットカード</option>
              <option value="クレジットカード">クレジットカード</option>
              <option value="プリペイドカード">プリペイドカード</option>
              <option value="QRコード決済">QRコード決済</option>
              <option value="PayPay">PayPay</option>
              <option value="銀行振込">銀行振込</option>
              <option value="コンビニ決済">コンビニ決済</option>
              <option value="後払い">後払い</option>
              <option value="代金引換">代金引換</option>
              <option value="携帯キャリア決済">携帯キャリア決済</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">メモ</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="メモを入力（任意）"
            />
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
              disabled={isLoading}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 