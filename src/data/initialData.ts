import { Category } from '@/types/expense';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '7f742d0c-4c84-4580-99b8-045f40986a39', name: 'サブスク', type: 'expense', color: '#FF6384', user_id: '' },
  { id: 'cc39552f-f007-4745-9d0f-5c716a6bfb52', name: 'ネットショッピング', type: 'expense', color: '#36A2EB', user_id: '' },
  { id: '6b077f89-b9f0-4b54-b4fe-508c9ea254eb', name: '家賃', type: 'expense', color: '#FFCE56', user_id: '' },
  { id: '9efa556d-827d-452a-b525-ed7d2ea29e26', name: '通信費', type: 'expense', color: '#4BC0C0', user_id: '' },
  { id: '70171412-adc9-4214-90b9-18b9d621e267', name: 'ガス', type: 'expense', color: '#9966FF', user_id: '' },
  { id: '5c716a6b-f007-4745-9d0f-cc39552fbf52', name: '水道', type: 'expense', color: '#FF9F40', user_id: '' },
  { id: '4c844580-99b8-045f-4098-6a397f742d0c', name: '電気代', type: 'expense', color: '#FF6384', user_id: '' },
  { id: 'b9f04b54-b4fe-508c-9ea2-54eb6b077f89', name: '病院', type: 'expense', color: '#36A2EB', user_id: '' },
  { id: '827d452a-b525-ed7d-2ea2-9e269efa556d', name: 'スポーツ', type: 'expense', color: '#FFCE56', user_id: '' },
  { id: 'adc94214-90b9-18b9-d621-e26770171412', name: 'レジャー', type: 'expense', color: '#4BC0C0', user_id: '' },
  { id: 'f0074745-9d0f-5c71-6a6b-fb52cc39552f', name: 'ダイエット', type: 'expense', color: '#9966FF', user_id: '' },
  { id: '458099b8-045f-4098-6a39-7f742d0c4c84', name: '薬局', type: 'expense', color: '#FF9F40', user_id: '' },
  { id: '4b54b4fe-508c-9ea2-54eb-6b077f89b9f0', name: '生活用品', type: 'expense', color: '#FF6384', user_id: '' },
  { id: '452ab525-ed7d-2ea2-9e26-9efa556d827d', name: '交際費', type: 'expense', color: '#36A2EB', user_id: '' },
  { id: '421490b9-18b9-d621-e267-70171412adc9', name: '交通費', type: 'expense', color: '#FFCE56', user_id: '' },
  { id: '47459d0f-5c71-6a6b-fb52-cc39552ff007', name: 'コンビニ', type: 'expense', color: '#4BC0C0', user_id: '' },
  { id: '99b8045f-4098-6a39-7f74-2d0c4c844580', name: 'ファッション', type: 'expense', color: '#9966FF', user_id: '' },
  { id: 'b4fe508c-9ea2-54eb-6b07-7f89b9f04b54', name: '美容', type: 'expense', color: '#FF9F40', user_id: '' },
  { id: 'b525ed7d-2ea2-9e26-9efa-556d827d452a', name: '食費', type: 'expense', color: '#FF6384', user_id: '' },
  { id: '6e93b9e9-2698-472e-932f-90cbcf1fae65', name: 'タバコ', type: 'expense', color: '#e6ac66', user_id: '' },
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
  '携帯キャリア決済',
  '現金',
] as const;

export type PaymentMethod = typeof PAYMENT_METHODS[number]; 