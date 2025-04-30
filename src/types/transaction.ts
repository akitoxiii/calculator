import { TransactionType } from './transactionTypes';

export interface Transaction {
  id: string;
  date: Date;
  type: TransactionType;
  amount: number;
  fromAccount?: string;
  toAccount?: string;
  paymentMethod?: string;
  note?: string;
} 