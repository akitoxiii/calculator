export type CategoryType = 'expense' | 'income';

export interface Category {
  id: string; // UUID
  name: string;
  type: CategoryType;
  user_id: string;
  color: string;
}

export interface Expense {
  id: string;
  user_id: string;
  category_id: string; // UUID
  amount: number;
  type: CategoryType;
  memo: string;
  date: string; // YYYY-MM-DD 文字列で管理
  payment_method?: string;
}

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: '7f742d0c-4c84-4580-99b8-045f40986a39', name: 'サブスク', type: 'expense', user_id: '', color: '#FF6384' },
  { id: 'cc39552f-f007-4745-9d0f-5c716a6bfb52', name: 'ネットショッピング', type: 'expense', user_id: '', color: '#36A2EB' },
  { id: '6b077f89-b9f0-4b54-b4fe-508c9ea254eb', name: '家賃', type: 'expense', user_id: '', color: '#FFCE56' },
  { id: '9efa556d-827d-452a-b525-ed7d2ea29e26', name: '通信費', type: 'expense', user_id: '', color: '#4BC0C0' },
  { id: '70171412-adc9-4214-90b9-18b9d621e267', name: 'ガス', type: 'expense', user_id: '', color: '#9966FF' },
  { id: '5c716a6b-f007-4745-9d0f-cc39552fbf52', name: '水道', type: 'expense', user_id: '', color: '#FF9F40' },
  { id: '4c84-4580-99b8-045f40986a39-7f742d0c', name: '電気代', type: 'expense', user_id: '', color: '#FF6384' },
  { id: 'b9f0-4b54-b4fe-508c9ea254eb-6b077f89', name: '病院', type: 'expense', user_id: '', color: '#36A2EB' },
  { id: '827d-452a-b525-ed7d2ea29e26-9efa556d', name: 'スポーツ', type: 'expense', user_id: '', color: '#FFCE56' },
  { id: 'adc9-4214-90b9-18b9d621e267-70171412', name: 'レジャー', type: 'expense', user_id: '', color: '#4BC0C0' },
  { id: 'f007-4745-9d0f-5c716a6bfb52-cc39552f', name: 'ダイエット', type: 'expense', user_id: '', color: '#9966FF' },
  { id: '4580-99b8-045f40986a39-7f742d0c-4c84', name: '薬局', type: 'expense', user_id: '', color: '#FF9F40' },
  { id: '4b54-b4fe-508c9ea254eb-6b077f89-b9f0', name: '生活用品', type: 'expense', user_id: '', color: '#FF6384' },
  { id: '452a-b525-ed7d2ea29e26-9efa556d-827d', name: '交際費', type: 'expense', user_id: '', color: '#36A2EB' },
  { id: '4214-90b9-18b9d621e267-70171412-adc9', name: '交通費', type: 'expense', user_id: '', color: '#FFCE56' },
  { id: '4745-9d0f-5c716a6bfb52-cc39552f-f007', name: 'コンビニ', type: 'expense', user_id: '', color: '#4BC0C0' },
  { id: '99b8-045f40986a39-7f742d0c-4c84-4580', name: 'ファッション', type: 'expense', user_id: '', color: '#9966FF' },
  { id: 'b4fe-508c9ea254eb-6b077f89-b9f0-4b54', name: '美容', type: 'expense', user_id: '', color: '#FF9F40' },
  { id: 'b525-ed7d2ea29e26-9efa556d-827d-452a', name: '食費', type: 'expense', user_id: '', color: '#FF6384' }
];

export const DEFAULT_INCOME_CATEGORIES: Category[] = [
  { id: '90b9-18b9d621e267-70171412-adc9-4214', name: '給与', type: 'income', user_id: '', color: '#4CAF50' },
  { id: '9d0f-5c716a6bfb52-cc39552f-f007-4745', name: 'ボーナス', type: 'income', user_id: '', color: '#8BC34A' },
  { id: '045f40986a39-7f742d0c-4c84-4580-99b8', name: '副業収入', type: 'income', user_id: '', color: '#CDDC39' },
  { id: '508c9ea254eb-6b077f89-b9f0-4b54-b4fe', name: 'フリーランス収入', type: 'income', user_id: '', color: '#FFC107' },
  { id: 'ed7d2ea29e26-9efa556d-827d-452a-b525', name: '投資収入', type: 'income', user_id: '', color: '#FF9800' },
  { id: '18b9d621e267-70171412-adc9-4214-90b9', name: '配当金', type: 'income', user_id: '', color: '#FF5722' },
  { id: '5c716a6bfb52-cc39552f-f007-4745-9d0f', name: '不動産収入', type: 'income', user_id: '', color: '#795548' },
  { id: '7f742d0c-4c84-4580-99b8-045f40986a39', name: '年金', type: 'income', user_id: '', color: '#9E9E9E' },
  { id: '6b077f89-b9f0-4b54-b4fe-508c9ea254eb', name: '利子収入', type: 'income', user_id: '', color: '#607D8B' },
  { id: '9efa556d-827d-452a-b525-ed7d2ea29e26', name: '株式売却益', type: 'income', user_id: '', color: '#2196F3' },
  { id: '70171412-adc9-4214-90b9-18b9d621e267', name: '臨時収入', type: 'income', user_id: '', color: '#03A9F4' },
  { id: 'cc39552f-f007-4745-9d0f-5c716a6bfb52', name: '贈与・お祝い', type: 'income', user_id: '', color: '#00BCD4' },
  { id: 'b1e2c3a4-1234-5678-9abc-def012345678', name: '保険金', type: 'income', user_id: '', color: '#009688' },
  { id: 'c2f3d4b5-2345-6789-abcd-ef0123456789', name: '税金還付', type: 'income', user_id: '', color: '#4CAF50' },
  { id: 'd3a4e5c6-3456-789a-bcde-f0123456789a', name: 'その他収入', type: 'income', user_id: '', color: '#FF5722' }
]; 