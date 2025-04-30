export type AssetTransactionType = 'transfer' | 'savings' | 'payment' | 'income';

export interface AssetTransaction {
  id: string;
  date: Date;
  type: AssetTransactionType;
  amount: number;
  description: string;
  paymentMethod?: string;
  category?: string;
  linkedExpenseId?: string;
}

export interface AssetBalance {
  total: number;
  savings: number;
  available: number;
} 