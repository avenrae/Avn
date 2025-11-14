import { useState } from 'react';

type Props = {
  onDateSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  selectedDate?: Date;
};

export default function Calendar({ onDateSelect, minDate, maxDate, selectedDate }: Props) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateSelect(newDate);
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">{monthName}</h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-indigo-50 rounded-lg transition"
            aria-label="Previous month"
          >
            ←
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-indigo-50 rounded-lg transition"
            aria-label="Next month"
          >
            →
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {emptyDays.map((i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Days of month */}
        {days.map((day) => {
          const disabled = isDateDisabled(day);
          const selected = isDateSelected(day);

          return (
            <button
              key={day}
              onClick={() => !disabled && handleDateClick(day)}
              disabled={disabled}
              className={`
                aspect-square rounded-lg text-sm font-medium transition
                ${selected
                  ? 'bg-indigo-600 text-white shadow-md'
                  : disabled
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    : 'bg-gray-50 text-gray-800 hover:bg-indigo-100 hover:shadow-sm cursor-pointer'
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 text-xs text-gray-500">
        <p>✓ Available dates shown above (bookings 7 days in advance)</p>
      </div>
    </div>
  );
}
