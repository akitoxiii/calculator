import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const Calendar = ({ selectedDate, onDateSelect }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          ←
        </button>
        <h2 className="text-xl font-semibold">
          {format(currentMonth, 'yyyy年MM月', { locale: ja })}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
          <div key={day} className="text-center font-medium py-2">
            {day}
          </div>
        ))}
        {days.map((day) => (
          <button
            key={day.toString()}
            onClick={() => onDateSelect(day)}
            className={`p-2 rounded-lg ${
              isSameDay(day, selectedDate)
                ? 'bg-blue-500 text-white'
                : isSameMonth(day, currentMonth)
                ? 'hover:bg-gray-100'
                : 'text-gray-400'
            }`}
          >
            {format(day, 'd')}
          </button>
        ))}
      </div>
    </div>
  );
}; 