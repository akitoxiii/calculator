export type CategoryType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  color: string;
}

export interface Expense {
  id: string;
  date: Date;
  amount: number;
  category: string;
  type: CategoryType;
  memo?: string;
}

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: '1', name: 'サブスク', type: 'expense', color: '#FF6384' },
  { id: '2', name: 'ネットショッピング', type: 'expense', color: '#36A2EB' },
  { id: '3', name: '家賃', type: 'expense', color: '#FFCE56' },
  { id: '4', name: '通信費', type: 'expense', color: '#4BC0C0' },
  { id: '5', name: 'ガス', type: 'expense', color: '#9966FF' },
  { id: '6', name: '水道', type: 'expense', color: '#FF9F40' },
  { id: '7', name: '電気代', type: 'expense', color: '#FF6384' },
  { id: '8', name: '病院', type: 'expense', color: '#36A2EB' },
  { id: '9', name: 'スポーツ', type: 'expense', color: '#FFCE56' },
  { id: '10', name: 'レジャー', type: 'expense', color: '#4BC0C0' },
  { id: '11', name: 'ダイエット', type: 'expense', color: '#9966FF' },
  { id: '12', name: '薬局', type: 'expense', color: '#FF9F40' },
  { id: '13', name: '生活用品', type: 'expense', color: '#FF6384' },
  { id: '14', name: '交際費', type: 'expense', color: '#36A2EB' },
  { id: '15', name: '交通費', type: 'expense', color: '#FFCE56' },
  { id: '16', name: 'コンビニ', type: 'expense', color: '#4BC0C0' },
  { id: '17', name: 'ファッション', type: 'expense', color: '#9966FF' },
  { id: '18', name: '美容', type: 'expense', color: '#FF9F40' },
  { id: '19', name: '食費', type: 'expense', color: '#FF6384' }
];

export const DEFAULT_INCOME_CATEGORIES: Category[] = [
  { id: '20', name: '給与', type: 'income', color: '#4CAF50' },
  { id: '21', name: 'ボーナス', type: 'income', color: '#8BC34A' },
  { id: '22', name: '副業収入', type: 'income', color: '#CDDC39' },
  { id: '23', name: 'フリーランス収入', type: 'income', color: '#FFC107' },
  { id: '24', name: '投資収入', type: 'income', color: '#FF9800' },
  { id: '25', name: '配当金', type: 'income', color: '#FF5722' },
  { id: '26', name: '不動産収入', type: 'income', color: '#795548' },
  { id: '27', name: '年金', type: 'income', color: '#9E9E9E' },
  { id: '28', name: '利子収入', type: 'income', color: '#607D8B' },
  { id: '29', name: '株式売却益', type: 'income', color: '#2196F3' },
  { id: '30', name: '臨時収入', type: 'income', color: '#03A9F4' },
  { id: '31', name: '贈与・お祝い', type: 'income', color: '#00BCD4' },
  { id: '32', name: '保険金', type: 'income', color: '#009688' },
  { id: '33', name: '税金還付', type: 'income', color: '#4CAF50' },
  { id: '34', name: 'その他収入', type: 'income', color: '#FF5722' }
]; 