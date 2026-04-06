'use client';

import { Habit } from '@habit/shared';
import { HabitCard } from '@/components/HabitCard/HabitCard';

interface HabitListProps {
  habits: Habit[];
}

export function HabitList({ habits }: HabitListProps): React.ReactNode {
  if (habits.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <p className="text-gray-500">No habits yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
    </div>
  );
}
