'use client';

import { useState, useMemo } from 'react';
import { Habit, CheckIn, toISODate, isToday } from '@habit/shared';
import { cn } from '@/lib/utils';
import { Weekday } from '@/types/calendar';

interface CalendarViewProps {
  habit: Habit;
  checkIns: CheckIn[];
}

function getDaysInMonth(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  const days: Date[] = [];

  // Add padding for days before the 1st of the month
  const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const paddingDays = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1; // Adjust for Monday start

  for (let i = 0; i < paddingDays; i++) {
    days.push(new Date(year, month, -i));
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  return days;
}

export function CalendarView({ habit, checkIns }: CalendarViewProps): React.ReactNode {
  const [currentDate, setCurrentDate] = useState(new Date());

  const checkInDates = useMemo(
    () => new Set(checkIns.map((c) => c.date)),
    [checkIns]
  );

  const daysInMonth = useMemo(
    () => getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()),
    [currentDate]
  );

  const goToPreviousMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthYearString = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white p-6">
      {/* Header with month/year and navigation */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{monthYearString}</h3>
        <div className="flex gap-2">
          <button
            onClick={goToPreviousMonth}
            className="rounded bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            ← Prev
          </button>
          <button
            onClick={goToNextMonth}
            className="rounded bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {Object.values(Weekday).map((day) => (
          <div key={day} className="py-2 text-center text-xs font-semibold text-slate-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="mb-6 grid grid-cols-7 gap-1">
        {daysInMonth.map((day, idx) => {
          const dayISODate = toISODate(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isCheckInDay = checkInDates.has(dayISODate);
          const isTodayDay = isToday(dayISODate);
          const isFutureDay = day > new Date() && isCurrentMonth;

          return (
            <div
              key={`${day.getTime()}-${idx}`}
              className={cn(
                'aspect-square flex items-center justify-center rounded text-sm font-medium transition-colors',
                !isCurrentMonth && 'opacity-30',
                isTodayDay && isCheckInDay && 'bg-green-600 text-white ring-2 ring-green-800',
                isTodayDay && !isCheckInDay && 'ring-2 ring-slate-600 text-slate-900',
                isCheckInDay && !isTodayDay && 'bg-green-500 text-white',
                !isCheckInDay && !isTodayDay && isCurrentMonth && !isFutureDay && 'bg-slate-100 text-slate-600',
                !isCheckInDay && !isTodayDay && isFutureDay && 'bg-slate-50 text-slate-300',
                !isCheckInDay && !isTodayDay && !isCurrentMonth && 'bg-white text-slate-400'
              )}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>

      {/* Stats row */}
      <div className="flex gap-8 border-t border-slate-200 pt-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{habit.currentStreak}</div>
          <div className="text-xs text-slate-600">Current Streak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900">{habit.bestStreak}</div>
          <div className="text-xs text-slate-600">Best Streak</div>
        </div>
      </div>
    </div>
  );
}
