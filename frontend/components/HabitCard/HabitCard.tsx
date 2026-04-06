'use client';

import Link from 'next/link';
import { Habit, HabitStatus } from '@habit/shared';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
}

const statusConfig = {
  [HabitStatus.ACTIVE]: {
    label: 'Active',
    className: 'bg-green-100 text-green-800',
  },
  [HabitStatus.PAUSED]: {
    label: 'Paused',
    className: 'bg-yellow-100 text-yellow-800',
  },
  [HabitStatus.ARCHIVED]: {
    label: 'Archived',
    className: 'bg-gray-100 text-gray-800',
  },
};

export function HabitCard({ habit }: HabitCardProps): React.ReactNode {
  const statusConfig_ = statusConfig[habit.status];

  return (
    <Link href={`/habits/${habit.id}`}>
      <div className="h-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md cursor-pointer">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{habit.name}</h3>
          <span
            className={cn(
              'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
              statusConfig_.className
            )}
          >
            {statusConfig_.label}
          </span>
        </div>

        {habit.description && (
          <p className="mb-4 text-sm text-gray-600 line-clamp-2">
            {habit.description}
          </p>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {habit.currentStreak}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Current Streak
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {habit.bestStreak}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Best Streak
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {habit.totalCheckIns}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Check-ins
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
