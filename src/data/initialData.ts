import { Category } from '@/types/expense';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'サブスク', type: 'expense', color: '#FF6384', user_id: '' },
  { id: '2', name: 'ネットショッピング', type: 'expense', color: '#36A2EB', user_id: '' },
  { id: '3', name: '家賃', type: 'expense', color: '#FFCE56', user_id: '' },
  { id: '4', name: '通信費', type: 'expense', color: '#4BC0C0', user_id: '' },
  { id: '5', name: 'ガス', type: 'expense', color: '#9966FF', user_id: '' },
  { id: '6', name: '水道', type: 'expense', color: '#FF9F40', user_id: '' },
  { id: '7', name: '電気代', type: 'expense', color: '#FF6384', user_id: '' },
  { id: '8', name: '病院', type: 'expense', color: '#36A2EB', user_id: '' },
  { id: '9', name: 'スポーツ', type: 'expense', color: '#FFCE56', user_id: '' },
  { id: '10', name: 'レジャー', type: 'expense', color: '#4BC0C0', user_id: '' },
  { id: '11', name: 'ダイエット', type: 'expense', color: '#9966FF', user_id: '' },
  { id: '12', name: '薬局', type: 'expense', color: '#FF9F40', user_id: '' },
  { id: '13', name: '生活用品', type: 'expense', color: '#FF6384', user_id: '' },
  { id: '14', name: '交際費', type: 'expense', color: '#36A2EB', user_id: '' },
  { id: '15', name: '交通費', type: 'expense', color: '#FFCE56', user_id: '' },
  { id: '16', name: 'コンビニ', type: 'expense', color: '#4BC0C0', user_id: '' },
  { id: '17', name: 'ファッション', type: 'expense', color: '#9966FF', user_id: '' },
  { id: '18', name: '美容', type: 'expense', color: '#FF9F40', user_id: '' },
  { id: '19', name: '食費', type: 'expense', color: '#FF6384', user_id: '' },
];

export const PAYMENT_METHODS = [
  'デビットカード',
  'クレジットカード',
  'プリペイドカード',
  'QRコード決済',
  '銀行振込',
  'コンビニ決済',
  '後払い',
  '代金引換',
  '携帯キャリア決済'
] as const;

export type PaymentMethod = typeof PAYMENT_METHODS[number]; 