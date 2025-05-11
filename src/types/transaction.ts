import { TransactionType } from './transactionTypes';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  fromAccount?: string;
  toAccount?: string;
  payment_method: string;
  note?: string;
  memo?: string;
  category_id?: string;
} 