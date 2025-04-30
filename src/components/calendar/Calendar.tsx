'use client';

import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ja } from 'date-fns/locale';

interface Props {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const Calendar = ({ selectedDate, onDateSelect }: Props) => {
  const startDate = startOfMonth(selectedDate);
  const endDate = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="text-xl font-bold mb-4">
        {format(selectedDate, 'yyyy年MM月', { locale: ja })}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
          <div key={day} className="text-center font-medium p-2">
            {day}
          </div>
        ))}
        {Array.from({ length: startDate.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2" />
        ))}
        {days.map((day) => (
          <button
            key={day.toISOString()}
            onClick={() => onDateSelect(day)}
            className={`p-2 rounded hover:bg-gray-100 ${
              day.toDateString() === selectedDate.toDateString()
                ? 'bg-primary text-white hover:bg-primary/90'
                : ''
            }`}
          >
            {format(day, 'd')}
          </button>
        ))}
      </div>
    </div>
  );
}; 