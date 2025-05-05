import { TransactionType } from './transactionTypes';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  fromAccount?: string;
  toAccount?: string;
  paymentMethod?: string;
  note?: string;
  category_id?: string;
} 