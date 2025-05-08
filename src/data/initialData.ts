import { Category } from '@/types/expense';

// DEFAULT_CATEGORIESは今後使わないため削除

export const PAYMENT_METHODS = [
  'デビットカード',
  'クレジットカード',
  'プリペイドカード',
  'QRコード決済',
  'PayPay',
  '銀行振込',
  'コンビニ決済',
  '後払い',
  '代金引換',
  '携帯キャリア決済',
  '現金',
] as const;

export type PaymentMethod = typeof PAYMENT_METHODS[number]; 