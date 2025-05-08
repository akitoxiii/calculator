'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ja } from 'date-fns/locale';
import ExpenseModal from './ExpenseModal';
import { supabase } from '@/utils/supabase';
import { useUser } from '@clerk/nextjs';

export type Expense = {
  id: string;
  date: string;
  category: string;
  amount: number;
  paymentMethod: string;
  note?: string;
};

export default function HouseholdTab() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id);
      if (!error && data) {
        setExpenses(data as Expense[]);
      }
    };
    fetchExpenses();
  }, [user, isModalOpen]);

  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleAddExpense = async (expense: Omit<Expense, 'id'>) => {
    if (!user) return;
    const insertData = {
      ...expense,
      user_id: user.id,
      date: typeof expense.date === 'string' ? expense.date : format(expense.date, 'yyyy-MM-dd'),
    };
    const { error } = await supabase.from('expenses').insert([insertData]);
    if (!error) {
      setIsModalOpen(false);
      // 再取得はuseEffectで自動
    }
  };

  return (
    <div>
      <div className="grid grid-cols-7 gap-1">
        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
          <div key={day} className="p-2 text-center font-medium">
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dayExpenses = expenses.filter(
            (expense) => format(new Date(expense.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
          );
          const totalAmount = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);

          return (
            <button
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              className="p-2 border rounded-lg hover:bg-gray-50"
            >
              <div className="text-sm">{format(day, 'd')}</div>
              {totalAmount > 0 && (
                <div className="text-xs text-gray-600 mt-1">
                  ¥{totalAmount.toLocaleString()}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {isModalOpen && selectedDate && (
        <ExpenseModal
          date={selectedDate}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddExpense}
        />
      )}
    </div>
  );
} 