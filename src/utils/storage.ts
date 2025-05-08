import type { Expense, Category } from '@/types/expense';
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '@/types/expense';
import type { Transaction } from '@/types/transaction';

const STORAGE_KEYS = {
  EXPENSES: 'expenses',
  CATEGORIES: 'categories',
  TRANSACTIONS: 'transactions'
} as const;

class Storage {
  constructor() {
    // 初回起動時のカテゴリ初期化処理を削除
  }

  private parseDate(item: any): any {
    if (item instanceof Object) {
      for (let key in item) {
        if (typeof item[key] === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(item[key])) {
          item[key] = new Date(item[key]);
        } else if (item[key] instanceof Object) {
          this.parseDate(item[key]);
        }
      }
    }
    return item;
  }

  // 収支データの操作
  getExpenses(): Expense[] {
    try {
      const expenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      if (!expenses) return [];
      return JSON.parse(expenses).map((expense: any) => ({
        ...expense,
        date: new Date(expense.date),
      }));
    } catch {
      return [];
    }
  }

  saveExpenses(expenses: Expense[]): void {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }

  // 取引データの操作
  getTransactions(): Transaction[] {
    try {
      const transactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (!transactions) return [];
      return JSON.parse(transactions).map((transaction: any) => ({
        ...transaction,
        date: new Date(transaction.date),
      }));
    } catch {
      return [];
    }
  }

  saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }
}

export const storage = new Storage(); 